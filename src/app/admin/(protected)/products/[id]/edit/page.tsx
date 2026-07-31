import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/ProductForm";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-6">
        Edit Product
      </h1>
      <ProductForm initialProduct={product} action={updateWithId} />
    </div>
  );
}