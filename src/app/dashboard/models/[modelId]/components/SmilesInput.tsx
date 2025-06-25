'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Tooltip,
} from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import SmilesDrawer from '@/app/dashboard/models/[modelId]/components/SmilesDrawer';
import { PaintBrushIcon } from '@heroicons/react/24/solid';
import { Input } from '@nextui-org/input';
import React, { ReactNode, useState } from 'react';

interface SmilesInputProps {
  name: string;
  label?: string | ReactNode;
  onChange?: (e: React.ChangeEvent<any>) => void;
  required?: boolean;
  value?: string;
}

export default function SmilesInput({
  name,
  onChange,
  required,
  value,
  label,
}: SmilesInputProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [drawnSmiles, setDrawnSmiles] = useState<string>(value || '');

  const handleSmilesChange = (smiles: string) => {
    setDrawnSmiles(smiles);
  };

  const handleSaveDrawnSmiles = () => {
    if (onChange) {
      // Create a synthetic event that matches the expected format
      const syntheticEvent = {
        target: {
          name,
          value: drawnSmiles,
          type: 'text',
        },
      } as React.ChangeEvent<any>;

      onChange(syntheticEvent);
    }
    onOpenChange();
  };

  const handleCancel = () => {
    // Reset to current value and close
    setDrawnSmiles(value || '');
    onOpenChange();
  };

  return (
    <>
      <Input
        type="string"
        labelPlacement="outside"
        label={label}
        placeholder="Enter SMILES string or use the molecular editor"
        name={name}
        onChange={onChange}
        required={required}
        value={value ?? ''}
        endContent={
          <Tooltip content="Open molecular editor to draw chemical structures and generate SMILES">
            <Button
              isIconOnly
              onPress={onOpen}
              variant="light"
              className="text-primary"
            >
              <PaintBrushIcon className="size-5" />
            </Button>
          </Tooltip>
        }
        classNames={{
          label: 'flex flex-row  items-center justify-center',
        }}
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Draw Molecular Structure
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  <SmilesDrawer
                    smiles={drawnSmiles}
                    onChange={handleSmilesChange}
                    width="550px"
                    height="400px"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={handleCancel}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleSaveDrawnSmiles}>
                  Use This Structure
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
