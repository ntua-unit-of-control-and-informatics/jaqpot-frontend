import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import React from 'react';
import { Checkbox } from '@nextui-org/checkbox';
import { Button } from '@nextui-org/button';
import OrganizationInvitation from '@/app/dashboard/organizations/[orgName]/invitations/[invitationId]/components/OrganizationInvitation';
import { notFound } from 'next/navigation';
import { OrganizationDto, OrganizationInvitationDto } from '@/app/api.types';
import { getOrganizationByName } from '@/app/dashboard/organizations/[orgName]/requests';

async function getOrganizationInvitation(
  orgName: string,
  invitationId: string,
): Promise<OrganizationInvitationDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${orgName}/invitations/${invitationId}`,
    {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    if (res.status >= 500) {
      throw new Error('Unexpected error occurred');
    }
    return undefined;
  }
  return res.json();
}

export default async function Page({
  params,
}: {
  params: Promise<{ orgName: string; invitationId: string }>;
}) {
  const { orgName, invitationId } = await params;
  const session = await auth();
  if (!isAuthenticated(session)) {
    return (
      <div>
        To access the invitation you have to be logged in or sign up with the
        email address associated with the invitation.
      </div>
    );
  }

  const organization = await getOrganizationByName(orgName);
  if (!organization) {
    notFound();
  }
  const organizationInvitation = await getOrganizationInvitation(
    orgName,
    invitationId,
  );

  if (!organizationInvitation) {
    notFound();
  }

  return (
    <OrganizationInvitation
      organization={organization}
      invitation={organizationInvitation}
    />
  );
}
