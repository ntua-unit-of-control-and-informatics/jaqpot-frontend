'use client';

import {
  ModelDto,
  ModelsResponseDto,
  OrganizationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import { Select, SelectItem } from '@nextui-org/react';
import { Input } from '@nextui-org/input';
import React, { useState } from 'react';
import useSWR, { Fetcher } from 'swr';
import { CustomError } from '@/app/types/CustomError';
import { Button } from '@nextui-org/button';
import toast from 'react-hot-toast';
import { router } from 'next/client';

interface FeaturesTabProps {
  model: ModelDto;
}

interface VisibilityValue {
  key: ModelDto['visibility'];
  label: string;
  description: string;
}

const orgFetcher: Fetcher<OrganizationDto[], string> = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const message = (await res.json()).message;
    const status = res.status;
    // Attach extra info to the error object.
    throw new CustomError(message, status);
  }

  return res.json();
};

export default function EditModelTab({ model }: FeaturesTabProps) {
  const possibleValues: VisibilityValue[] = [
    {
      key: 'PUBLIC',
      label: 'Public',
      description:
        'Anyone can view your model and any authenticated user can make predictions',
    },
    {
      key: 'ORG_SHARED',
      label: 'Shared with organizations',
      description:
        'Members of the organizations you select can view and execute your model',
    },
    {
      key: 'PRIVATE',
      label: 'Private',
      description: 'Only you can view and execute your model',
    },
  ];
  const [isLoading, setIsLoading] = useState(false);

  const { data: allOrganizations, error } = useSWR(
    `/api/organizations`,
    orgFetcher,
  );
  type PartialModelUpdate = Omit<
    PartiallyUpdateModelRequestDto,
    'organizationIds'
  > & {
    organizationIds: string[];
  };

  const organizationIds =
    model.organizations?.map((org) => org.id!.toString()) || [];
  const [formData, setFormData] = useState<PartialModelUpdate>({
    name: model.name,
    visibility: model.visibility,
    organizationIds,
  });

  const [organizations, setOrganizations] = useState<Set<string>>(
    new Set(organizationIds),
  );

  const handleVisibilityChange = (keys: Set<number>) => {
    const first = keys.keys().next().value;
    setFormData({
      ...formData,
      visibility: first,
    });
  };

  const handleOrganizationsChange = (organizationIds: Set<string>) => {
    setOrganizations(organizationIds);
    setFormData({
      ...formData,
      organizationIds: Array.from(organizationIds.keys()),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/models/${model.id}/partial`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Model updated successfully`);
      } else {
        toast.error(`Error updating model:  ${data?.message}`);
      }
    } catch (error: unknown) {
      // Display error message as needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <p className="text-sm italic">
              Note: As the creator of this model, only you have access to this
              edit tab. No one else can make changes to your model.
            </p>
          </div>
          <div>
            <Input
              label="Name"
              name="name"
              placeholder="Enter the model name"
              value={formData.name}
              onChange={handleInputChange}
              isRequired
            ></Input>
          </div>
          <div>
            <Select
              defaultSelectedKeys={[formData.visibility]}
              selectedKeys={[formData.visibility]}
              label="Visibility"
              className="max-w-xs"
              // @ts-ignore
              onSelectionChange={handleVisibilityChange}
              isRequired
            >
              {possibleValues.map((val) => (
                <SelectItem key={val.key} description={val.description}>
                  {val.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {formData.visibility === 'ORG_SHARED' && allOrganizations && (
            <div>
              <Select
                defaultSelectedKeys={organizations}
                selectedKeys={organizations}
                selectionMode="multiple"
                label="Organizations to share with"
                className="max-w-xs"
                // @ts-ignore
                onSelectionChange={handleOrganizationsChange}
              >
                {allOrganizations.map((org) => (
                  <SelectItem key={org.id!.toString()}>{org.name}</SelectItem>
                ))}
              </Select>
            </div>
          )}
        </div>
        <Button
          isLoading={isLoading}
          type="submit"
          color="primary"
          className="mt-4"
        >
          Save changes
        </Button>
      </form>
    </div>
  );
}
