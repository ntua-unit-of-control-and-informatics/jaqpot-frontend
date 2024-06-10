import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import { errorResponse } from '@/app/util/response';

export async function POST(
  request: Request,
  { params }: { params: { modelId: string } },
) {
  const session = await auth();
  if (!session) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
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
  const datasetUrl = res.headers.get('Location');

  if (!res.ok || !res.headers.get('Location')) {
    if (res.status === 401 || res.status === 403) {
      return errorResponse(
        'You are not authorized to predict on this model',
        res.status,
      );
    }

    return errorResponse('Unexpected error occurred', 500);
  }

  return Response.json({ datasetUrl }, { status: 200 });
}
