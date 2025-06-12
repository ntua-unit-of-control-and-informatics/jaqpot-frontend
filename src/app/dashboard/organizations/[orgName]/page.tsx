import { redirect } from 'next/navigation';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';

export async function generateMetadata(
  props: {
    params: Promise<{ orgName: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const organization = await getOrganizationByName(params.orgName);

  return generateSharedMetadata(organization?.name, organization?.description);
}

export default async function Page(
  props: {
    params: Promise<{ orgName: string }>;
  }
) {
  const params = await props.params;
  redirect(`/dashboard/organizations/${params.orgName}/description`);
}
