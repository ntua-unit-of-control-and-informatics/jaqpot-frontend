'use client';

import React, { useState } from 'react';
import { Radio, RadioGroup, Select, SelectItem } from '@nextui-org/react';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';

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
  | 'file'
  | 'search';

export interface DynamicFormField {
  name: string;
  label: string;
  type: DynamicFormFieldType;
  required: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: DynamicFormOption[];
}

export interface DynamicFormOption {
  label: string;
  value: string;
}

interface DynamicFormProps {
  schema: DynamicFormSchema[];
  onSubmit: Function;
}

export default function DynamicForm({ schema, onSubmit }: DynamicFormProps) {
  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>(
    {},
  );
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleValidation = () => {
    let errors: { [key: string]: string } = {};
    let formIsValid = true;

    schema.forEach((section) => {
      if (section.fields) {
        section.fields.forEach((field) => {
          if (field.required && !formData[field.name]) {
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
          <Select
            name={field.name}
            onChange={handleChange}
            label="Select..."
            required={field.required}
          >
            {/*<SelectItem value="">Select...</SelectItem>*/}
            {field.options!.map((option: any, index: number) => (
              // Send keys so the model can decide how to split the values
              <SelectItem key={index} value={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup label="Select...">
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
            required={field.required}
            checked={formData[field.name] as boolean | undefined}
          />
        );
      case 'textarea':
        return (
          <Textarea
            rows={3}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={(formData[field.name] || '') as string}
          />
        );
      default:
        // Handle other HTML5 input types like number, date, email, etc.
        return (
          <Input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={(formData[field.name] || '') as string}
          />
        );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 grid grid-cols-4 gap-6">
          {schema.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3>{section.sectionTitle}</h3>
              {section.fields &&
                section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <div className="mb-3">
                      <div className="mb-5">
                        <label className="break-words">{field.label}</label>
                      </div>
                      {renderField(field)}
                      {formErrors[field.name] && (
                        <div className="text-danger">
                          {formErrors[field.name]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
        <Button type="submit" color="primary" className="mt-5">
          Submit
        </Button>
      </form>
    </>
  );
}
