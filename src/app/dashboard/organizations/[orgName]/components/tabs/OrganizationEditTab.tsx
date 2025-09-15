'use client';

import {
  OrganizationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/react";
import React, { useState } from 'react';
import { organizationVisibilitySelectValues } from '@/app/types/organization-select.types';
import { ApiResponse } from '@/app/util/response';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Link } from "@heroui/link";

interface OrganizationEditTabProps {
  organization: OrganizationDto;
}

export default function OrganizationEditTab({
  organization,
}: OrganizationEditTabProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrganizationDto>({
    name: organization.name,
    description: organization.description,
    contactEmail: organization.contactEmail,
    visibility: organization.visibility,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await fetch(`/api/organizations/${organization.id}/partial`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      const { success, data, message }: ApiResponse = await res.json();
      if (success) {
        toast.success(`Organization updated successfully`);
        router.refresh();
      } else {
        toast.error(`Error updating organization:  ${message}`);
      }
    } catch (error: unknown) {
      // Display error message as needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <p className="text-tiny text-gray-600">
              Note: As the creator of this organization, only you have access to
              this edit tab. No one else can make changes to your organization.
            </p>
          </div>
          <div>
            <Input
              label="Name"
              name="name"
              placeholder="Enter the organization name"
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
                  The description of your organization. Supports{' '}
                  <Link
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    className="text-tiny"
                  >
                    basic markdown
                  </Link>
                </>
              }
              placeholder="Enter the organization description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              type="email"
              label="Contact Email"
              name="contactEmail"
              validationBehavior="native"
              placeholder="Enter the organization contact email"
              value={formData.contactEmail}
              onChange={handleChange}
              isRequired
            ></Input>
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
              {organizationVisibilitySelectValues.map((val) => (
                <SelectItem key={val.key} description={val.description}>
                  {val.label}
                </SelectItem>
              ))}
            </Select>
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
    </div>
  );
}
