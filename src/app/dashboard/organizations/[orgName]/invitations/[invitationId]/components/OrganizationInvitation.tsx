'use client';

import { Button } from '@nextui-org/button';
import React from 'react';
import { OrganizationDto, OrganizationInvitationDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface OrganizationInvitationProps {
  organization: OrganizationDto;
  invitation: OrganizationInvitationDto;
}

export default function OrganizationInvitation({
  organization,
  invitation,
}: OrganizationInvitationProps) {
  function handleAccept() {}

  function handleReject() {}
  return (
    <>
      <Breadcrumbs className="mb-4">
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
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
          You have been invited to join the organization: {organization.name}
        </h2>
        <div className="max-w-3xl mx-auto flex flex-col justify-center mb-4">
          <h1 className="text-xl font-bold mb-4">
            Do you accept the invitation to this organization?
          </h1>
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              color="success"
              onClick={handleAccept}
              className="text-white"
            >
              <CheckIcon className="size-6" /> Yes
            </Button>
            <Button
              color="danger"
              onClick={handleReject}
              className="text-white"
            >
              <XMarkIcon className="size-6" /> No
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
