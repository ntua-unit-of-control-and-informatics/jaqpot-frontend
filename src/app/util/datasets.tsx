import { Chip } from '@nextui-org/chip';
import React from 'react';
import { DatasetDto } from '@/app/api.types';

export function getDatasetStatusNode(dataset: DatasetDto | null | undefined) {
  if (!dataset) {
    return <></>;
  } else if (dataset?.status === 'SUCCESS') {
    return (
      <Chip color="success" variant="flat">
        Success
      </Chip>
    );
  } else if (dataset?.status === 'FAILURE') {
    return (
      <Chip color="danger" variant="flat">
        Failed
      </Chip>
    );
  } else {
    return <Chip color="primary">In progress</Chip>;
  }
}
