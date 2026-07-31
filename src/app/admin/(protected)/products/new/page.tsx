import ProductForm from "@/components/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-6">
        Add Product
      </h1>
      <ProductForm action={createProduct} />
    </div>
  );
}