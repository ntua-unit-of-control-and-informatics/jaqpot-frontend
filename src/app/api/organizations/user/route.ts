import { auth } from '@/auth';
import { DatasetDto } from '@/app/api.types';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const res = await fetch(`${process.env.API_URL}/v1/organizations/user`, {
    headers: {
      Authorization: `Bearer ${session!.token}`,
      'Content-Type': 'application/json',
    },
  });

  return handleApiResponse(res);
}
