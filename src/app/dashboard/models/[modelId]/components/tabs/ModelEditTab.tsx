'use client';

import {
  ModelDto,
  ModelsResponseDto,
  OrganizationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import {
  Card,
  CardBody,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
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
import { Divider } from '@nextui-org/divider';
import { CardHeader } from '@nextui-org/card';
import FeatureEditModal from '@/app/dashboard/models/[modelId]/components/FeatureEditModal';
import ModelArchiveModal from '@/app/dashboard/models/[modelId]/components/ModelArchiveModal';

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

export type PartiallyUpdateModelRequestDtoWithStringIds = Omit<
  PartiallyUpdateModelRequestDto,
  'sharedWithOrganizationIds'
> & {
  sharedWithOrganizationIds: string[];
};

export default function ModelEditTab({ model }: FeaturesTabProps) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const possibleModelTaskValues = [
    {
      key: 'REGRESSION',
      label: 'Regression',
      description: 'Predict a continuous value.',
    },
    {
      key: 'BINARY_CLASSIFICATION',
      label: 'Binary Classification',
      description:
        'Predict one of two possible classes using deep learning models, typically used with Torch.',
    },
    {
      key: 'MULTICLASS_CLASSIFICATION',
      label: 'Multiclass Classification',
      description:
        'Predict one of multiple classes using deep learning models, optimized for use with Torch.',
    },
  ];

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

  const sharedWithOrganizationIds =
    model.sharedWithOrganizations?.map((org) => org.id!.toString()) ?? [];

  const [formData, setFormData] =
    useState<PartiallyUpdateModelRequestDtoWithStringIds>({
      name: model.name,
      visibility: model.visibility,
      description: model.description ?? '',
      task: model.task,
      tags: model.tags ?? '',
      sharedWithOrganizationIds,
    });

  const [sharedWithOrganizations, setSharedWithOrganizations] = useState<
    Set<string>
  >(new Set(sharedWithOrganizationIds.map((id) => id.toString())));

  const handleSharedWithOrganizationsChange = (
    organizationIds: Set<string>,
  ) => {
    setSharedWithOrganizations(organizationIds);
    setFormData({
      ...formData,
      sharedWithOrganizationIds: Array.from(organizationIds.keys()),
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

  return (
    <div className="max-w-3xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Edit your model
          </h2>
          <div className="mb-4">
            <p className="text-tiny text-gray-600">
              Note: As the creator of this model, only you have access to this
              tab. No one else can make changes to your model.
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
              defaultSelectedKeys={[formData.task]}
              selectedKeys={[formData.task]}
              name="task"
              label="Model task"
              className="max-w-xs"
              onChange={handleChange}
              isRequired
            >
              {possibleModelTaskValues.map((val) => (
                <SelectItem key={val.key} description={val.description}>
                  {val.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <Select
              defaultSelectedKeys={[formData.visibility]}
              selectedKeys={[formData.visibility]}
              name="visibility"
              label="Visibility"
              className="max-w-xs"
              onChange={handleChange}
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
                defaultSelectedKeys={sharedWithOrganizations}
                selectedKeys={sharedWithOrganizations}
                selectionMode="multiple"
                label="Organizations to share with"
                className="max-w-xs"
                // @ts-ignore
                onSelectionChange={handleSharedWithOrganizationsChange}
              >
                {allOrganizationsForUser.map((org) => (
                  <SelectItem key={org.id!.toString()}>{org.name}</SelectItem>
                ))}
              </Select>
            </div>
          )}

          <div>
            <Textarea
              label="Tags"
              name="tags"
              description="Adding tags to your model will help others find it more easily through the search."
              placeholder="Enter a space separated list of tags"
              value={formData.tags}
              maxLength={1000}
              onChange={handleChange}
            />
          </div>
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
      <div>
        <h2 className="my-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors">
          Danger zone
        </h2>
        <p className="mb-4 text-sm">
          Archived models are hidden from public searches and marked with a
          warning banner.{' '}
          <b>
            Please note: archived models will be permanently deleted after 30
            days
          </b>
          . You can access your archived models in the Archived section of your
          models page until deletion. You can undo this action at any time.
        </p>
        {model.archived && (
          <Button color="danger" onPress={() => onOpen()}>
            Unarchive model
          </Button>
        )}
        {!model.archived && (
          <Button color="danger" onPress={() => onOpen()}>
            Archive model
          </Button>
        )}
      </div>
      <ModelArchiveModal
        model={model}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
}
