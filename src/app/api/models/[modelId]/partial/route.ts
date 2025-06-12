import { auth } from '@/auth';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ modelId: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { modelId } = await params;
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const data = await request.json();
  const res = await fetch(
    `${process.env.API_URL}/v1/models/${modelId}/partial`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return handleApiResponse(res);
}
