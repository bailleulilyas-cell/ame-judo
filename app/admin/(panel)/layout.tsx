import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
