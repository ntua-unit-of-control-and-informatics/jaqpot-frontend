import { Textarea } from '@nextui-org/input';
import { ModelDto } from '@/app/api.types';
import React, { useState } from 'react';
import { Button } from '@nextui-org/button';
import { ArrowUpCircleIcon, ArrowUpIcon } from '@heroicons/react/24/solid';
import { KeyboardEvent } from '@react-types/shared/src/events';
import { ApiResponse } from '@/app/util/response';
import toast from 'react-hot-toast';
import { createPrediction } from '@/app/dashboard/models/[modelId]/components/tabs/ModelPredictTab';

interface LLMFormProps {
  model: ModelDto;
}
const placeholders = [
  'Ask me about the meaning of life...',
  'Tell me a story about space pirates...',
  'Help me write a haiku about robots...',
  "Explain quantum physics like I'm five...",
  'Debate whether hot dogs are sandwiches...',
];

export function LLMForm({ model }: LLMFormProps) {
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    const res = await createStreamingPrediction(model.id!.toString(), [
      formData,
    ]);

    setIsLoading(false);
  };

  return (
    <>
      <div className="mb-6 flex w-full flex-wrap gap-4 md:mb-0 md:flex-nowrap">
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
      </div>
      <div>
        <p>{response && <div>{response}</div>}</p>
      </div>
    </>
  );
}
