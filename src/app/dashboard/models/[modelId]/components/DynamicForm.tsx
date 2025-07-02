'use client';

import React, { ChangeEvent, ReactNode, useState } from 'react';
import { Radio, RadioGroup, Select, SelectItem } from '@nextui-org/react';
import { Input, Textarea } from '@nextui-org/input';
import { Input as ShadCNInput } from '@/components/ui/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import ArrayInput from '@/app/dashboard/models/[modelId]/components/ArrayInput';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '@nextui-org/tooltip';
import { isNullOrUndefinedOrEmpty } from '@/app/util/string';
import SmilesInput from '@/app/dashboard/models/[modelId]/components/SmilesInput';

// const jsonExample: DynamicFormSchema[] = [
//   {
//     sectionTitle: 'User Information',
//     fields: [
//       {
//         name: 'fullName',
//         label: 'Full Name',
//         type: 'text',
//         required: true,
//         placeholder: 'Enter full name',
//       },
//       {
//         name: 'email',
//         label: 'Email Address',
//         type: 'email',
//         required: true,
//         placeholder: 'Enter email',
//       },
//       {
//         name: 'password',
//         label: 'Password',
//         type: 'password',
//         required: true,
//         placeholder: 'Enter password',
//       },
//       {
//         name: 'birthday',
//         label: 'Date of Birth',
//         type: 'date',
//         required: false,
//       },
//     ],
//   },
//   {
//     sectionTitle: 'Preferences',
//     fields: [
//       {
//         name: 'colorPreference',
//         label: 'Favorite Color',
//         type: 'color',
//         required: false,
//       },
//       {
//         name: 'experienceLevel',
//         label: 'Experience Level',
//         type: 'range',
//         min: 0,
//         max: 10,
//         step: 1,
//         required: false,
//       },
//       {
//         name: 'developmentSkills',
//         label: 'Development Skills',
//         type: 'select',
//         options: [
//           { label: 'Frontend', value: 'frontend' },
//           { label: 'Backend', value: 'backend' },
//           { label: 'Full Stack', value: 'fullstack' },
//           { label: 'Data Science', value: 'datascience' },
//         ],
//         required: true,
//       },
//     ],
//   },
//   {
//     sectionTitle: 'Feedback',
//     fields: [
//       {
//         name: 'websiteFeedback',
//         label: 'Your Feedback',
//         type: 'textarea',
//         required: false,
//         placeholder: 'Share your thoughts',
//       },
//       {
//         name: 'termsAgreement',
//         label: 'Agree to Terms',
//         type: 'checkbox',
//         required: true,
//       },
//       {
//         name: 'fileUpload',
//         label: 'Upload File',
//         type: 'file',
//         required: false,
//       },
//       {
//         name: 'searchQuery',
//         label: 'Search',
//         type: 'search',
//         required: false,
//         placeholder: 'Search...',
//       },
//     ],
//   },
// ];

export interface DynamicFormSchema {
  sectionTitle: string;
  fields: DynamicFormField[];
}

export type DynamicFormFieldType =
  | 'text'
  | 'smiles'
  | 'number'
  | 'email'
  | 'password'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'color'
  | 'range'
  | 'date'
  | 'image'
  | 'search'
  | 'floatarray'
  | 'stringarray';

export interface DynamicFormField {
  name: string;
  label: string;
  labelTooltip?: ReactNode | string;
  type: DynamicFormFieldType;
  required: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: DynamicFormOption[];
}

export interface DynamicFormOption {
  key: string;
  value: string;
}

interface DynamicFormProps {
  schema: DynamicFormSchema[];
  onSubmit: Function;
}

function generateFieldLabel(field: DynamicFormField) {
  return (
    <>
      {field.labelTooltip && (
        <Tooltip content={field.labelTooltip} closeDelay={0}>
          <InformationCircleIcon className="mr-0.5 size-4 flex-shrink-0 text-gray-400" tabIndex={-1} />
        </Tooltip>
      )}
      {field.label}
    </>
  );
}

function retrieveInputValueFromString(
  type: DynamicFormFieldType,
  checked: boolean,
  value: string,
) {
  if (type !== 'checkbox' && value === '') return undefined;

  if (type === 'number') {
    return Number(value);
  } else if (type === 'checkbox') {
    return checked;
  }

  return value;
}

