import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';
import { generatePaginationAndSortingSearchParams } from '@/app/util/sort';

export async function POST(
  request: NextRequest,
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
    `${process.env.API_URL}/v1/user/models/${modelId}/datasets`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );

  return handleApiResponse(res);
}

export async function GET(
  request: NextRequest,
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

  const searchParams = generatePaginationAndSortingSearchParams(request);

  const res = await fetch(
    `${process.env.API_URL}/v1/user/models/${modelId}/datasets?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
