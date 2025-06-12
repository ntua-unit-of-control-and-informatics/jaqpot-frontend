import { redirect, usePathname } from 'next/navigation';

export default function Page({ params }: { params: { modelId: string } }) {
  redirect(`/dashboard/models/${params.modelId}/description`);
}
