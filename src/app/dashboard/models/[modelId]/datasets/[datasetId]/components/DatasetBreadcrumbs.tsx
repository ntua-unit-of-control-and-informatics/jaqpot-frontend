'use client';

import { ModelDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React from 'react';

export default function DatasetBreadcrumbs(props: {
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
      <BreadcrumbItem href="/dashboard/datasets/">Datasets</BreadcrumbItem>
      <BreadcrumbItem
        href={`/dashboard/${props.modelId}/datasets/${props.datasetId}`}
      >
        {props.datasetId}
      </BreadcrumbItem>
    </Breadcrumbs>
  );
}
