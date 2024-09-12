'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import SmilesDrawer from '@/app/dashboard/models/[modelId]/components/SmilesDrawer';
import { PaintBrushIcon } from '@heroicons/react/24/solid';
import { Input } from '@nextui-org/input';
import React from 'react';

interface SmilesInputProps {
  name: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  required?: boolean;
  value?: string;
}

export default function SmilesInput({
  name,
  onChange,
  required,
  value,
}: SmilesInputProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleOnChange = (smiles: string) => {
    value = smiles;
  };
  return (
    <>
      <Input
        type="string"
        label="Smiles "
        placeholder="Enter SMILES string"
        name={name}
        onChange={onChange}
        required={required}
        value={value ?? ''}
        endContent={
          <Button isIconOnly onPress={onOpen}>
            <PaintBrushIcon className="size-6" />
          </Button>
        }
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <SmilesDrawer
                  height={400}
                  width={400}
                  onChange={handleOnChange}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
