'use client';

import { ApiKeyDto } from '@/app/api.types';
import { Accordion, AccordionItem } from "@heroui/accordion";
import { KeyIcon } from '@heroicons/react/24/outline';
import React from 'react';
import CreateAPIKeyButton from '@/app/dashboard/api-keys/components/CreateAPIKeyButton';
import { Snippet } from "@heroui/snippet";
import { Switch } from "@heroui/switch";
import ApiKeyContent from '@/app/dashboard/api-keys/components/ApiKeyContent';
import { Link } from "@heroui/link";

export default function ApiKeys({ apiKeys }: { apiKeys: ApiKeyDto[] }) {
  return (
    <div>
      <CreateAPIKeyButton />
      <p>
        Refer to the{' '}
        <Link isExternal href={'https://jaqpot.org/docs'}>
          documentation
        </Link>{' '}
        for instructions on using API keys to programmatically access the Jaqpot
        API.
      </p>
      <div className="max-w-3xl">
        {apiKeys.length === 0 && <div>No API keys found</div>}

        <Accordion>
          {apiKeys.map((apiKey) => (
            <AccordionItem
              key={apiKey.clientKey}
              aria-label="Api Key"
              startContent={<KeyIcon className="size-6" />}
              title={
                apiKey.note ?? (
                  <div className="text-gray-400">&lt;no description&gt;</div>
                )
              }
              subtitle={
                <span>
                  Press to expand <strong>{apiKey.note}</strong>
                </span>
              }
            >
              <ApiKeyContent apiKey={apiKey} onDelete={() => {}} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
