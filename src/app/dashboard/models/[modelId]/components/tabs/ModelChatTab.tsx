import { Tab, Tabs } from '@nextui-org/tabs';
import { ModelDto } from '@/app/api.types';
import { LLMForm } from '@/app/dashboard/models/[modelId]/components/llm/LLMForm';
import { usePathname } from 'next/navigation';
import LLMNavigation from '@/app/dashboard/models/[modelId]/components/llm/LLMNavigation';

interface ModelChatTabProps {
  model: ModelDto;
  datasetId?: string;
}

export default function ModelChatTab({ model, datasetId }: ModelChatTabProps) {
  return <LLMNavigation model={model} datasetId={datasetId} />;
}
