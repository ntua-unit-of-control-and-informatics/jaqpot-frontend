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
import { PartiallyUpdateModelRequestDtoWithStringIds } from '@/app/dashboard/models/[modelId]/components/tabs/ModelEditTab';

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

export default function ModelAdminTab({ model }: FeaturesTabProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { data: allOrganizations, error } = useSWR(
    `/api/organizations`,
    orgFetcher,
  );

  const sharedWithOrganizationIds =
    model.sharedWithOrganizations?.map((org) => org.id!.toString()) ?? [];
  const affiliatedOrganizationIds =
    model.affiliatedOrganizations?.map((org) => org.id!.toString()) ?? [];

  const [formData, setFormData] =
    useState<PartiallyUpdateModelRequestDtoWithStringIds>({
      name: model.name,
      visibility: model.visibility,
      description: model.description ?? '',
      tags: model.tags ?? '',
      sharedWithOrganizationIds,
      affiliatedOrganizationIds,
    });

  const [affiliatedOrganizations, setAffiliatedOrganizations] = useState<
    Set<string>
  >(new Set(affiliatedOrganizationIds.map((id) => id.toString())));

  const handleAffiliatedOrganizationsChange = (
    organizationIds: Set<string>,
  ) => {
    setAffiliatedOrganizations(organizationIds);
    setFormData({
      ...formData,
      affiliatedOrganizationIds: Array.from(organizationIds.keys()),
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
    <div>
      <Alert
        type={'info'}
        title={'Admin area'}
        description={'Currently accessible only to jaqpot admins'}
      />
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-4 text-tiny">
          <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Affiliate your model
          </h2>

          <p>
            Link this model to an organization you&apos;re affiliated with.
            {/*After this is approved by the organization owners, this will:*/}
          </p>
          <ul className="list-inside list-disc">
            <li>Display the organization on your model&apos;s page</li>
            <li>List your model on the organization&apos;s page</li>
          </ul>

          {allOrganizations && (
            <div>
              <Select
                defaultSelectedKeys={affiliatedOrganizations}
                selectedKeys={affiliatedOrganizations}
                selectionMode="multiple"
                name="affiliatedOrganizationIds"
                label="Affiliated Organizations"
                description="This field is optional and it shows the organization or project within which the model was developed. You will see this information on the model's detail page, with the organization's name being clickable. By clicking on the name, you can visit the organization's page to learn more about it and see other models affiliated with the same organization."
                className="max-w-xl"
                // @ts-ignore
                onSelectionChange={handleAffiliatedOrganizationsChange}
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

      {model.isAdmin && (
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