function generateDefaultFormValues(
  schema: DynamicFormSchema[],
): DynamicFormState {
  let defaultValues: { [key: string]: string | boolean | number } = {};
  schema.forEach((section) => {
    if (section.fields) {
      section.fields.forEach((field) => {
        if (field.type === 'checkbox') defaultValues[field.name] = false;
      });
    }
  });
  return defaultValues;
}

type DynamicFormState = {
  [key: string]: string | boolean | number;
};

export default function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<DynamicFormState>(
    generateDefaultFormValues(schema),
  );
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { value, type, name, checked } = e.target;
    const inputValue = retrieveInputValueFromString(type, checked, value);
    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files![0];
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const inputFile = buffer.toString('base64');
    setFormData({
      ...formData,
      [name]: inputFile,
    });
  };

  const handleValidation = () => {
    let errors: { [key: string]: string } = {};
    let formIsValid = true;

    schema.forEach((section) => {
      if (section.fields) {
        section.fields.forEach((field) => {
          if (
            field.required &&
            isNullOrUndefinedOrEmpty(formData[field.name])
          ) {
            formIsValid = false;
            errors[field.name] = 'This field is required';
          }
        });
      }
    });

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: DynamicFormField) => {
    switch (field.type) {
      case 'select':
        return (
          <Autocomplete
            labelPlacement="outside"
            name={field.name}
            placeholder={`Select ${field.label}`}
            label={generateFieldLabel(field)}
            onSelectionChange={(key) =>
              handleChange({
                target: { value: key, type: field.type, name: field.name },
              } as any)
            }
            isRequired={field.required}
            inputProps={{
              classNames: {
                label: 'flex flex-row  items-center justify-center',
              },
            }}
          >
            {field.options!.map((option: DynamicFormOption, index: number) => (
              // Send keys so the model can decide how to split the values
              <AutocompleteItem key={option.key}>
                {option.value}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        );
      case 'radio':
        return (
          <RadioGroup label={generateFieldLabel(field)}>
            {field.options!.map((option: any, index: number) => (
              <Radio
                key={index}
                type="radio"
                name={field.name}
                value={option.value}
                onChange={handleChange}
                required={field.required}
                checked={formData[field.name] === option.value}
              />
            ))}{' '}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <Checkbox
            type="checkbox"
            name={field.name}
            onChange={handleChange}
            isRequired={field.required}
            checked={(formData[field.name] as boolean) ?? false}
            classNames={{
              label: 'flex flex-row items-center justify-center text-sm',
            }}
          >
            {generateFieldLabel(field)}
          </Checkbox>
        );
      case 'textarea':
        return (
          <Textarea
            labelPlacement="outside"
            rows={3}
            name={field.name}
            label={generateFieldLabel(field)}
            placeholder={field.placeholder}
            onChange={handleChange}
            isRequired={field.required}
            value={(formData[field.name] ?? '') as string}
          />
        );
      case 'floatarray':
        return (
          <ArrayInput
            name={field.name}
            type="number"
            label={generateFieldLabel(field)}
            onChange={handleChange}
          />
        );
      case 'smiles':
        return (
          <SmilesInput
            name={field.name}
            onChange={handleChange}
            required={field.required}
            label={generateFieldLabel(field)}
            value={(formData[field.name] || '') as string}
          />
        );
      case 'stringarray':
        return (
          <ArrayInput
            name={field.name}
            type="text"
            label={generateFieldLabel(field)}
            onChange={handleChange}
          />
        );
      case 'image':
        return (
          <>
            <div className="flex items-center">{generateFieldLabel(field)}</div>
            <ShadCNInput
              type="file"
              name={field.name}
              accept="image/png, image/jpeg, image/tif, image/tiff, .tif"
              onChange={handleFileChange}
            />
          </>
        );
      default:
        // Handle other HTML5 input types like number, date, email, etc.
        return (
          <Input
            labelPlacement="outside"
            type={field.type}
            name={field.name}
            label={generateFieldLabel(field)}
            placeholder={field.placeholder}
            onChange={handleChange}
            isRequired={field.required}
            fullWidth={true}
            value={(formData[field.name] ?? '') as string}
            classNames={{
              label: 'flex flex-row  items-center justify-center',
            }}
          />
        );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="my-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {schema.map((section, sectionIndex) => (
            <div key={sectionIndex} className="flex w-full items-center">
              {/*<h3>{section.sectionTitle}</h3>*/}
              {section.fields &&
                section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="mb-3 flex-grow">
                    {renderField(field)}
                    {formErrors[field.name] && (
                      <div className="text-sm text-danger">
                        {formErrors[field.name]}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
}
