import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-brand-navy mb-2">
        Dashboard
      </h1>
      <p className="text-brand-mid text-sm mb-8">
        {count ?? 0} {count === 1 ? "product" : "products"} listed
      </p>
    </div>
  );
}