import { Chip } from '@nextui-org/chip';
import React from 'react';
import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';

export const JAQPOT_METADATA_KEY = 'jaqpotMetadata';
export const JAQPOT_ROW_ID_KEY = 'jaqpotRowId';
export const JAQPOT_ROW_LABEL_KEY = 'jaqpotRowLabel';

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

function parseProbabilities(Probabilities: object) {
  return Object.entries(Probabilities)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join(' ');
}

export function generateResultTableRow(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset: DatasetDto,
  resultIndex: number,
  result: any,
): string[] {
  const hasProbabilities = result[JAQPOT_METADATA_KEY]?.probabilities;
  const jaqpotRowId = result[JAQPOT_METADATA_KEY]?.[JAQPOT_ROW_ID_KEY];
  const jaqpotRowLabel = result[JAQPOT_METADATA_KEY]?.[JAQPOT_ROW_LABEL_KEY];

  const independentFeatureCellValues: string[] = independentFeatures.map(
    (feature, independentFeatureIndex) => {
      let input = dataset.input.find(
        (inputRow) =>
          jaqpotRowId !== undefined &&
          (inputRow as any)[JAQPOT_ROW_ID_KEY] === jaqpotRowId,
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

  const probabilities = hasProbabilities
    ? [parseProbabilities(result[JAQPOT_METADATA_KEY].probabilities)]
    : [];

  const jaqpotRowLabelCellValue = jaqpotRowLabel ? [jaqpotRowLabel] : [];

  return [
    ...independentFeatureCellValues,
    ...dependentFeatureCellValues,
    ...probabilities,
    ...jaqpotRowLabelCellValue,
  ];
}
