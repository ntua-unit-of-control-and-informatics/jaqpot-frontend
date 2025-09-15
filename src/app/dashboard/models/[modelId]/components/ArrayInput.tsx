import React, { ReactNode, useEffect, useState } from 'react';
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

interface ArrayInputProps {
  name: string;
  label: string | ReactNode;
  type: 'number' | 'text';
  onChange: (e: React.ChangeEvent<any>) => void;
  defaultValue?: (number | string)[];
  isDisabled?: boolean;
}

export default function ArrayInput({
  name,
  label,
  type,
  defaultValue = [],
  onChange,
  isDisabled = false,
}: ArrayInputProps) {
  const [inputs, setInputs] = useState<(number | string)[]>(defaultValue);

  useEffect(() => {
    onChange({ target: { name, value: inputs } } as any);
  }, [inputs]);

  // Handle change in input fields
  const handleInputChange = (index: number, event: React.ChangeEvent<any>) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
  };

  // Add a new input field
  const handleAddInput = () => {
    setInputs([...inputs, '']);
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
        value={inputs.map((input) => input).join(', ')}
        label={label}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="flex flex-row items-center text-small">
        {label}
        <span className="text-red-500">*</span>
      </label>
      {inputs.map((input, index) => (
        <div key={index} className="flex flex-row items-center gap-2 pb-3">
          <Input
            type={type}
            label={name}
            name={name}
            value={input.toString()}
            onChange={(event) => handleInputChange(index, event)}
          />

          <Button type="button" onClick={() => handleRemoveInput(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" onClick={handleAddInput}>
        Add value
      </Button>
    </div>
  );
}
