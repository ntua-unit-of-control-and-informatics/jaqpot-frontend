import { FeatureDto, ModelDto } from '@/app/api.types';

function generateCSVFromModel(
  independentFeatures: FeatureDto[],
  dependentFeatures: FeatureDto[],
) {
  return [...independentFeatures].map((feature) => feature.name).join(',');
}

export async function POST(request: Request) {
  const { independentFeatures, dependentFeatures } = await request.json();
  const csv = generateCSVFromModel(independentFeatures, dependentFeatures);
  // const fileBlob = new Blob([csv], { type: 'text/csv' });

  // This is the key part - set the headers to tell the browser to download the file
  const headers = new Headers();
  // remember to change the filename here
  headers.append('Content-Disposition', 'attachment; filename="sample.csv"');
  headers.append('Content-Type', 'application/csv');

  return new Response(csv, {
    headers: {
      'Content-Disposition': 'attachment; filename="sample.csv"',
      'Content-Type': 'application/csv',
    },
  });
}
