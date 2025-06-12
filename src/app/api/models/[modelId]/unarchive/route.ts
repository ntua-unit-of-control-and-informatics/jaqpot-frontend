import { auth } from '@/auth';
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

  const res = await fetch(
    `${process.env.API_URL}/v1/models/${params.modelId}/unarchive`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
