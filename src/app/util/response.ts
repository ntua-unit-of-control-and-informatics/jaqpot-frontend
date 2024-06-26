import toast from 'react-hot-toast';
import { NextResponse } from 'next/server';
import { signOut } from '@/auth';
import { ApiErrorCode, EMAIL_NOT_VERIFIED } from '@/app/api.error';
import { ErrorCode } from 'intl-messageformat';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T | null;
  code?: ApiErrorCode;
  statusCode?: number;
}

const defaultUnknownErrorMessage =
  'Uh-oh! Looks like something went wrong. Our crack team of chemical engineers and electrotechnicians is on the case. Please try again later!';

export function errorResponse(
  message: string = defaultUnknownErrorMessage,
  status: number = 500,
): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, message, data: null }, { status });
}

export async function getErrorMessageFromResponse(
  res: Response,
): Promise<string> {
  let message;
  let resBody;
  try {
    const resBody = await res.json();
    switch (resBody.code) {
      case EMAIL_NOT_VERIFIED:
        message = 'User email is not verified, please verify your email';
        break;
      default:
        message = undefined;
    }
  } catch (e) {
    console.error('Could not parse json response');
    return defaultUnknownErrorMessage;
  }

  if (message) return message;

  return getMessageFromStatusCode(res.status);
}

function getMessageFromStatusCode(statusCode: number) {
  switch (statusCode) {
    case 401:
      return 'You need to be authenticated to access this endpoint.';
    case 403:
      return 'You are not authorized to access this resource.';
    default:
      return defaultUnknownErrorMessage;
  }
}

async function signoutUserIf401(status: number, code: any) {
  if (status === 401 && code !== EMAIL_NOT_VERIFIED) {
    await signOut();
  }
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

  if (!res.ok) {
    await signoutUserIf401(res.status, data?.code);
    const message = data?.message ?? getMessageFromStatusCode(res.status);
    return errorResponse(message, res.status);
  }

  return NextResponse.json({ success: true, data }, { status: res.status });
}
