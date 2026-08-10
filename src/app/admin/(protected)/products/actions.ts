"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return {};
}

function parseFormFields(formData: FormData) {
  return {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    part_number: formData.get("part_number") as string,
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category") as string,
    fitment: formData.get("fitment") as string,
    description: formData.get("description") as string,
    condition: formData.get("condition") as string,
    in_stock: formData.get("in_stock") === "on",
  };
}

async function uploadImages(
  formData: FormData,
  slug: string
): Promise<string[]> {
  const supabase = await createClient();
  const files = formData.getAll("images") as File[];
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const fileExt = file.name.split(".").pop();
    const filePath = `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) {
      throw new Error("Image upload failed: " + error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath);

    urls.push(publicUrl);
  }

  return urls;
}

export async function createProduct(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const fields = parseFormFields(formData);

  let imageUrls: string[] = [];
  try {
    imageUrls = await uploadImages(formData, fields.slug);
  } catch (err) {
    return { error: (err as Error).message };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      ...fields,
      image_url: imageUrls[0] ?? null, // first photo = cover photo
    })
    .select()
    .single();

  if (error || !product) {
    if (error?.code === "23505") {
      return { error: "That URL slug is already in use — try a different one." };
    }
    return { error: error?.message ?? "Something went wrong." };
  }

  if (imageUrls.length > 0) {
    const rows = imageUrls.map((url, i) => ({
      product_id: product.id,
      image_url: url,
      sort_order: i,
    }));
    await supabase.from("product_images").insert(rows);
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  return {};
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const fields = parseFormFields(formData);

  let imageUrls: string[] = [];
  try {
    imageUrls = await uploadImages(formData, fields.slug);
  } catch (err) {
    return { error: (err as Error).message };
  }

  const updateData: Record<string, unknown> = { ...fields };

  if (imageUrls.length > 0) {
    // Get current highest sort_order to append after existing photos
    const { data: existing } = await supabase
      .from("product_images")
      .select("sort_order")
      .eq("product_id", id)
      .order("sort_order", { ascending: false })
      .limit(1);

    const startOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

    const rows = imageUrls.map((url, i) => ({
      product_id: id,
      image_url: url,
      sort_order: startOrder + i,
    }));
    await supabase.from("product_images").insert(rows);

    // If there's no cover photo yet, use the first newly uploaded one
    const { data: currentProduct } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    if (!currentProduct?.image_url) {
      updateData.image_url = imageUrls[0];
    }
  }

  const { error } = await supabase
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That URL slug is already in use — try a different one." };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${fields.slug}`);
  return {};
}

export async function deleteProductImage(
  imageId: string,
  productSlug: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/admin/products`);
  revalidatePath(`/shop/${productSlug}`);
  return {};
}

export async function setCoverPhoto(
  productId: string,
  imageUrl: string,
  productSlug: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ image_url: imageUrl })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${productSlug}`);
  return {};
}