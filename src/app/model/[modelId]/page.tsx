import { redirect, usePathname } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ modelId: string }> }) {
  const { modelId } = await params;
  redirect(`/dashboard/models/${modelId}/description`);
}
