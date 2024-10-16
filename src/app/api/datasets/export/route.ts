import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import {
  generateResultTableRow,
  JAQPOT_METADATA_KEY,
  JAQPOT_ROW_ID_KEY,
  JAQPOT_ROW_LABEL_KEY,
} from '@/app/util/dataset';
import { useMemo } from 'react';

function generateCSVFromData(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset: DatasetDto,
) {
  let headerRow = [...independentFeatures, ...dependentFeatures]
    .map((feature) => {
      return feature.name;
    })
    .join(',');

  const hasProbabilities =
    dataset?.result?.some((resultRow) => {
      const jaqpotMetadata = (resultRow as any)[JAQPOT_METADATA_KEY];
      return !!jaqpotMetadata?.probabilities;
    }) ?? false;

  if (hasProbabilities) {
    headerRow += ',Probabilities';
  }

  const hasJaqpotRowLabel = dataset?.result?.some((resultRow) => {
    const jaqpotMetadata = (resultRow as any)[JAQPOT_METADATA_KEY];
    return !!jaqpotMetadata?.[JAQPOT_ROW_LABEL_KEY];
  });

  if (hasJaqpotRowLabel) {
    headerRow += ',Jaqpot Row Label';
  }

  const resultRows =
    dataset.result?.map((result: any, resultIndex: number) => {
      return generateResultTableRow(
        independentFeatures,
        dependentFeatures,
        dataset,
        resultIndex,
        result,
      )
        .map((row) => {
          if (row.toString().includes(',')) {
            return `"${row}"`;
          }
          return row;
        })
        .join(',');
    }) ?? [];

  return [headerRow, ...resultRows].join('\n');
}

export async function POST(request: Request) {
  const { independentFeatures, dependentFeatures, dataset } =
    await request.json();
  const csv = generateCSVFromData(
    independentFeatures,
    dependentFeatures,
    dataset,
  );

  const headers = new Headers();
  headers.append('Content-Disposition', 'attachment; filename="results.csv"');
  headers.append('Content-Type', 'application/csv');

  return new Response(csv, {
    headers: {
      'Content-Disposition': 'attachment; filename="results.csv"',
      'Content-Type': 'application/csv',
    },
  });
}
