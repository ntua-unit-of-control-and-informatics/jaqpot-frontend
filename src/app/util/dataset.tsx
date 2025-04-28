import { Chip } from '@nextui-org/chip';
import React, { ReactNode } from 'react';
import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import { Fetcher } from 'swr';
import { ApiResponse } from '@/app/util/response';
import { CustomError } from '@/app/types/CustomError';

export const JAQPOT_METADATA_KEY = 'jaqpotMetadata';
export const JAQPOT_ROW_ID_KEY = 'jaqpotRowId';
export const JAQPOT_ROW_LABEL_KEY = 'jaqpotRowLabel';

export function getDatasetStatusNode(dataset: DatasetDto | null | undefined) {
  if (!dataset) {
    return <></>;
  } else if (dataset?.status === 'SUCCESS') {
    return (
      <Chip color="success" variant="flat" data-testid={'success'}>
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

export interface ResultTableHeader {
  key: string;
  label: string;
}

type BaseResultTableRow = {
  key: string;
  probabilities?: string;
  doa?: string;
};

export type ResultTableRow = BaseResultTableRow & Record<string, string>;

export interface ResultTableData {
  headers: ResultTableHeader[];
  rows: ResultTableRow[];
}

export function generateResultTableData(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset?: DatasetDto | null,
  options?: {
    hideIndependentFeatures?: boolean;
  },
): ResultTableData {
  if (!dataset) {
    return { headers: [], rows: [] };
  }

  let hasProbabilities = false;
  let hasDoa = false;
  let hasJaqpotRowLabel = false;
  dataset.result?.forEach((resultRow: any) => {
    if (resultRow[JAQPOT_METADATA_KEY]?.probabilities) {
      hasProbabilities = true;
    }
    if (resultRow[JAQPOT_METADATA_KEY]?.doa) {
      hasDoa = true;
    }
    if (resultRow[JAQPOT_METADATA_KEY]?.[JAQPOT_ROW_LABEL_KEY]) {
      hasJaqpotRowLabel = true;
    }
  });

  const headers: ResultTableHeader[] = [
    ...independentFeatures.map((feature) => ({
      label: feature.name,
      key: feature.key,
    })),
    ...dependentFeatures.map((feature) => ({
      label: feature.name,
      key: feature.key,
    })),
    ...(hasProbabilities
      ? [{ label: 'Probabilities', key: 'probabilities' }]
      : []),
    ...(hasDoa ? [{ label: 'Applicability Domain', key: 'doa' }] : []),
    ...(hasJaqpotRowLabel
      ? [{ label: 'Jaqpot Row label', key: JAQPOT_ROW_LABEL_KEY }]
      : []),
  ];

  if (options?.hideIndependentFeatures) {
    headers.splice(0, independentFeatures.length);
  }

  const rows =
    dataset.result?.map((result, index) =>
      generateResultTableRow(
        independentFeatures,
        dependentFeatures,
        dataset,
        index,
        result,
        options?.hideIndependentFeatures,
      ),
    ) ?? [];

  return { headers, rows };
}

function generateResultTableRow(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset: DatasetDto,
  resultIndex: number,
  result: any,
  hideIndependentFeatures: boolean = false,
): ResultTableRow {
  const resultTableRow = {
    key: resultIndex.toString(),
  } as ResultTableRow;
  const hasProbabilities = result[JAQPOT_METADATA_KEY]?.probabilities;
  const hasDoa = result[JAQPOT_METADATA_KEY]?.doa;
  const jaqpotRowId = result[JAQPOT_METADATA_KEY]?.[JAQPOT_ROW_ID_KEY];
  const jaqpotRowLabel = result[JAQPOT_METADATA_KEY]?.[JAQPOT_ROW_LABEL_KEY];

  independentFeatures.forEach((feature, independentFeatureIndex) => {
    let value;
    let input = dataset.input.find(
      (inputRow) =>
        jaqpotRowId !== undefined &&
        (inputRow as any)[JAQPOT_ROW_ID_KEY] === jaqpotRowId,
    ) as any;
    if (!input) {
      input = dataset.input[resultIndex];
    }

    if (!input) {
      value = 'N/A';
    } else if (feature.featureType === 'CATEGORICAL') {
      const possibleValue = feature.possibleValues?.find(
        (possibleValue) => possibleValue.value === input[feature.key],
      );
      value =
        possibleValue?.description ?? // qsartoolbox possible values response
        possibleValue?.value ??
        input[feature.key];
    } else {
      value = input[feature.key];
    }
    resultTableRow[feature.key] = value;
  });

  dependentFeatures.forEach((feature, index) => {
    resultTableRow[feature.key] = result[feature.key];
  });

  if (hasProbabilities) {
    resultTableRow.probabilities = parseProbabilities(
      result[JAQPOT_METADATA_KEY].probabilities,
    );
  }

  if (hasDoa) {
    resultTableRow.doa = result[JAQPOT_METADATA_KEY].doa.majorityVoting
      ? 'In Domain'
      : 'Out of Domain';
    resultTableRow.doaDetails = result[JAQPOT_METADATA_KEY].doa;
  }

  if (jaqpotRowLabel) {
    resultTableRow[JAQPOT_ROW_LABEL_KEY] = jaqpotRowLabel;
  }

  return resultTableRow;
}

export const datasetFetcher: Fetcher<ApiResponse<DatasetDto>, string> = async (
  url,
) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const message = (await res.json()).message;
    const status = res.status;
    // Attach extra info to the error object.
    throw new CustomError(message, status);
  }

  return res.json();
};
