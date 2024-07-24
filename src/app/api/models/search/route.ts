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
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const hasQuery = request.nextUrl.searchParams.has('query');
  if (!hasQuery) {
    return errorResponse(
      'You need to provide a search query to search for models',
    );
  }
  const query = request.nextUrl.searchParams.get('query')!;
  const searchParams = generatePaginationAndSortingSearchParams(request);
  searchParams.append('query', query);

  const res = await fetch(
    `${process.env.API_URL}/v1/models/search?${searchParams}`,
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
