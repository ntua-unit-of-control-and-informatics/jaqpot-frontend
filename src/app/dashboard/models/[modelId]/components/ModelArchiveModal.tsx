import {
  FeatureDto,
  ModelDto,
  ModelsResponseDto,
  OrganizationDto,
  PartiallyUpdateFeatureRequestDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import { Select, SelectItem } from "@heroui/react";
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Button,
  Input,
} from "@heroui/react";
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import { useRouter } from 'next/navigation';
import PossibleValueInput from '@/app/dashboard/models/[modelId]/components/PossibleValueInput';

interface ModelArchiveModalProps {
  model: ModelDto;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

async function archiveModel(model: ModelDto) {
  const res = await fetch(`/api/models/${model.id}/archive`, {
    method: 'POST',
  });
  if (!res.ok) {
    alert('Model was not archived successfully');
  } else {
    const { success, message } = (await res.json()) as ApiResponse;
    if (success) {
      toast.success('Model was archived successfully!');
    } else {
      toast.error(`Error archiving model:  ${message}`);
    }
  }
}

async function unarchiveModel(model: ModelDto) {
  const res = await fetch(`/api/models/${model.id}/unarchive`, {
    method: 'POST',
  });
  if (!res.ok) {
    alert('Model was not archived successfully');
  } else {
    const { success, message } = (await res.json()) as ApiResponse;
    if (success) {
      toast.success('Model was unarchived successfully!');
    } else {
      toast.error(`Error unarchiving model:  ${message}`);
    }
  }
}

export default function ModelArchiveModal({
  model,
  isOpen,
  onOpenChange,
}: ModelArchiveModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="p-5"
      size="xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {model.archived ? 'Unarchive' : 'Archive '} Model {model.name}
            </ModalHeader>
            <ModalBody>Are you sure you want to perform this action?</ModalBody>
            <ModalFooter className="mt-4">
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button
                isLoading={isLoading}
                onPress={async () => {
                  if (model.archived) {
                    await unarchiveModel(model);
                    router.refresh();
                    onClose();
                  } else {
                    await archiveModel(model);
                    router.refresh();
                    onClose();
                  }
                }}
                color="primary"
              >
                {model.archived ? 'Unarchive' : 'Archive'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
