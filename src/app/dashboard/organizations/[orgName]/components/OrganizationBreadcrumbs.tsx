'use client';

import { OrganizationDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React from 'react';

export default function OrganizationBreadcrumbs(props: {
  organization: OrganizationDto;
}) {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/organizations" isDisabled={true}>
        Organizations
      </BreadcrumbItem>
      <BreadcrumbItem
        href={`/dashboard/organizations/${props.organization.name}`}
        isDisabled={true}
      >
        {props.organization.name}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
