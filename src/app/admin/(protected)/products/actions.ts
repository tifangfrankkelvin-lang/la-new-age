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

async function uploadImageIfPresent(
  formData: FormData,
  slug: string
): Promise<string | null> {
  const supabase = await createClient();
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    return null;
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${slug}-${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) {
    throw new Error("Image upload failed: " + error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return publicUrl;
}

export async function createProduct(
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const fields = parseFormFields(formData);

  let image_url: string | null = null;
  try {
    image_url = await uploadImageIfPresent(formData, fields.slug);
  } catch (err) {
    return { error: (err as Error).message };
  }

  const { error } = await supabase.from("products").insert({
    ...fields,
    image_url,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "That URL slug is already in use — try a different one." };
    }
    return { error: error.message };
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

  let image_url: string | null = null;
  try {
    image_url = await uploadImageIfPresent(formData, fields.slug);
  } catch (err) {
    return { error: (err as Error).message };
  }

  const updateData: Record<string, unknown> = { ...fields };
  if (image_url) {
    updateData.image_url = image_url;
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