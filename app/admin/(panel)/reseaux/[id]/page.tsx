import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminPageHeader from "@/components/AdminPageHeader";
import SocialLinkForm from "@/components/SocialLinkForm";
import { getSocialLinkById } from "@/lib/data";
import { updateSocialLink } from "@/lib/actions/reseaux";
import { SOCIAL_PLATFORMS } from "@/lib/socials";

export const metadata: Metadata = { title: "Modifier réseau — Admin", robots: { index: false } };

export default async function EditSocialLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const link = await getSocialLinkById(id);
  if (!link) notFound();

  return (
    <>
      <AdminPageHeader
        title={`Modifier — <em>${SOCIAL_PLATFORMS[link.plateforme].label}</em>`}
        backHref="/admin/reseaux"
        backLabel="Retour à la liste"
      />
      <SocialLinkForm
        link={link}
        action={updateSocialLink.bind(null, id)}
        error={error}
      />
    </>
  );
}
