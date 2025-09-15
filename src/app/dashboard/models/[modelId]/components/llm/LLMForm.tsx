import { Textarea } from "@heroui/input";
import { DatasetDto, ModelDto } from '@/app/api.types';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@heroui/button";
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { KeyboardEvent } from '@react-types/shared/src/events';
import { Card, CardBody } from "@heroui/react";
import useSWR from 'swr';
import { datasetFetcher } from '@/app/util/dataset';
import { Spinner } from "@heroui/spinner";
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import ChatGrid from '@/app/dashboard/models/[modelId]/components/llm/ChatMessage';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface LLMFormProps {
  model: ModelDto;
  datasetId?: string;
}

export interface ChatMessage {
  prompt: string;
  output?: string;
}

const placeholders = [
  'Ask me about the meaning of life...',
  'Tell me a story about space pirates...',
  'Help me write a haiku about robots...',
  "Explain quantum physics like I'm five...",
  'Debate whether hot dogs are sandwiches...',
];

const createDataset = async (modelId: string, datasetDto: DatasetDto) => {
  const res = await fetch(`/api/user/models/${modelId}/datasets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datasetDto),
  });

  if (!res.ok) {
    throw new Error('Failed to create dataset');
  }

  return res.json();
};

export function LLMForm({ model, datasetId }: LLMFormProps) {
  const router = useRouter();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [textareaContent, setTextareaContent] = useState<string>('');
  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)],
  );
  const [currentResponse, setCurrentResponse] = useState<string | undefined>();
  const [chatHistory, setChatHistory] = useState<Array<ChatMessage>>([]);

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useSWR(
    datasetId !== 'new' ? `/api/datasets/${datasetId}` : null,
    datasetFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    if (apiResponse?.data) {
      const dataset = apiResponse.data;
      const history = dataset.input.map((inputRow: any, index: number) => ({
        prompt: inputRow.prompt,
        output: (dataset.result?.[index] as any)?.output || '',
      }));
      setChatHistory(history);
    }
  }, [apiResponse]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [currentResponse]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScroll = scrollHeight - height;

      // Only scroll if we're already near the bottom
      const shouldScroll =
        (container.scrollTop + container.clientHeight) /
          container.scrollHeight >=
        0.7;

      if (shouldScroll) {
        container.scrollTo({
          top: maxScroll,
          behavior: 'auto',
        });
      }
    }
  };

  const createStreamingPrediction = async (
    modelId: string,
    datasetId: string,
    streamingPredictionRequestDto: { prompt: string },
  ) => {
    const apiResponse = await fetch(
      `/api/models/${modelId}/predict/stream/${datasetId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'text/event-stream' },
        body: JSON.stringify(streamingPredictionRequestDto),
      },
    );
    if (!apiResponse.body || !apiResponse.ok) {
      if (apiResponse.status === 429) {
        throw new Error(
          'Rate limit exceeded for this model. Please try again later.',
        );
      }
      throw new Error('Failed to create streaming prediction');
    }

    const reader = apiResponse.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let fullResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value) {
        const formattedValue = value;
        fullResponse += formattedValue + ' ';
        setCurrentResponse(fullResponse);
      }
    }

    return fullResponse;
  };

  const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleFormSubmit();
    }
  };

  const handleFormSubmit = async () => {
    if (!textareaContent?.trim() || isFormLoading) return;

    const prompt = textareaContent.trim();
    setIsFormLoading(true);

    let dataset = apiResponse?.data;
    if (datasetId === 'new') {
      const { data } = await createDataset(model.id!.toString(), {
        name: prompt.substring(0, 50),
        entryType: 'ARRAY',
        type: 'CHAT',
        input: [],
      });
      dataset = data;
    }

    if (!dataset) {
      toast.error('An error occurred while processing your request.');
      return;
    }

    try {
      const response = await createStreamingPrediction(
        model.id!.toString(),
        dataset.id!.toString(),
        {
          prompt,
        },
      );

      setChatHistory((prev) => [
        ...prev,
        {
          prompt,
          output: response,
        },
      ]);
    } catch (error) {
      toast.error('Error: ' + (error as any).message);
    } finally {
      setIsFormLoading(false);
      setCurrentResponse(undefined);
      setTextareaContent('');
      setTimeout(() => {
        promptRef.current?.focus();
      });

      if (datasetId === 'new') {
        router.replace(`/dashboard/models/${model.id}/chat/${dataset.id}`);
      }
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <SWRClientFetchError error={error} />;

  return (
    <Card className="w-full">
      <CardBody>
        <div ref={chatContainerRef} className="max-h-[600px] overflow-y-auto">
          {chatHistory.length > 0 && (
            <div className="mt-4">
              <ChatGrid messages={chatHistory} />
            </div>
          )}

          {currentResponse && (
            <div className="mt-4">
              <ChatGrid
                messages={[
                  {
                    prompt: textareaContent || '',
                    output: currentResponse,
                  },
                ]}
              />
            </div>
          )}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="mt-5">
          <Textarea
            ref={promptRef}
            name="prompt"
            placeholder={placeholder}
            className="max-w-full"
            onKeyDown={handleKeyPress}
            onValueChange={setTextareaContent}
            value={textareaContent}
            isDisabled={isFormLoading}
            endContent={
              <Button
                isIconOnly
                onPress={handleFormSubmit}
                isLoading={isFormLoading}
              >
                <ArrowUpIcon className="size-6" />
              </Button>
            }
            validationBehavior="native"
            isRequired
          />
        </form>
      </CardBody>
    </Card>
  );
}
