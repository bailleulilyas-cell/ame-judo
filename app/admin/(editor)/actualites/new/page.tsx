import type { Metadata } from "next";
import ActualiteEditor from "@/components/ActualiteEditor";
import { createActualite } from "@/lib/actions/actualites";

export const metadata: Metadata = {
  title: "Nouvelle actualité",
  robots: { index: false },
};

export default function NewActualitePage() {
  return <ActualiteEditor mode="create" action={createActualite} />;
}
