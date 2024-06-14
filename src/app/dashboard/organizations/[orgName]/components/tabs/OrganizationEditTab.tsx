'use client';

import {
  OrganizationDto,
  PartiallyUpdateModelRequestDto,
} from '@/app/api.types';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Select, SelectItem } from '@nextui-org/react';
import React, { useState } from 'react';
import { organizationVisibilitySelectValues } from '@/app/types/organization-select.types';

interface OrganizationEditTabProps {
  organization: OrganizationDto;
}

export default function OrganizationEditTab({
  organization,
}: OrganizationEditTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<OrganizationDto>({
    name: organization.name,
    contactEmail: organization.contactEmail,
    visibility: organization.visibility,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="mb-4">
            <p className="text-sm italic">
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
            <Select
              defaultSelectedKeys={[formData.visibility]}
              selectedKeys={[formData.visibility]}
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
