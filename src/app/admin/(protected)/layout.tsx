import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import AdminNav from "@/components/AdminNav";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">{children}</div>
    </div>
  );
}
