import { Metadata } from 'next';
import {
  generateSharedMetadata,
  jaqpotAppDescription,
  openGraphImage,
} from '@/app/shared.metadata';
import ModelCategories from '@/app/dashboard/explore/components/ModelCategories';
import ExplorePageBreadcrumbs from '@/app/dashboard/explore/components/ExplorePageBreadcrumbs';

export const metadata: Metadata = generateSharedMetadata(
  'Explore models',
  'Discover a wide range of predictive models categorized for easy navigation. Click on any category to explore and utilize models tailored to your needs',
);

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return (
    <>
      <ExplorePageBreadcrumbs categories={slug} />
      <ModelCategories categories={slug} />
    </>
  );
}
