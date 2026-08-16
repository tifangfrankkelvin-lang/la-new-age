"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGES = 10;

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: "Unable to delete product." };
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return {};
}

function parseFormFields(formData: FormData) {
  const price = Number(formData.get("price"));
  return {
    name: String(formData.get("name") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    part_number: String(formData.get("part_number") ?? "").trim(),
    price,
    category: String(formData.get("category") ?? "").trim(),
    fitment: String(formData.get("fitment") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    condition: String(formData.get("condition") ?? ""),
    in_stock: formData.get("in_stock") === "on",
  };
}

function validateFields(fields: ReturnType<typeof parseFormFields>) {
  if (!fields.name || !fields.slug || !fields.part_number || !fields.category) return "Required product fields are missing.";
  if (!Number.isFinite(fields.price) || fields.price < 0) return "Invalid product price.";
  if (!["new", "used"].includes(fields.condition)) return "Invalid product condition.";
  return null;
}

async function uploadImages(formData: FormData, slug: string): Promise<string[]> {
  const supabase = await createClient();
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > MAX_IMAGES) throw new Error("Too many images.");
  const urls: string[] = [];

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
      throw new Error("Only JPEG, PNG, and WebP images up to 10 MB are allowed.");
    }
    const extension = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const filePath = `${slug}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file, { contentType: file.type, upsert: false });
    if (error) throw new Error("Image upload failed.");
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(filePath);
    urls.push(publicUrl);
  }
  return urls;
}

export async function createProduct(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = parseFormFields(formData);
  const validationError = validateFields(fields);
  if (validationError) return { error: validationError };

  let imageUrls: string[] = [];
  try { imageUrls = await uploadImages(formData, fields.slug); } catch (err) { return { error: (err as Error).message }; }

  const { data: product, error } = await supabase.from("products").insert({ ...fields, image_url: imageUrls[0] ?? null }).select().single();
  if (error || !product) return { error: error?.code === "23505" ? "That URL slug is already in use." : "Unable to create product." };

  if (imageUrls.length) {
    const { error: imageError } = await supabase.from("product_images").insert(imageUrls.map((url, i) => ({ product_id: product.id, image_url: url, sort_order: i })));
    if (imageError) return { error: "Product created, but images could not be saved." };
  }
  revalidatePath("/admin/products"); revalidatePath("/"); revalidatePath("/shop");
  return {};
}

export async function updateProduct(id: string, formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = parseFormFields(formData);
  const validationError = validateFields(fields);
  if (validationError) return { error: validationError };

  let imageUrls: string[] = [];
  try { imageUrls = await uploadImages(formData, fields.slug); } catch (err) { return { error: (err as Error).message }; }
  const updateData: Record<string, unknown> = { ...fields };

  if (imageUrls.length) {
    const { data: existing } = await supabase.from("product_images").select("sort_order").eq("product_id", id).order("sort_order", { ascending: false }).limit(1);
    const startOrder = existing?.length ? existing[0].sort_order + 1 : 0;
    await supabase.from("product_images").insert(imageUrls.map((url, i) => ({ product_id: id, image_url: url, sort_order: startOrder + i })));
    const { data: currentProduct } = await supabase.from("products").select("image_url").eq("id", id).single();
    if (!currentProduct?.image_url) updateData.image_url = imageUrls[0];
  }

  const { error } = await supabase.from("products").update(updateData).eq("id", id);
  if (error) return { error: error.code === "23505" ? "That URL slug is already in use." : "Unable to update product." };
  revalidatePath("/admin/products"); revalidatePath("/"); revalidatePath("/shop"); revalidatePath(`/shop/${fields.slug}`);
  return {};
}

export async function deleteProductImage(imageId: string, productSlug: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) return { error: "Unable to delete image." };
  revalidatePath("/admin/products"); revalidatePath(`/shop/${productSlug}`);
  return {};
}

export async function setCoverPhoto(productId: string, imageUrl: string, productSlug: string): Promise<{ error?: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { data: image } = await supabase.from("product_images").select("id").eq("product_id", productId).eq("image_url", imageUrl).maybeSingle();
  if (!image) return { error: "That image does not belong to this product." };
  const { error } = await supabase.from("products").update({ image_url: imageUrl }).eq("id", productId);
  if (error) return { error: "Unable to update cover photo." };
  revalidatePath("/admin/products"); revalidatePath("/"); revalidatePath("/shop"); revalidatePath(`/shop/${productSlug}`);
  return {};
}
