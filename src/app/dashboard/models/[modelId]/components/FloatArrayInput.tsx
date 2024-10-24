import React, { useEffect, useState } from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';

interface FloatArrayInputProps {
  name: string;
  label: string;
  onChange: (e: React.ChangeEvent<any>) => void;
  defaultValue?: number[];
  isDisabled?: boolean;
}

export default function FloatArrayInput({
  name,
  label,
  defaultValue = [],
  onChange,
  isDisabled = false,
}: FloatArrayInputProps) {
  const [inputs, setInputs] = useState<number[]>(defaultValue);

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
    setInputs([...inputs, 0]);
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
      <label className="text-small">
        {label}
        <span className="text-red-500">*</span>
      </label>
      {inputs.map((input, index) => (
        <div key={index} className="flex flex-row items-center gap-2 pb-3">
          <Input
            type="number"
            label={`${label} ${index + 1}`}
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
