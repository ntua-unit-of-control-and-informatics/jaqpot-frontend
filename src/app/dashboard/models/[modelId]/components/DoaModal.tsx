import DoaCards from '@/app/dashboard/models/[modelId]/components/DoaCards';
import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

interface DoaModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  doaDetails?: any;
}

export default function DoaModal({
  doaDetails,
  isOpen,
  onOpenChange,
}: DoaModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="p-5"
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Applicability Domain details
            </ModalHeader>
            <ModalBody>
              <DoaCards doaDetails={doaDetails} />
            </ModalBody>
            <ModalFooter className="mt-4">
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
