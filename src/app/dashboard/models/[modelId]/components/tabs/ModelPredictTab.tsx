'use client';

import { ModelDto, ModelTypeDto } from '@/app/api.types';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import { Spinner } from '@nextui-org/spinner';
import ModelPredictionForm from '@/app/dashboard/models/[modelId]/components/ModelPredictionForm';
import { isAuthenticated } from '@/app/util/auth';
import Alert from '@/app/components/Alert';
import { useSession } from 'next-auth/react';

export async function createPrediction(modelId: string, data: any) {
  return await fetch(`/api/models/${modelId}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function createPredictionWithCSV(
  modelId: string,
  formData: FormData,
) {
  return await fetch(`/api/models/${modelId}/predict/csv`, {
    method: 'POST',
    body: formData,
  });
}

interface ModelPredictTabProps {
  model: ModelDto;
}

export default function ModelPredictTab({ model }: ModelPredictTabProps) {
  const params = useParams<{ modelId: string }>();
  const [loading, setIsLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<string | undefined>(undefined);
  const { data: session } = useSession();

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    const res = await createPrediction(params.modelId, [formData]);
    const { success, data, message }: ApiResponse<{ datasetId: string }> =
      await res.json();
    if (success) {
      setDatasetId(data!.datasetId);
    } else {
      toast.error(`Error creating prediction:  ${message}`);
    }
    setIsLoading(false);
  };

  const handleCSVFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const res = await createPredictionWithCSV(params.modelId, formData);
    const { success, data, message }: ApiResponse<{ datasetId: string }> =
      await res.json();
    if (success) {
      setDatasetId(data!.datasetId);
    } else {
      toast.error(`Error creating prediction:  ${message}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mt-2">
      {!isAuthenticated(session) && (
        <Alert
          type="warning"
          title="Authentication required!"
          description="You need to be logged in to make predictions"
        />
      )}
      <ModelPredictionForm
        onFormSubmit={handleFormSubmit}
        model={model}
        onCSVFormSubmit={handleCSVFormSubmit}
      />

      {loading && <Spinner className="my-3" />}
      {datasetId && <DatasetResults model={model} datasetId={datasetId} />}
    </div>
  );
}
