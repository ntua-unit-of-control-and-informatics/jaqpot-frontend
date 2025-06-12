import { redirect } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ modelId: string }>;
}) {
  const params = await props.params;
  redirect(`/dashboard/models/${params.modelId}/description`);
}
