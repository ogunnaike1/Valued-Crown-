import ModulePage from "@/components/admin/ModulePage";

export default function AdminModule({ params }: { params: { slug: string[] } }) {
  return <ModulePage slug={params.slug} />;
}
