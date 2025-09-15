'use client';

import { ModelDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import React from 'react';

export default function SearchModelsBreadcrumbs() {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/models">Models</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/models" isDisabled={true}>
        Search
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
