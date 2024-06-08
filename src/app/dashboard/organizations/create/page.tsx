'use client';

import React, { useState } from 'react';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { OrganizationDto } from '@/app/api.types';
import toast from 'react-hot-toast';

export default function Page() {
  const [formData, setFormData] = useState<OrganizationDto>({
    name: '',
    creatorId: '',
    description: '',
    userIds: [],
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
  });

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
      const res = await fetch('/api/organizations', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Organization created successfully`);
      } else {
        toast.error(`Error creating organization:  ${data?.message}`);
      }
      // Redirect or display success message as needed
    } catch (error: unknown) {
      // Display error message as needed
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Create Organization
      </h2>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-2 gap-6">
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
            value={formData.contactEmail}
            onChange={handleChange}
            isRequired
            errorMessage="Please enter a valid email"
          />
        </div>
        <div className="my-6">
          <Textarea
            name="description"
            label="Description"
            value={formData.description}
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
              value={formData.contactPhone}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              type="url"
              name="website"
              label="Website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
          <div>
            <Input
              type="text"
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button color="primary" type="submit" className="mt-6">
          Create Organization
        </Button>
      </form>
    </div>
  );
}
