import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import {
  generateResultTableData,
  JAQPOT_METADATA_KEY,
  JAQPOT_ROW_ID_KEY,
  JAQPOT_ROW_LABEL_KEY,
} from '@/app/util/dataset';
import { useMemo } from 'react';
import { getKeyValue } from "@heroui/react";

function generateCSVFromData(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset: DatasetDto,
) {
  const { headers, rows } = generateResultTableData(
    independentFeatures,
    dependentFeatures,
    dataset,
  );

  const headerRow = headers.map((header) => header.label).join(',');

  const rowsIn2DArray = rows.map((row) => {
    return headers.map((header) => {
      if (header.key === JAQPOT_METADATA_KEY) {
        return JSON.stringify(getKeyValue(row, header.key));
      }
      return row[header.key];
    });
  });
  const resultRows = rowsIn2DArray.map((rowValues) => {
    const escapedRowValues = rowValues.map((value) => {
      if (value?.toString().includes(',')) {
        return `"${value}"`;
      }
      return value;
    });

    return escapedRowValues.join(',');
  });

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
