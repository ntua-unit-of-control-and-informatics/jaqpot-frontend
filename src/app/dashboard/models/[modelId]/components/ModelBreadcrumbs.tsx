'use client';

import { ModelDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React from 'react';

export default function ModelBreadcrumbs(props: { model: ModelDto }) {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/models">Models</BreadcrumbItem>
      <BreadcrumbItem
        href={`/dashboard/organizations/${props.model.name}`}
        isDisabled={true}
      >
        {props.model.id}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
