'use client';

import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import DynamicForm, {
  DynamicFormFieldType,
  DynamicFormSchema,
} from '@/app/dashboard/models/[modelId]/components/DynamicForm';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import { Spinner } from '@nextui-org/spinner';
import { Radio, RadioGroup } from '@nextui-org/react';
import UploadCSVForm from '@/app/dashboard/models/[modelId]/components/UploadCSVForm';
import Alert from '@/app/components/Alert';
import { isAuthenticated } from '@/app/util/auth';
import { useSession } from 'next-auth/react';

async function createPrediction(modelId: string, data: any) {
  return await fetch(`/api/models/${modelId}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async function createPredictionWithCSV(modelId: string, formData: FormData) {
  return await fetch(`/api/models/${modelId}/predict/csv`, {
    method: 'POST',
    body: formData,
  });
}

interface PredictTabProps {
  model: ModelDto;
}

export default function PredictTab({ model }: PredictTabProps) {
  const { data: session } = useSession();
  const params = useParams<{ modelId: string }>();
  const [loading, setIsLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<string | undefined>(undefined);
  const [predictionUploadType, setPredictionUploadType] = useState('form');

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

  function generateFieldTypeFromFeature(
    independentFeature: FeatureDto,
  ): DynamicFormFieldType {
    switch (independentFeature.featureType) {
      case 'INTEGER':
      case 'FLOAT':
        return 'number';
      case 'CATEGORICAL':
        return 'select';
      case 'TEXT':
      case 'SMILES':
        return 'text';
      default:
        return 'number';
    }
  }

  function generatePredictionFormSchema(model: ModelDto): DynamicFormSchema[] {
    console.log(model.independentFeatures);
    return model.independentFeatures.map((independentFeature) => {
      const dynamicFormSchema: DynamicFormSchema = {
        sectionTitle: '',
        fields: [
          {
            type: generateFieldTypeFromFeature(independentFeature),
            name: independentFeature.key,
            label: independentFeature.label,
            required: true,
            placeholder: 'Insert value...',
            options: independentFeature.possibleValues?.map(
              (possibleValue) => ({
                label: possibleValue,
                value: independentFeature.label,
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
    <div className="container mt-2">
      {!isAuthenticated(session) && (
        <Alert
          type="warning"
          title="Authentication required!"
          description="You need to be logged in to make predictions"
        />
      )}
      <RadioGroup
        label="Choose Your Prediction Input Method"
        orientation="horizontal"
        value={predictionUploadType}
        onValueChange={setPredictionUploadType}
        className="mb-5"
        classNames={{
          label: 'text-tiny',
        }}
      >
        <Radio
          value="form"
          classNames={{
            label: 'text-sm',
          }}
        >
          Fill out the form
        </Radio>
        <span className="mx-4">or</span>
        <Radio
          value="csv"
          classNames={{
            label: 'text-sm',
          }}
        >
          Upload a CSV file
        </Radio>
      </RadioGroup>

      {predictionUploadType === 'form' && (
        <DynamicForm
          schema={predictionFormSchema}
          onSubmit={handleFormSubmit}
        />
      )}
      {predictionUploadType === 'csv' && (
        <UploadCSVForm model={model} onSubmit={handleCSVFormSubmit} />
      )}

      {loading && <Spinner className="my-3" />}
      {datasetId && <DatasetResults model={model} datasetId={datasetId} />}
    </div>
  );
}
