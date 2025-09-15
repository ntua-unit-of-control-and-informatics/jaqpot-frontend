import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@heroui/react";
import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import 'react-multi-email/dist/style.css';
import { ApiResponse } from '@/app/util/response';
import { ApiKeyDto, ApiKeyResponseDto } from '@/app/api.types';
import toast from 'react-hot-toast';
import { Input } from "@heroui/input";
import { useRouter } from 'next/navigation';
import Alert from '@/app/components/Alert';
import { Snippet } from "@heroui/snippet";
import { Spinner } from "@heroui/spinner";

async function createAPIKey(formData: ApiKeyDto): Promise<ApiResponse> {
  const res = await fetch(`/api/user/api-keys`, {
    method: 'POST',
    body: JSON.stringify(formData),
  });

  return await res.json();
}

export default function CreateAPIKeyButton() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formData, setFormData] = useState<ApiKeyDto>({
    expirationTime: 'THREE_MONTHS',
  } as any);
  const [apiKeyData, setApiKeyData] = useState<ApiKeyResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFormData({ expirationTime: 'THREE_MONTHS' } as any);
      setApiKeyData(null);
    }
    onOpenChange();
  };

  async function submitForm(onClose: Function) {
    setIsLoading(true);
    const { success, data, message } = await createAPIKey(formData);
    if (success) {
      toast.success('API key created successfully');
      router.refresh();
      setApiKeyData(data);
    } else {
      toast.error(`Error creating API key:  ${message}`);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex">
      <Button
        color="primary"
        startContent={<PlusIcon className="size-6" />}
        onPress={onOpen}
        className="mb-5"
      >
        Create API key
      </Button>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          size={'3xl'}
          isDismissable={false}
          isKeyboardDismissDisabled={true}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create API key
                </ModalHeader>
                <ModalBody className="p-4">
                  <form className="flex flex-col gap-5">
                    <Input
                      type="text"
                      label={'Note'}
                      placeholder={'My new API key'}
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    />
                    <RadioGroup
                      label="Select the api key expiration time"
                      value={formData.expirationTime}
                      defaultValue="THREE_MONTHS"
                      onValueChange={(expirationTime) =>
                        setFormData({
                          ...formData,
                          expirationTime: expirationTime as any,
                        })
                      }
                    >
                      <Radio value="THREE_MONTHS">3 months</Radio>
                      <Radio value="SIX_MONTHS">6 months</Radio>
                    </RadioGroup>
                  </form>

                  {isLoading && <Spinner />}

                  {apiKeyData && (
                    <div className={'mt-5 flex flex-col gap-2'}>
                      <p>API key created successfully!</p>
                      <Alert
                        type="warning"
                        title="Important: Save your API key and secret!"
                        description="The secret will only be displayed once and won't be shown again. Please ensure you save both the client key and secret in a secure place. If you lose the secret, you'll need to regenerate a new API key to get a new one."
                      />
                      Client key:{' '}
                      <Snippet hideSymbol={true}>
                        {apiKeyData.clientKey}
                      </Snippet>
                      Client secret:{' '}
                      <Snippet hideSymbol={true}>
                        {apiKeyData.clientSecret}
                      </Snippet>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  {!apiKeyData && (
                    <Button color="primary" onPress={() => submitForm(onClose)}>
                      Create API key
                    </Button>
                  )}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
