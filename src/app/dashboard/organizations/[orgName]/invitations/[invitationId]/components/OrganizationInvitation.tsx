'use client';

import { Button } from "@heroui/button";
import React from 'react';
import { OrganizationDto, OrganizationInvitationDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface OrganizationInvitationProps {
  organization: OrganizationDto;
  invitation: OrganizationInvitationDto;
}

async function updateInvitation(
  organizationInvitation: OrganizationInvitationDto,
  orgName: string,
  invitationId: string,
) {
  return await fetch(
    `/api/organizations/${orgName}/invitations/${invitationId}`,
    {
      method: 'PUT',
      body: JSON.stringify(organizationInvitation),
    },
  );
}

export default function OrganizationInvitation({
  organization,
  invitation,
}: OrganizationInvitationProps) {
  const router = useRouter();

  async function handleSubmit(status: OrganizationInvitationDto['status']) {
    const res = await updateInvitation(
      { ...invitation, status: 'ACCEPTED' },
      organization.name,
      invitation.id!,
    );

    const { success, message } = await res.json();

    if (success) {
      toast.success(
        `You have successfully been added to the organization: ${organization.name}. You can now view and execute the models shared with that organization.`,
      );
      router.push('/dashboard');
    } else {
      toast.error(`Invitation could not be updated: ${message}`);
    }
  }

  return (
    <>
      <Breadcrumbs className="mb-8">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/organizations" isDisabled={true}>
          Organizations
        </BreadcrumbItem>
        <BreadcrumbItem href={`/dashboard/organizations/${organization.name}`}>
          {organization.name}
        </BreadcrumbItem>
        <BreadcrumbItem
          href={`/dashboard/organizations/${organization.name}/invitations`}
          isDisabled={true}
        >
          Invitations
        </BreadcrumbItem>
        <BreadcrumbItem
          href={`/dashboard/organizations/${organization.name}/invitations/${invitation.id}`}
          isDisabled={true}
        >
          {invitation.id}
        </BreadcrumbItem>
      </Breadcrumbs>

      {(invitation.status === 'ACCEPTED' ||
        invitation.status === 'REJECTED') && (
        <div>
          This invitation has already been {invitation.status} and can no longer
          be accessed
        </div>
      )}
      {invitation.status !== 'ACCEPTED' && invitation.status !== 'REJECTED' && (
        <div className="mx-auto mt-4 flex max-w-3xl flex-col gap-4">
          <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
            You have been invited to join the organization: {organization.name}
          </h2>
          <div className="mx-auto mb-4 flex max-w-3xl flex-col justify-center">
            <h1 className="mb-4 text-xl font-bold">
              Do you wish to accept the invitation to this organization?
            </h1>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                color="success"
                onClick={() => handleSubmit('ACCEPTED')}
                className="text-white"
              >
                <CheckIcon className="size-6" /> Yes
              </Button>
              <Button
                color="danger"
                onClick={() => handleSubmit('REJECTED')}
                className="text-white"
              >
                <XMarkIcon className="size-6" /> No
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
