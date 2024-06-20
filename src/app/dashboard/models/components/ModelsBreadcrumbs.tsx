'use client';

import { ModelDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React from 'react';

export default function ModelsBreadcrumbs() {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/models">Models</BreadcrumbItem>
    </Breadcrumbs>
  );
}
