'use client';

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import React from 'react';

export default function ResultsBreadcrumbs() {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/datasets">Results</BreadcrumbItem>
    </Breadcrumbs>
  );
}
