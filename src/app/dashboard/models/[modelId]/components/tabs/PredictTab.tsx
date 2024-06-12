'use client';

import { DatasetDto, ModelDto } from '@/app/api.types';
import DynamicForm, {
  DynamicFormSchema,
} from '@/app/dashboard/models/[modelId]/components/DynamicForm';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import PredictionResult from '@/app/dashboard/models/[modelId]/components/PredictionResult';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';

async function createPrediction(modelId: string, data: any) {
  return await fetch(`/api/models/${modelId}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function getDataset(datasetId: string) {
  return fetch(`/api/datasets/${datasetId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

interface PredictTabProps {
  model: ModelDto;
}

export default function PredictTab({ model }: PredictTabProps) {
  const params = useParams<{ modelId: string }>();
  const [isPredictionLoading, setIsPredictionLoading] = useState(false);
  const [dataset, setDataset] = useState<DatasetDto | undefined>(undefined);

  async function handlePredictionResults(datasetId: string | null) {
    if (!datasetId) {
      toast.error('Dataset was not created successfully');
      return;
    }

    setIsPredictionLoading(true);

    const predictionDataset = await new Promise<DatasetDto>((resolve) => {
      const intervalId = setInterval(async () => {
        const res = await getDataset(datasetId);
        const { success, data }: ApiResponse = await res.json();

        if (data.status === 'SUCCESS' || data.status === 'FAILURE') {
          clearInterval(intervalId);
          resolve(data);
        }
      }, 3000);
    });

    setIsPredictionLoading(false);
    setDataset(predictionDataset);
  }

  const handleFormSubmit = async (formData: any) => {
    const res = await createPrediction(params.modelId, Object.values(formData));
    const { success, data, message }: ApiResponse<{ datasetId: string }> =
      await res.json();
    if (success) {
      const datasetId = data!.datasetId;
      await handlePredictionResults(datasetId);
    } else {
      toast.error(`Error creating prediction:  ${message}`);
      await handlePredictionResults(null);
    }
  };

  function generatePredictionFormSchema(model: ModelDto): DynamicFormSchema[] {
    return model.independentFeatures.map((independentFeature) => {
      const dynamicFormSchema: DynamicFormSchema = {
        sectionTitle: '',
        fields: [
          {
            type:
              independentFeature.featureType === 'NUMERICAL'
                ? 'text'
                : 'select',
            name: independentFeature.name,
            label: independentFeature.name,
            required: true,
            placeholder: 'Insert value...',
            options: independentFeature.possibleValues?.map(
              (possibleValue) => ({
                label: possibleValue,
                value: independentFeature.name,
              }),
            ),
          },
        ],
      };
      return dynamicFormSchema;
    });
  }

  const predictionFormSchema = generatePredictionFormSchema(model);

  return (
    <div className="container mt-5">
      <DynamicForm schema={predictionFormSchema} onSubmit={handleFormSubmit} />

      <PredictionResult
        model={model}
        loading={isPredictionLoading}
        dataset={dataset}
      />
    </div>
  );
}
