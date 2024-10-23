'use client';

import { DatasetDto, FeatureDto, ModelDto } from '@/app/api.types';
import DynamicForm, {
  DynamicFormFieldType,
  DynamicFormSchema,
} from '@/app/dashboard/models/[modelId]/components/DynamicForm';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import DatasetResults from '@/app/dashboard/models/[modelId]/components/DatasetResults';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/app/util/response';
import { Spinner } from '@nextui-org/spinner';
import { Radio, RadioGroup } from '@nextui-org/react';
import UploadCSVForm from '@/app/dashboard/models/[modelId]/components/UploadCSVForm';
import Alert from '@/app/components/Alert';
import { isAuthenticated } from '@/app/util/auth';
import { useSession } from 'next-auth/react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

interface ModelEvaluateTabProps {
  model: ModelDto;
}

export default function ModelEvaluateTab({ model }: ModelEvaluateTabProps) {
  const defaultContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  return (
    <Accordion>
      <AccordionItem
        key="scores"
        aria-label="Scores"
        subtitle="Press to expand"
        title="Model Scores"
      >
        {defaultContent}
      </AccordionItem>
      <AccordionItem
        key="validate"
        aria-label="Validate"
        subtitle={<span>Press to expand</span>}
        title="Validate model"
      >
        {defaultContent}
      </AccordionItem>
    </Accordion>
  );
}
