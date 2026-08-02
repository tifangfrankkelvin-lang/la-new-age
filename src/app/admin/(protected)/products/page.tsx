import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "./actions";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl uppercase text-brand-navy">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="bg-brand-navy text-white text-sm font-semibold uppercase tracking-wide px-5 py-2.5 hover:bg-brand-orange transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="border border-brand-mid/20 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-brand-light text-left text-xs uppercase tracking-wide text-brand-mid">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-brand-mid/10">
                <td className="px-4 py-3 text-brand-navy font-medium">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-brand-steel">{p.category}</td>
                <td className="px-4 py-3 text-brand-steel">${p.price}</td>
                <td className="px-4 py-3">
                  {p.in_stock ? (
                    <span className="text-green-700 text-xs uppercase">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-brand-mid text-xs uppercase">
                      Sold Out
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-4">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-brand-orange text-xs font-semibold uppercase hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton onDelete={deleteProduct.bind(null, p.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="px-4 py-8 text-center text-brand-mid text-sm">
            No products yet. Add your first one.
          </p>
        )}
      </div>
    </div>
  );
}