import { notFound } from 'next/navigation';
import { ModelDto, OrganizationDto } from '@/app/api.types';
import { auth } from '@/auth';
import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

async function getOrganizationByName(
  orgName: string,
): Promise<OrganizationDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (session?.user) {
    authorizationHeader['Authorization'] = `Bearer ${session.token}`;
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
  console.log(organization);
  if (!organization) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto rounded-lg">
        <div className="flex mb-10 items-center text-2xl font-bold leading-7  sm:truncate sm:text-3xl sm:tracking-tight">
          <BuildingOfficeIcon className="size-8 mr-2" />
          Organization
        </div>

        <p>Name: {organization.name}</p>

        <h5>Description:</h5>
        <p className="text-gray-700 mb-4">{organization.description}</p>

        <div className="mb-4">
          {organization.website && (
            <p className="text-gray-700">
              Website:{' '}
              <a href={organization.website} className="text-blue-500">
                {organization.website}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
