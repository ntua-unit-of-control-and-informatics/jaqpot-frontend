'use client';

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import React from 'react';

export default function ModelsBreadcrumbs() {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/models">Models</BreadcrumbItem>
    </Breadcrumbs>
  );
}
