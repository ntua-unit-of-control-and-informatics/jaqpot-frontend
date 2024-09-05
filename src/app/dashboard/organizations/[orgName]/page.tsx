import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/solid';
import { isAuthenticated } from '@/app/util/auth';
import OrganizationTabs from '@/app/dashboard/organizations/[orgName]/components/OrganizationTabs';
import OrganizationBreadcrumbs from '@/app/dashboard/organizations/[orgName]/components/OrganizationBreadcrumbs';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import { getModel } from '@/app/dashboard/models/[modelId]/[tabName]/page';
import { Tooltip } from '@nextui-org/tooltip';

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
