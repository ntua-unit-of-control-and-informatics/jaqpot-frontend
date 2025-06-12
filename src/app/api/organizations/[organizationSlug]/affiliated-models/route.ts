import { NextRequest, NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';
import { generatePaginationAndSortingSearchParams } from '@/app/util/sort';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ organizationSlug: string }> }
): Promise<NextResponse<ApiResponse>> {
  const params = await props.params;
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const searchParams = generatePaginationAndSortingSearchParams(request);

  const res = await fetch(
    `${process.env.API_URL}/v1/organizations/${params.organizationSlug}/affiliated-models?${searchParams}`,
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/json',
      },
    },
  );

  return handleApiResponse(res);
}
