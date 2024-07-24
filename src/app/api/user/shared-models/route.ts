import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';
import { generatePaginationAndSortingSearchParams } from '@/app/util/sort';

const PAGE_SIZE = '10';

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const searchParams = generatePaginationAndSortingSearchParams(request);

  const res = await fetch(
    `${process.env.API_URL}/v1/user/shared-models?${searchParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
