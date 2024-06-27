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
        href={`/dashboard/models/${props.model.id}`}
        isDisabled={true}
        classNames={{
          item: 'whitespace-normal',
        }}
      >
        {props.model.name}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
