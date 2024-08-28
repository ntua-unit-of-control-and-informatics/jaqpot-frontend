'use client';

import { ModelDto } from '@/app/api.types';
import React from 'react';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import Alert from '@/app/components/Alert';

interface FeaturesTabProps {
  model: ModelDto;
}

export default function ModelAdminTab({ model }: FeaturesTabProps) {
  const router = useRouter();

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
