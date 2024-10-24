import { ApiKeyDto } from '@/app/api.types';
import { Switch } from '@nextui-org/switch';
import { Snippet } from '@nextui-org/snippet';
import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import { useRouter } from 'next/navigation';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/JaqpotTimeAgo';

interface ApiKeyComponentProps {
  apiKey: ApiKeyDto;
  onDelete: (clientKey: string) => void;
}

export default function ApiKeyContent({
  apiKey,
  onDelete,
}: ApiKeyComponentProps) {
  const router = useRouter();
  const [isSelected, setIsSelected] = useState(apiKey.enabled);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/user/api-keys/${apiKey.clientKey}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled: !isSelected }),
    });
    const { success, data, message }: ApiResponse = await res.json();
    if (success) {
      setIsSelected(!isSelected);
    } else {
      toast.error('Could not update apiKey: ' + message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (apiKey: ApiKeyDto) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setIsLoading(true);
      const res = await fetch(`/api/user/api-keys/${apiKey.clientKey!}`, {
        method: 'DELETE',
      });

      const { success, data, message }: ApiResponse = await res.json();
      if (success) {
        toast.success(`API key deleted successfully`);
        router.refresh();
        onDelete(apiKey.clientKey!);
      } else {
        toast.error(`Error deleting api key: ${message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-10 ml-9 flex flex-col gap-3">
      <Switch
        isSelected={isSelected}
        onValueChange={handleUpdate}
        color="success"
        isDisabled={isLoading}
      >
        Enabled
      </Switch>
      <div className="flex gap-2">
        Expiration:{' '}
        <JaqpotTimeAgo date={new Date(apiKey.expiresAt as unknown as string)} />
      </div>
      <div>
        Client key: <Snippet hideSymbol={true}>{apiKey.clientKey}</Snippet>
      </div>
      <div>
        <Button
          color="danger"
          onPress={() => handleDelete(apiKey)}
          isDisabled={isLoading}
        >
          Delete {apiKey.note ? `(${apiKey.note})` : ''}
        </Button>
      </div>
    </div>
  );
}
