'use client';

import React, { useState } from 'react';
import { Radio, RadioGroup, Select, SelectItem } from '@nextui-org/react';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';

export interface DynamicFormSchema {
  sectionTitle: string;
  fields: DynamicFormField[];
}

export interface DynamicFormField {
  name: string;
  label: string;
  type:
    | 'text'
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
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleValidation = () => {
    let errors = {};
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
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
            {field.options.map((option: string, index: number) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup label="Select...">
            {field.options.map((option: string, index: number) => (
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
            checked={formData[field.name]}
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
            value={formData[field.name] || ''}
          />
        );
      default:
        // Handle other HTML5 input types like date, email, etc.
        return (
          <Input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={formData[field.name] || ''}
          />
        );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-6">
          {schema.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3>{section.sectionTitle}</h3>
              {section.fields &&
                section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    <div className="mb-3">
                      <div className="my-5">
                        <label>{field.label}</label>
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
        <Button type="submit" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
}
