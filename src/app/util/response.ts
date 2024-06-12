import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
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
  let message;
  if (!res.ok) {
    switch (res.status) {
      case 401:
        message = 'You are not authenticated. Please log in and try again';
        break;
      case 403:
        message = 'You are not authorized to access this resource.';
        break;
      default:
        message =
          'Uh-oh! Looks like something went wrong. Our crack team of chemical engineers and electrotechnicians is on the case. Please try again later!';
    }
    return errorResponse(message, res.status);
  }

  const contentType = res.headers.get('Content-Type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else if (contentType.includes('text/')) {
    data = await res.text();
  }

  return NextResponse.json({ success: true, data }, { status: res.status });
}
