import { Textarea } from '@nextui-org/input';
import { DatasetDto, ModelDto } from '@/app/api.types';
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { KeyboardEvent } from '@react-types/shared/src/events';
import { Card, CardBody } from '@nextui-org/react';
import useSWR from 'swr';
import { datasetFetcher } from '@/app/util/dataset';
import { Spinner } from '@nextui-org/spinner';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';
import ChatGrid from '@/app/dashboard/models/[modelId]/components/llm/ChatMessage';

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

export function LLMForm({ model, datasetId }: LLMFormProps) {
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [textareaContent, setTextareaContent] = useState<string | undefined>();
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
  );

  // Initialize chat history from dataset
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

  const createStreamingPrediction = async (
    modelId: string,
    datasetDto: DatasetDto,
  ) => {
    const apiResponse = await fetch(`/api/models/${modelId}/predict/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'text/event-stream' },
      body: JSON.stringify(datasetDto),
    });
    setIsFormLoading(false);
    setCurrentResponse(undefined);
    setTextareaContent(undefined);

    if (!apiResponse.body) return;

    const reader = apiResponse.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let fullResponse = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value) {
        const formattedValue = value.trim();
        fullResponse += formattedValue + ' ';
        setCurrentResponse(fullResponse.trim());
      }
    }

    return fullResponse.trim();
  };

  const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await handleFormSubmit();
    }
  };

  const handleFormSubmit = async () => {
    if (!textareaContent?.trim() || isFormLoading) return;

    const prompt = textareaContent;
    setIsFormLoading(true);

    try {
      const dataset = apiResponse?.data;
      const response = await createStreamingPrediction(model.id!.toString(), {
        ...dataset!!,
        input: [{ prompt }, ...dataset!!.input],
      });

      // Update chat history with new message
      setChatHistory((prev) => [
        {
          prompt,
          reply: response,
        },
        ...prev,
      ]);
    } catch (error) {
      // console.error('Prediction error:', error);
    } finally {
      setCurrentResponse(undefined);
    }
  };

  if (isLoading) return <Spinner />;
  if (error) return <SWRClientFetchError error={error} />;

  return (
    <Card className="w-full">
      <CardBody>
        <form onSubmit={(e) => e.preventDefault()}>
          <Textarea
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

        {/* Show current streaming response if any */}
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

        {chatHistory.length > 0 && (
          <div className="mt-4">
            <ChatGrid messages={chatHistory} />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
