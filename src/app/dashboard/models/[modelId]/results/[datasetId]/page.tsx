import { getModel } from '@/app/dashboard/models/[modelId]/[tabName]/page';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import ResultBreadcrumbs from '@/app/dashboard/models/[modelId]/results/[datasetId]/components/ResultBreadcrumbs';

export const metadata: Metadata = generateSharedMetadata(
  'Result',
  'Explore datasets used as inputs for predictive models and view prediction results on the Jaqpot platform. Manage and analyze datasets seamlessly to improve model accuracy',
);

export default async function Page({
  params,
}: {
  params: Promise<{ modelId: string; datasetId: string }>;
}) {
  const { modelId, datasetId } = await params;
  const model = await getModel(modelId);
  if (!model) {
    notFound();
  }

  return (
    <>
      <ResultBreadcrumbs
        modelId={modelId}
        datasetId={datasetId}
      />
      <DatasetResults datasetId={datasetId} model={model} />
    </>
  );
}
