import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, props: { params: Promise<{ modelId: string }> }): Promise<NextResponse<ApiResponse>> {
  const params = await props.params;
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const { input, resultTypes } = await request.json();

  const dataset: DatasetDto = {
    type: 'PREDICTION',
    entryType: 'ARRAY',
    input,
    resultTypes,
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

  const apiResponse = await handleApiResponse(res);
  const data = await apiResponse.json();

  if (data.success) {
    const datasetUrl = res.headers.get('Location')!;
    const datasetUrlParts = datasetUrl.split('/');
    const datasetId = datasetUrlParts[datasetUrlParts.length - 1];

    return NextResponse.json(
      { success: true, data: { datasetId } },
      { status: 201 },
    );
  } else {
    return errorResponse(data.message);
  }
}
