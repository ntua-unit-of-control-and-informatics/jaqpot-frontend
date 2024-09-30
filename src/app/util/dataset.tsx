import { Chip } from '@nextui-org/chip';
import React from 'react';
import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';

export const JAQPOT_INTERNAL_ID_KEY = 'jaqpotInternalId';

export function getDatasetStatusNode(dataset: DatasetDto | null | undefined) {
  if (!dataset) {
    return <></>;
  } else if (dataset?.status === 'SUCCESS') {
    return (
      <Chip color="success" variant="flat">
        Success
      </Chip>
    );
  } else if (dataset?.status === 'FAILURE') {
    return (
      <Chip color="danger" variant="flat">
        Failed
      </Chip>
    );
  } else {
    return <Chip color="primary">In progress</Chip>;
  }
}

export function generateResultTableRow(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset: DatasetDto,
  resultIndex: number,
  result: any,
  jaqpotInternalId?: string,
): string[] {
  const independentFeatureCellValues: string[] = independentFeatures.map(
    (feature, independentFeatureIndex) => {
      let input = dataset.input.find(
        (inputRow) =>
          jaqpotInternalId !== undefined &&
          (inputRow as any)[JAQPOT_INTERNAL_ID_KEY] === jaqpotInternalId,
      ) as any;
      if (!input) {
        input = dataset.input[resultIndex];
      }

      if (!input) {
        return 'N/A';
      }

      if (feature.featureType === 'CATEGORICAL') {
        return (
          feature.possibleValues?.find(
            (possibleValue) => possibleValue.key === input[feature.key],
          )?.value ?? input[feature.key]
        );
      }

      return input[feature.key];
    },
  );

  const dependentFeatureCellValues = dependentFeatures.map((feature, index) => {
    return result[feature.key];
  });
  return [...independentFeatureCellValues, ...dependentFeatureCellValues];
}
