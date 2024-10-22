'use client';

import { ModelDto } from '@/app/api.types';
import { BreadcrumbItem, Breadcrumbs } from '@nextui-org/breadcrumbs';
import React from 'react';

interface ExplorePageBreadcrumbsProps {
  categories?: string[];
}

function generateUrlFromCategories(categories: string[]) {
  return `/explore/${categories.join('/')}`;
}

export default function ExplorePageBreadcrumbs({
  categories,
}: ExplorePageBreadcrumbsProps) {
  return (
    <Breadcrumbs className="mb-4">
      <BreadcrumbItem href="/dashboard/explore">Explore models</BreadcrumbItem>
      {categories?.map((category, index) => (
        <BreadcrumbItem
          key={category}
          href={generateUrlFromCategories(categories?.slice(0, index + 1))}
        >
          {category}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
