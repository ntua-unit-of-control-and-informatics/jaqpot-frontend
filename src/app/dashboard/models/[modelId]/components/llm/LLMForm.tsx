import { Textarea } from '@nextui-org/input';
import { ModelDto } from '@/app/api.types';
import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { KeyboardEvent } from '@react-types/shared/src/events';
import { Card, CardBody } from '@nextui-org/react';
import useSWR from 'swr';
import { createDatasetFetcher, datasetFetcher } from '@/app/util/dataset';
import { Spinner } from '@nextui-org/spinner';
import SWRClientFetchError from '@/app/components/SWRClientFetchError';

interface LLMFormProps {
  model: ModelDto;
  datasetId?: string;
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
  const [formData, setFormData] = useState({});
  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)],
  );
  const [response, setResponse] = useState<string>('');

  const createStreamingPrediction = async (modelId: string, data: any) => {
    const apiResponse = await fetch(`/api/models/${modelId}/predict/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/event-stream',
      },
      body: JSON.stringify(data),
    });

    if (!apiResponse.body) return;

    // To decode incoming data as a string
    const reader = apiResponse.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (value) {
        setResponse((prevResponse) => {
          const formattedValue = value.trim();
          return prevResponse
            ? `${prevResponse} ${formattedValue}`
            : formattedValue;
        });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { value, type, name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      await handleFormSubmit(formData);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsFormLoading(true);
    const res = await createStreamingPrediction(model.id!.toString(), [
      formData,
    ]);

    setIsFormLoading(false);
  };

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useSWR(
    datasetId !== 'new' ? `/api/datasets/${datasetId}` : null,
    datasetFetcher,
  );

  const dataset = apiResponse?.data;

  if (isLoading) return <Spinner />;
  if (error) return <SWRClientFetchError error={error} />;

  return (
    <Card className={'w-full'}>
      <CardBody>
        <Textarea
          name={'prompt'}
          placeholder={placeholder}
          className="max-w-full"
          onKeyDown={(e: KeyboardEvent) => handleKeyPress(e)}
          onChange={(e) => handleChange(e)}
          endContent={
            <Button isIconOnly onPress={() => handleFormSubmit(formData)}>
              <ArrowUpIcon className={'size-6'} />{' '}
            </Button>
          }
        ></Textarea>
        <div>
          <p>{response}</p>
        </div>
        {dataset?.input.map((inputRow: any, index) => (
          <>
            <Card key={`input-${index}`}>
              <CardBody>{inputRow.prompt}</CardBody>
            </Card>
            <Card key={`result-${index}`}>
              <CardBody>{(dataset?.result?.[index] as any)?.output}</CardBody>
            </Card>
          </>
        ))}
      </CardBody>
    </Card>
  );
}
