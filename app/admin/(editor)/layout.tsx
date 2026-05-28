import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Layout dédié à l'éditeur d'actualité : plein écran, sans sidebar admin.
 * On reste authentifié.
 */
export default async function EditorLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }
  return <div className="editor-shell">{children}</div>;
}
