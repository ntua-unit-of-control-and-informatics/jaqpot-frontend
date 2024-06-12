import { notFound } from 'next/navigation';
import { ModelDto, OrganizationDto } from '@/app/api.types';
import { auth } from '@/auth';
import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { isAuthenticated } from '@/app/util/auth';
import OrganizationTabs from '@/app/dashboard/organizations/[orgName]/components/OrganizationTabs';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import OrganizationBreadcrumbs from '@/app/dashboard/organizations/[orgName]/components/OrganizationBreadcrumbs';

async function getOrganizationByName(
  orgName: string,
): Promise<OrganizationDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${orgName}`,
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) return undefined;
  return res.json();
}

export default async function Page({
  params,
}: {
  params: { orgName: string };
}) {
  const organization = await getOrganizationByName(params.orgName);
  if (!organization) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <OrganizationBreadcrumbs organization={organization} />
      <div className="max-w-4xl mx-auto rounded-lg">
        <div className="flex mb-10 items-center text-2xl font-bold leading-7  sm:truncate sm:text-3xl sm:tracking-tight">
          <BuildingOfficeIcon className="size-8 mr-2" />
          {organization.name}
        </div>
        <OrganizationTabs organization={organization} />
      </div>
    </div>
  );
}
