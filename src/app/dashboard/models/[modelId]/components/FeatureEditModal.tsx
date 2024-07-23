import {
  FeatureDto,
  ModelDto,
  ModelsResponseDto,
  OrganizationDto,
  PartiallyUpdateFeatureRequestDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import { Select, SelectItem } from '@nextui-org/react';
import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from '@nextui-org/react';
import { CustomError } from '@/app/types/CustomError';
import toast from 'react-hot-toast';
import { router } from 'next/client';
import { ApiResponse } from '@/app/util/response';
import { useRouter } from 'next/navigation';
import PossibleValueInput from '@/app/dashboard/models/[modelId]/components/PossibleValueInput';

const possibleFeatureTypes: FeatureTypeValue[] = [
  {
    key: 'INTEGER',
    label: 'Integer',
    description:
      'An integer feature type represents whole numbers, which can be used for discrete values or counts.',
  },
  {
    key: 'FLOAT',
    label: 'Float',
    description:
      'A float feature type represents decimal numbers, allowing for continuous values and more precision.',
  },
  {
    key: 'CATEGORICAL',
    label: 'Categorical',
    description:
      'A categorical feature type represents categories or classes, often encoded as strings or integers.',
  },
  {
    key: 'SMILES',
    label: 'SMILES',
    description:
      'A SMILES feature type represents chemical structures using the SMILES notation, often used in cheminformatics.',
  },
  {
    key: 'STRING',
    label: 'String',
    description:
      'A string feature type represents text or character data, used for names, labels, or other textual information.',
  },
  {
    key: 'TEXT',
    label: 'Text',
    description:
      'A text feature type represents larger blocks of text, used for descriptions, comments, or other long-form text data.',
  },
];

// TypeScript interface for clarity
interface FeatureTypeValue {
  key: string;
  label: string;
  description: string;
}

interface FeatureEditModalProps {
  model: ModelDto;
  feature: FeatureDto;
  isOpen: boolean;
  isEdit: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function FeatureEditModal({
  model,
  feature,
  isOpen,
  onOpenChange,
  isEdit,
}: FeatureEditModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<
    PartiallyUpdateFeatureRequestDto & { key: string }
  >({
    key: feature.key,
    name: feature.name,
    units: feature.units,
    description: feature.description ?? '',
    featureType: feature.featureType,
  });

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (onClose: () => void) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/models/${model.id}/features/${feature.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(formData),
        },
      );
      const { success, data, message }: ApiResponse = await res.json();
      if (success) {
        toast.success(`Feature updated successfully`);
        router.refresh();
        onClose();
      } else {
        toast.error(`Error updating feature:  ${message}`);
      }
    } catch (error: unknown) {
      // Display error message as needed
    } finally {
      setIsLoading(false);
    }
  };

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
              {isEdit ? 'Edit ' : 'View '}Feature
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                {isEdit && (
                  <div className="mb-4">
                    <p className="text-tiny text-gray-600">
                      Note: As the creator of this model, only you have access
                      to this feature edit form. No one else can make changes to
                      your model.
                    </p>
                  </div>
                )}
                <div>
                  <Input
                    label="Key"
                    name="key"
                    value={formData.key}
                    onChange={handleChange}
                    isDisabled
                  ></Input>
                </div>
                <div>
                  <Input
                    label="Name"
                    name="name"
                    placeholder="Enter the feature name"
                    value={formData.name}
                    onChange={handleChange}
                    isDisabled={!isEdit}
                    isRequired
                  ></Input>
                </div>
                <div>
                  <Input
                    label="Units"
                    name="units"
                    placeholder="Enter the feature units"
                    value={formData.units}
                    onChange={handleChange}
                    isDisabled={!isEdit}
                  ></Input>
                </div>
                <div>
                  <Textarea
                    label="Description"
                    name="description"
                    description={<>The description of your feature.</>}
                    placeholder="Enter the feature description"
                    value={formData.description}
                    isDisabled={!isEdit}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Select
                    selectedKeys={[formData.featureType]}
                    name="featureType"
                    label="Feature type"
                    className="max-w-xs"
                    isDisabled={!isEdit}
                    onChange={handleChange}
                    isRequired
                  >
                    {possibleFeatureTypes.map((val) => (
                      <SelectItem key={val.key} description={val.description}>
                        {val.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                {formData.featureType === 'CATEGORICAL' && (
                  <div>
                    <PossibleValueInput
                      name="possibleValues"
                      label="Possible values"
                      defaultValue={feature.possibleValues ?? []}
                      onChange={handleChange}
                      isDisabled={!isEdit}
                    />
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="mt-4">
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              {isEdit && (
                <Button
                  isLoading={isLoading}
                  onPress={() => handleSubmit(onClose)}
                  color="primary"
                >
                  Save changes
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
