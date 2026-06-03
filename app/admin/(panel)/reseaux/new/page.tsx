import type { Metadata } from "next";
import AdminPageHeader from "@/components/AdminPageHeader";
import SocialLinkForm from "@/components/SocialLinkForm";
import { createSocialLink } from "@/lib/actions/reseaux";

export const metadata: Metadata = { title: "Nouveau réseau — Admin", robots: { index: false } };

export default async function NewSocialLinkPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <AdminPageHeader
        title="Nouveau <em>réseau social</em>"
        description="Ajoutez un lien vers un réseau social du club. Le logo s'affichera automatiquement dans le pied de page."
        backHref="/admin/reseaux"
        backLabel="Retour à la liste"
      />
      <SocialLinkForm action={createSocialLink} error={error} />
    </>
  );
}
