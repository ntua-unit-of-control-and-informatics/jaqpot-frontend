import { auth } from '@/auth';
import { ModelDto } from '@/app/api.types';
import {
  BeakerIcon,
  UserIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import ModelTabs from '@/app/dashboard/models/[modelId]/components/ModelTabs';
import { notFound, redirect } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import ModelBreadcrumbs from '@/app/dashboard/models/[modelId]/components/ModelBreadcrumbs';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/JaqpotTimeAgo';
import React from 'react';
import { Tooltip } from '@nextui-org/tooltip';
import { logger } from '@/logger';
import CustomErrorPage from '@/app/components/CustomErrorPage';
import Alert from '@/app/components/Alert';
import { getUserFriendlyDate } from '@/app/util/date';
import { addDays } from 'date-fns';

const log = logger.child({ module: 'modelPage' });

export async function generateMetadata({
  params,
}: {
  params: ModelPageParams;
}): Promise<Metadata> {
  let model;
  try {
    model = await retrieveModelOrLegacy(params.modelId);
  } catch (e) {
    return generateSharedMetadata();
  }

  return generateSharedMetadata(model?.name, model?.description);
}

export async function getLegacyModel(
  modelId: string,
): Promise<ModelDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const res = await fetch(
    `${process.env.API_URL}/v1/models/legacy/${modelId}`,
    {
      headers: {
        ...authorizationHeader,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!res.ok) {
    if (res.status === 401 || res.status === 404) {
      return undefined;
    } else if (res.status === 401) {
      throw new Error(
        'You are not logged in. Please log in to access this page.',
      );
    } else if (res.status === 403) {
      throw new Error('You do not have permission to access this page.');
    }
    log.warn(
      `Legacy model with id ${modelId} not found, status returned: ${res.status}`,
    );
    return undefined;
  }

  return res.json();
}

export async function getModel(modelId: string): Promise<ModelDto | undefined> {
  const authorizationHeader: Record<string, string> = {};
  const session = await auth();
  if (isAuthenticated(session)) {
    authorizationHeader['Authorization'] = `Bearer ${session!.token}`;
  }

  const res = await fetch(`${process.env.API_URL}/v1/models/${modelId}`, {
    headers: {
      ...authorizationHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return undefined;
    } else if (res.status === 401) {
      throw new Error(
        'You are not logged in. Please log in to access this page.',
      );
    } else if (res.status === 403) {
      throw new Error('You do not have permission to access this page.');
    }
    log.warn(
      `Model with id ${modelId} not found, status returned: ${res.status}`,
    );
    return undefined;
  }

  return res.json();
}

interface ModelPageParams {
  modelId: string;
}

async function retrieveModelOrLegacy(modelId: string): Promise<ModelDto> {
  let model;
  if (isNaN(Number(modelId))) {
    // legacy id detected
    model = await getLegacyModel(modelId);
    if (!model) {
      notFound();
    }
    redirect(`/dashboard/models/${model.id}/description`);
  } else {
    model = await getModel(modelId);
    if (!model) {
      notFound();
    }
  }
  return model;
}

export default async function Page({ params }: { params: ModelPageParams }) {
  let model;
  try {
    model = await retrieveModelOrLegacy(params.modelId);
  } catch (e: any) {
    if (e?.message === 'NEXT_REDIRECT' || e?.digest === 'NEXT_NOT_FOUND') {
      throw e;
    }

    return (
      <CustomErrorPage
        title="Something's wrong here 🚧"
        description={(e as any)?.message}
      />
    );
  }

  const getModelDeletionDate = (archivedAt: string) => {
    if (!archivedAt) {
      log.error('Archived at date is missing on an archived model');
      return '';
    }
    return getUserFriendlyDate(addDays(new Date(archivedAt), 30));
  };

  return (
    <div className="p-2 sm:p-0">
      <ModelBreadcrumbs model={model} />

      {model.archived && (
        <Alert
          type="warning"
          title="Archived Model"
          description={`This model has been archived and scheduled for deletion ${getModelDeletionDate(model.archivedAt as unknown as string)}. Contact the owner if you need access to this resource. `}
        />
      )}

      <div className="flex flex-col pl-0">
        {/* Title */}
        <div className="max-w-3xl py-3 text-3xl font-semibold">
          {model.name}
        </div>
        <div className="flex items-center gap-4 py-3">
          <div className="flex items-center text-sm text-gray-400">
            {model.type && (
              <>
                <Tooltip content={'Model type'} closeDelay={0}>
                  <div className="flex">
                    <BeakerIcon className="mr-2 size-5 text-gray-400" />
                    <span>{model.type}</span>
                  </div>
                </Tooltip>
              </>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            {model.creator && (
              <Tooltip content={'Creator'} closeDelay={0}>
                <div className="flex">
                  <UserIcon className="mr-2 size-5 text-gray-400" />
                  <span>{model.creator?.username}</span>
                </div>
              </Tooltip>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            {model.createdAt && (
              <>
                <Tooltip content={'Date created'} closeDelay={0}>
                  <div className="flex">
                    <CalendarDaysIcon className="mr-2 size-5 text-gray-400" />
                    <JaqpotTimeAgo
                      date={new Date(model.createdAt as unknown as string)}
                    />
                  </div>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      </div>

      <ModelTabs model={model} />
    </div>
  );
}
