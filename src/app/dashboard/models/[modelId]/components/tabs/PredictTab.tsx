'use client';

import { DatasetDto, ModelDto } from '@/app/api.types';
import DynamicForm, {
  DynamicFormSchema,
} from '@/app/dashboard/models/[modelId]/components/DynamicForm';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import { Spinner } from '@nextui-org/spinner';

async function createPrediction(modelId: string, data: any) {
  return await fetch(`/api/models/${modelId}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

interface PredictTabProps {
  model: ModelDto;
}

export default function PredictTab({ model }: PredictTabProps) {
  const params = useParams<{ modelId: string }>();
  const [loading, setIsLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<string | undefined>(undefined);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    const res = await createPrediction(params.modelId, Object.values(formData));
    const { success, data, message }: ApiResponse<{ datasetId: string }> =
      await res.json();
    if (success) {
      setDatasetId(data!.datasetId);
    } else {
      toast.error(`Error creating prediction:  ${message}`);
    }
    setIsLoading(false);
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

      {loading && <Spinner className="my-3" />}
      {datasetId && <DatasetResults model={model} datasetId={datasetId} />}
    </div>
  );
}
