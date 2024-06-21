import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { isAuthenticated } from '@/app/util/auth';

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

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') || '0';
  const size = PAGE_SIZE;

  const res = await fetch(
    `${process.env.API_URL}/v1/shared-models?${new URLSearchParams({ page, size })}`,
    {
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
