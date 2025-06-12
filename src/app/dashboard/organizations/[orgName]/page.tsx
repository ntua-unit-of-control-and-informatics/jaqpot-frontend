import { redirect } from 'next/navigation';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orgName: string }>;
}): Promise<Metadata> {
  const { orgName } = await params;
  const organization = await getOrganizationByName(orgName);

  return generateSharedMetadata(organization?.name, organization?.description);
}

export default async function Page({
  params,
}: {
  params: Promise<{ orgName: string }>;
}) {
  const { orgName } = await params;
  redirect(`/dashboard/organizations/${orgName}/description`);
}
