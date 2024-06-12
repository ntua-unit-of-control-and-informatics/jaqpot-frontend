import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import { errorResponse, handleApiResponse } from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';

export async function POST(
  request: Request,
  { params }: { params: { modelId: string } },
) {
  const session = await auth();
  if (!isAuthenticated(session)) {
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
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataset),
    },
  );
  const data = (await handleApiResponse(res)).json();
}
