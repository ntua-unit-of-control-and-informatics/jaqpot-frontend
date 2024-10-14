import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import { generateResultTableRow } from '@/app/util/dataset';

function generateCSVFromData(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
  dataset: DatasetDto,
) {
  const headerRow = [...independentFeatures, ...dependentFeatures]
    .map((feature) => {
      return feature.name;
    })
    .join(',');

  const resultRows =
    dataset.result?.map((result: any, resultIndex: number) => {
      return generateResultTableRow(
        independentFeatures,
        dependentFeatures,
        dataset,
        resultIndex,
        result,
        false,
      ).join(',');
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
