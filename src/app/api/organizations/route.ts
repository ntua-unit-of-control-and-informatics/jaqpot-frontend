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

  const res = await fetch(`${process.env.API_URL}/v1/organizations`, {
    headers: {
      Authorization: `Bearer ${session!.token}`,
      'Content-Type': 'application/json',
    },
  });

  return handleApiResponse(res);
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const organizationDto = await request.json();

  const res = await fetch(`${process.env.API_URL}/v1/organizations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session!.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(organizationDto),
  });

  const apiResponse = await handleApiResponse(res);
  const data = await apiResponse.json();

  if (data.success) {
    const organizationUrl = res.headers.get('Location')!;
    const organizationUrlParts = organizationUrl.split('/');
    const organizationName =
      organizationUrlParts[organizationUrlParts.length - 1];

    return NextResponse.json(
      { success: true, data: { organizationName } },
      { status: 201 },
    );
  } else {
    return errorResponse(data.message);
  }
}
