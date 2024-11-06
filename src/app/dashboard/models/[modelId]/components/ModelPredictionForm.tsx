'use client';

import DynamicForm, {
  DynamicFormFieldType,
  DynamicFormSchema,
} from '@/app/dashboard/models/[modelId]/components/DynamicForm';
import { FeatureDto, ModelDto } from '@/app/api.types';
import { isAuthenticated } from '@/app/util/auth';
import Alert from '@/app/components/Alert';
import { Radio, RadioGroup } from '@nextui-org/react';
import UploadCSVForm from '@/app/dashboard/models/[modelId]/components/UploadCSVForm';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { components } from '@/app/api.schema';

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
    case 'STRING':
    case 'SMILES':
      return 'text';
    case 'FLOAT_ARRAY':
      return 'floatarray';
    case 'STRING_ARRAY':
      return 'stringarray';
    default:
      return 'number';
  }
}

function generateDynamicFormFieldFromFeature(independentFeature: {
  id?: number;
  meta?: { [p: string]: Record<string, never> };
  key: string;
  name: string;
  units?: string;
  range?: string;
  description?: string;
  featureType: components['schemas']['FeatureType'];
  featureDependency?: 'DEPENDENT' | 'INDEPENDENT';
  visible?: boolean;
  possibleValues?: components['schemas']['FeaturePossibleValue'][];
  createdAt?: string;
  updatedAt?: string;
}) {
  return {
    sectionTitle: '',
    fields: [
      {
        type: generateFieldTypeFromFeature(independentFeature),
        name: independentFeature.key,
        label: independentFeature.name,
        labelTooltip: (
          <div className="px-1 py-2">
            <div className="text-tiny">
              Type: {independentFeature.featureType}
            </div>
            {independentFeature.description && (
              <div className="text-tiny">
                Description: {independentFeature.description}
              </div>
            )}
            {independentFeature.units && (
              <div className="text-tiny">Units: {independentFeature.units}</div>
            )}
            {independentFeature.range && (
              <div className="text-tiny">Range: {independentFeature.range}</div>
            )}
          </div>
        ),
        required: true,
        placeholder: 'Insert value...',
        options: independentFeature.possibleValues?.map((possibleValue) => ({
          key: possibleValue.key,
          value: possibleValue.value,
        })),
      },
    ],
  };
}

function generatePredictionFormSchema(
  model: ModelDto,
  includeIndependentFeatures: boolean | undefined,
): DynamicFormSchema[] {
  const independentFeaturesFormSchema = model.independentFeatures.map(
    (independentFeature) =>
      generateDynamicFormFieldFromFeature(independentFeature),
  );
  let dependentFeaturesFormSchema: DynamicFormSchema[] = [];
  if (includeIndependentFeatures) {
    dependentFeaturesFormSchema = model.dependentFeatures.map(
      (dependentFeature) =>
        generateDynamicFormFieldFromFeature(dependentFeature),
    );
  }
  return [...independentFeaturesFormSchema, ...dependentFeaturesFormSchema];
}

interface ModelPredictionFormProps {
  model: ModelDto;
  onFormSubmit: (formData: any) => Promise<void>;
  onCSVFormSubmit: (formData: FormData) => Promise<void>;
  includeIndependentFeatures?: boolean;
}

export default function ModelPredictionForm({
  model,
  onFormSubmit,
  onCSVFormSubmit,
  includeIndependentFeatures = false,
}: ModelPredictionFormProps) {
  const { data: session } = useSession();
  const [predictionUploadType, setPredictionUploadType] = useState('form');

  const predictionFormSchema = generatePredictionFormSchema(
    model,
    includeIndependentFeatures,
  );

  return (
    <>
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
          Upload a CSV file (max 100 rows)
        </Radio>
      </RadioGroup>

      {predictionUploadType === 'form' && (
        <DynamicForm schema={predictionFormSchema} onSubmit={onFormSubmit} />
      )}
      {predictionUploadType === 'csv' && (
        <UploadCSVForm model={model} onSubmit={onCSVFormSubmit} />
      )}
    </>
  );
}
