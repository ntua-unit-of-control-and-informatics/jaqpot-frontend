import { NextResponse } from 'next/server';
import {
  ApiResponse,
  errorResponse,
  handleApiResponse,
} from '@/app/util/response';
import { auth } from '@/auth';
import { isAuthenticated } from '@/app/util/auth';

function iteratorToStream(reader: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await reader.read();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: { modelId: string; datasetId: string } },
) {
  const session = await auth();
  if (!isAuthenticated(session)) {
    return errorResponse(
      'You need to be authenticated to access this endpoint',
      401,
    );
  }

  const body = await request.json();

  const streamResponse = await fetch(
    `${process.env.API_URL}/v1/models/${params.modelId}/predict/stream/${params.datasetId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session!.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!streamResponse.ok) {
    return errorResponse('Failed to create streaming prediction', 500);
  }

  const reader = streamResponse
    .body!.pipeThrough(new TextDecoderStream())
    .getReader();

  const stream = iteratorToStream(reader);

  return new Response(stream);
}
