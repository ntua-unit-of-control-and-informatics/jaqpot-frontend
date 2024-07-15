'use client';

import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React from 'react';

export default function DatasetsBreadcrumbs() {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/datasets">Datasets</BreadcrumbItem>
    </Breadcrumbs>
  );
}
