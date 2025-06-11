import { redirect } from 'next/navigation';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export async function generateMetadata({
  params,
}: {
  params: { orgName: string };
}): Promise<Metadata> {
  const organization = await getOrganizationByName(params.orgName);

  return generateSharedMetadata(organization?.name, organization?.description);
}

export default async function Page({
  params,
}: {
  params: { orgName: string };
}) {
  redirect(`/dashboard/organizations/${params.orgName}/description`);
}
