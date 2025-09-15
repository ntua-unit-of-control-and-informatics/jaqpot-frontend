'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { OrganizationDto } from '@/app/api.types';
import { ApiResponse } from '@/app/util/response';
import toast from 'react-hot-toast';
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { organizationVisibilitySelectValues } from '@/app/types/organization-select.types';
import { Button } from "@heroui/button";
import { useSWRConfig } from 'swr';

export default function NewOrganization() {
  const router = useRouter();
  const [formData, setFormData] = useState<OrganizationDto>({
    name: '',
    visibility: 'PUBLIC',
    contactEmail: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

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
      const res = await fetch('/api/organizations', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const { success, message, data }: ApiResponse = await res.json();
      if (success) {
        // notify user organizations to reload user organizations
        toast.success(
          'Organization created successfully! You will be redirected to the organization’s page shortly.',
        );
        await mutate('/api/user/organizations');
        router.push(`/dashboard/organizations/${data.organizationName}`);
      } else {
        toast.error(`Organization could not be created: ${message}`);
      }
      // Redirect or display success message as needed
    } catch (error: unknown) {
      // Display error message as needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-bold leading-7 sm:text-3xl sm:tracking-tight">
        Create Organization
      </h2>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            type="text"
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            description="Please enter a value between 3 and 200 characters long. The input can include letters, numbers, underscores (_), and hyphens (-)."
            pattern="[\w\-_]+"
            minLength={3}
            maxLength={200}
            errorMessage="Please enter a valid name. Allowed values are letters, numbers and dash (-) or underscores (_)"
            validationBehavior="native"
            isRequired
          />
          <Input
            type="email"
            name="contactEmail"
            label="Contact Email"
            validationBehavior="native"
            value={formData.contactEmail ?? ''}
            onChange={handleChange}
            isRequired
            errorMessage="Please enter a valid email"
          />
          <Select
            defaultSelectedKeys={[formData.visibility]}
            selectedKeys={[formData.visibility]}
            name="visibility"
            label="Visibility"
            className="max-w-xs"
            onChange={handleChange}
            isRequired
          >
            {organizationVisibilitySelectValues.map((val) => (
              <SelectItem key={val.key} description={val.description}>
                {val.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="my-6">
          <Textarea
            name="description"
            label="Description"
            value={formData.description ?? ''}
            onChange={handleChange}
            minLength={3}
            maxLength={2000}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <Input
              type="tel"
              name="contactPhone"
              label="Contact Phone"
              value={formData.contactPhone ?? ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              type="url"
              name="website"
              label="Website"
              value={formData.website ?? ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              type="text"
              name="address"
              label="Address"
              value={formData.address ?? ''}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button
          color="primary"
          type="submit"
          className="mt-6"
          isLoading={isLoading}
        >
          Create Organization
        </Button>
      </form>
    </div>
  );
}
