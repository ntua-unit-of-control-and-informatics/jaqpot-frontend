import { ChatMessage } from '@/app/dashboard/models/[modelId]/components/llm/LLMForm';
import MarkdownRenderer from '@/app/dashboard/models/[modelId]/components/MarkdownRenderer';

function ChatMessageContent({ prompt, output }: ChatMessage) {
  return (
    <>
      <div className="contents">
        <div className="break-words p-4">{prompt}</div>
        <div className=""></div>
      </div>

      <div className="contents">
        <div className=""></div>
        <div className="rounded-lg bg-gray-100 p-4">
          <MarkdownRenderer>{output}</MarkdownRenderer>
        </div>
      </div>
    </>
  );
}

interface ChatGridProps {
  messages: ChatMessage[];
}

export default function ChatGrid({ messages }: ChatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {messages.map((msg, idx) => (
        <ChatMessageContent key={idx} {...msg} />
      ))}
    </div>
  );
}
