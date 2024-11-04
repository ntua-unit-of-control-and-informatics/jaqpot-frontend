import { ModelDto } from '@/app/api.types';
import ModelPredictionForm from '@/app/dashboard/models/[modelId]/components/ModelPredictionForm';
import { useEffect, useState } from 'react';
import { ApiResponse } from '@/app/util/response';
import toast from 'react-hot-toast';
import {
  createPrediction,
  createPredictionWithCSV,
} from '@/app/dashboard/models/[modelId]/components/tabs/ModelPredictTab';
import useSWR from 'swr';
import { datasetFetcher } from '@/app/util/dataset';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import ValidateModelResults from '@/app/dashboard/models/[modelId]/components/ValidateModelResults';
import { Spinner } from '@nextui-org/spinner';

interface ValidateModelProps {
  model: ModelDto;
}

export default function ValidateModel({ model }: ValidateModelProps) {
  const [loading, setIsLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<string | undefined>(undefined);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    const res = await createPrediction(model.id!.toString(), [formData]);
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
    const res = await createPredictionWithCSV(model.id!.toString(), formData);
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
    <div>
      <ModelPredictionForm
        model={model}
        onFormSubmit={handleFormSubmit}
        onCSVFormSubmit={handleCSVFormSubmit}
        includeIndependentFeatures={true}
      />
      {loading && <Spinner className="my-3" />}
      {datasetId && (
        <ValidateModelResults model={model} datasetId={datasetId} />
      )}
    </div>
  );
}
