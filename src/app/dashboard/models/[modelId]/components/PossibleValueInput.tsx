import React, { useEffect, useState } from 'react';
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FeaturePossibleValueDto } from '@/app/api.types';

interface ArrayInputProps {
  name: string;
  label: string;
  defaultValue: FeaturePossibleValueDto[];
  onChange: (e: {
    target: { name: string; value: FeaturePossibleValueDto[] };
  }) => void;
  isDisabled?: boolean;
}

export default function PossibleValueInput({
  name,
  label,
  defaultValue = [],
  onChange,
  isDisabled = false,
}: ArrayInputProps) {
  const [inputs, setInputs] = useState<FeaturePossibleValueDto[]>(defaultValue);

  useEffect(() => {
    onChange({ target: { name, value: inputs } });
  }, [inputs]);

  // Handle change in input fields
  const handleInputChange = (index: number, event: React.ChangeEvent<any>) => {
    const newInputs = [...inputs];
    newInputs[index] = {
      ...newInputs[index],
      [event.target.name]: event.target.value,
    };
    setInputs(newInputs);
  };

  // Add a new input field
  const handleAddInput = () => {
    setInputs([...inputs, { value: '', description: '' }]);
  };

  // Remove an input field
  const handleRemoveInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3 pb-3">
          <Input
            type="text"
            label={`${label} ${index + 1} value`}
            name="value"
            value={input.value}
            onChange={(event) => handleInputChange(index, event)}
            description="This is the value that will be sent to the model"
            isDisabled={isDisabled}
          />
          <Input
            type="text"
            label={`${label} ${index + 1} description`}
            name="description"
            value={input.description}
            onChange={(event) => handleInputChange(index, event)}
            description="The human-readable text that will be displayed to users for this option"
            isDisabled={isDisabled}
          />
          {!isDisabled && (
            <Button type="button" onClick={() => handleRemoveInput(index)}>
              Remove
            </Button>
          )}
        </div>
      ))}
      {!isDisabled && (
        <Button type="button" onClick={handleAddInput}>
          Add possible value
        </Button>
      )}
    </div>
  );
}
