import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export function errorResponse(
  message: string = 'Uh-oh! Looks like something went wrong. Our crack team of chemical engineers and electrotechnicians is on the case. Please try again later!',
  status: number = 500,
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, message }, { status });
}

export async function handleApiResponse(
  res: Response,
): Promise<NextResponse<ApiResponse>> {
  if (!res.ok) {
    return errorResponse();
  } else if (res.status === 401) {
    return errorResponse('Unauthenticated', 401);
  } else if (res.status === 403) {
    return errorResponse('Unauthorized', 403);
  } else {
    const data = await res.json();
    return NextResponse.json({ success: true, data }, { status: res.status });
  }
}

export async function handleRouteHandlerResponse<T = void>(
  res: Response,
): Promise<T | undefined> {
  const body = await res.json();
  if (body.success) {
    return body.data;
  } else {
    toast.error(body.message);
    return undefined;
  }
}
