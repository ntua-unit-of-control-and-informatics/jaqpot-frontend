import React, { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
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
    setInputs([...inputs, { key: '', value: '' }]);
  };

  // Remove an input field
  const handleRemoveInput = (index: number) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  if (isDisabled) {
    return (
      <Input
        isDisabled
        value={inputs.map((input) => input.value).join(', ')}
        label={label}
      />
    );
  }

  return (
    <div>
      {inputs.map((input, index) => (
        <div key={index} className="flex flex-row items-center gap-2 pb-3">
          <Input
            type="text"
            label={`${label} ${index + 1} key`}
            name="key"
            value={input.key}
            onChange={(event) => handleInputChange(index, event)}
          />
          <Input
            type="text"
            label={`${label} ${index + 1} value`}
            name="value"
            value={input.value}
            onChange={(event) => handleInputChange(index, event)}
          />
          <Button type="button" onClick={() => handleRemoveInput(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={handleAddInput}>
        Add possible value
      </Button>
    </div>
  );
}
