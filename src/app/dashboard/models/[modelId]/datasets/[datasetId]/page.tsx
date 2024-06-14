import { getModel } from '@/app/dashboard/models/[modelId]/page';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { modelId: string; datasetId: string };
}) {
  const model = await getModel(params.modelId);
  if (!model) {
    notFound();
  }

  return <DatasetResults datasetId={params.datasetId} model={model} />;
}
