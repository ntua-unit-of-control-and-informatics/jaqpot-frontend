import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import { errorResponse } from '@/app/util/response';

export async function POST(
  request: Request,
  { params }: { params: { modelId: string } },
) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const values = await request.json();

  const dataset: DatasetDto = {
    type: 'PREDICTION',
    input: [
      {
        type: 'ARRAY',
        values,
      },
    ],
  };

  const res = await fetch(
    `${process.env.API_URL}/v1/models/${params.modelId}/predict`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataset),
    },
  );
  const predictionUrl = res.headers.get('Location');

  if (!res.ok || !res.headers.get('Location')) {
    return errorResponse('Unexpected error ocurred', 500);
  }

  return Response.json({ predictionUrl }, { status: 200 });
}
