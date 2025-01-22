import { Tab, Tabs } from '@nextui-org/tabs';
import { ModelDto } from '@/app/api.types';
import { LLMForm } from '@/app/dashboard/models/[modelId]/components/llm/LLMForm';
import { usePathname } from 'next/navigation';
import LLMNavigation from '@/app/dashboard/models/[modelId]/components/llm/LLMNavigation';
import Alert from '@/app/components/Alert';

interface ModelChatTabProps {
  model: ModelDto;
  datasetId?: string;
}

export default function ModelChatTab({ model, datasetId }: ModelChatTabProps) {
  return (
    <>
      <Alert
        type="info"
        title="Important privacy notice"
        description="Jaqpot team members may review chat
          conversations for troubleshooting purposes. Please avoid sharing any
          personal or sensitive information in these chats. Thank you for your
          understanding."
      />
      <LLMNavigation model={model} datasetId={datasetId} />
    </>
  );
}
