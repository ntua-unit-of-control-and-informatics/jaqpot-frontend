'use client';

import { ModelDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import React from 'react';

export default function ResultBreadcrumbs(props: {
  modelId: string;
  datasetId: string;
}) {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/models">Models</BreadcrumbItem>
      <BreadcrumbItem href={`/dashboard/models/${props.modelId}`}>
        {props.modelId}
      </BreadcrumbItem>
      <BreadcrumbItem href="/dashboard/results/">Results</BreadcrumbItem>
      <BreadcrumbItem
        href={`/dashboard/${props.modelId}/results/${props.datasetId}`}
      >
        {props.datasetId}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
