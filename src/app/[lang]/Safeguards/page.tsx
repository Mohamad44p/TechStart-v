import SafeG from "@/components/safeG/SafeG";

export const dynamic = "force-dynamic";

export default async function SafeguardsPage(
  props: {
    params: Promise<{ lang: string }>;
  }
) {
  const params = await props.params;
  return (
    <div>
      <SafeG lang={params.lang} />
    </div>
  );
}
