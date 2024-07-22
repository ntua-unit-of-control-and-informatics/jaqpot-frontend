'use client';

import {
  ModelDto,
  ModelsResponseDto,
  OrganizationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import { Select, SelectItem } from '@nextui-org/react';
import { Input, Textarea } from '@nextui-org/input';
import React, { useState } from 'react';
import useSWR, { Fetcher } from 'swr';
import { CustomError } from '@/app/types/CustomError';
import { Button } from '@nextui-org/button';
import toast from 'react-hot-toast';
import { router } from 'next/client';
import { ApiResponse } from '@/app/util/response';
import { useRouter } from 'next/navigation';
import { Link } from '@nextui-org/link';
import Alert from '@/app/components/Alert';

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
  const { success, data, message } = await res.json();
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!success) {
    const status = res.status;
    // Attach extra info to the error object.
    throw new CustomError(message, status);
  }

  return data;
};

export default function ModelEditTab({ model }: FeaturesTabProps) {
  const router = useRouter();

  const possibleVisibilityValues: VisibilityValue[] = [
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

  const { data: allOrganizationsForUser, error } = useSWR(
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
    description: model.description ?? '',
    organizationIds,
    associatedOrganizationId: model.associatedOrganization?.id,
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

  const handleChange = (e: React.ChangeEvent<any>) => {
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
      const { success, data, message }: ApiResponse = await res.json();
      if (success) {
        toast.success(`Model updated successfully`);
        router.refresh();
      } else {
        toast.error(`Error updating model:  ${message}`);
      }
    } catch (error: unknown) {
      // Display error message as needed
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteModel() {
    const res = await fetch(`/api/models/${model.id}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Model was not deleted successfully');
    } else {
      alert('Model was deleted successfully!');
      router.push('/dashboard/models');
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <p className="text-tiny text-gray-600">
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
              onChange={handleChange}
              isRequired
            ></Input>
          </div>
          <div>
            <Textarea
              label="Description"
              name="description"
              description={
                <>
                  The description of your model. Supports{' '}
                  <Link
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    className="text-tiny"
                  >
                    basic markdown
                  </Link>
                </>
              }
              placeholder="Enter the model description"
              value={formData.description}
              onChange={handleChange}
            />
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
              {possibleVisibilityValues.map((val) => (
                <SelectItem key={val.key} description={val.description}>
                  {val.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {formData.visibility === 'ORG_SHARED' && allOrganizationsForUser && (
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
                {allOrganizationsForUser.map((org) => (
                  <SelectItem key={org.id!.toString()}>{org.name}</SelectItem>
                ))}
              </Select>
            </div>
          )}

          {allOrganizationsForUser && (
            <div>
              <Select
                selectedKeys={formData.associatedOrganizationId?.toString()}
                name="associatedOrganizationId"
                label="Associated Organization"
                description="This field is optional and it shows the organization or project within which the model was developed. You will see this information on the model's detail page, with the organization's name being clickable. By clicking on the name, you can visit the organization's page to learn more about it and see other models associated with the same organization."
                className="max-w-xl"
                onChange={handleChange}
              >
                {allOrganizationsForUser.map((org) => (
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

      {model.canDelete && (
        <>
          <Alert
            type="danger"
            title={'Danger Zone!'}
            description={'This is a dangerous action. Proceed with caution!'}
            className="mt-5"
          />
          <Button
            color="danger"
            onPress={() => {
              if (confirm('Are you sure you want to delete this model?')) {
                deleteModel();
              }
            }}
          >
            Delete model
          </Button>
        </>
      )}
    </div>
  );
}
