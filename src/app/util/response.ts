import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';
import { signOut } from '@/auth';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T | null;
}

const defaultUnknownErrorMessage =
  'Uh-oh! Looks like something went wrong. Our crack team of chemical engineers and electrotechnicians is on the case. Please try again later!';

export function errorResponse(
  message: string = defaultUnknownErrorMessage,
  status: number = 500,
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, message, data: null }, { status });
}

export async function handleApiResponse(
  res: Response,
): Promise<NextResponse<ApiResponse>> {
  const contentType = res.headers.get('Content-Type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else if (contentType.includes('text/')) {
    data = await res.text();
  }

  let message;
  if (!res.ok) {
    switch (res.status) {
      case 401:
        message = 'You are not authenticated. Please log in and try again.';
        await signOut();
        break;
      case 403:
        message = 'You are not authorized to access this resource.';
        break;
      default:
        message = data?.message || defaultUnknownErrorMessage;
    }
    return errorResponse(message, res.status);
  }

  return NextResponse.json({ success: true, data }, { status: res.status });
}
