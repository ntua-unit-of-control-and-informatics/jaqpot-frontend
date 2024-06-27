import { auth } from '@/auth';
import { ModelDto } from '@/app/api.types';
import {
  BeakerIcon,
  UserIcon,
  CalendarIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import ModelTabs from '@/app/dashboard/models/[modelId]/components/ModelTabs';
import { notFound, redirect } from 'next/navigation';
import { isAuthenticated } from '@/app/util/auth';
import ModelBreadcrumbs from '@/app/dashboard/models/[modelId]/components/ModelBreadcrumbs';
import toast from 'react-hot-toast';
import { Metadata } from 'next';
import { generateSharedMetadata } from '@/app/shared.metadata';
import TimeAgo from '@/app/dashboard/models/[modelId]/components/TimeAgo';
import JaqpotTimeAgo from '@/app/dashboard/models/[modelId]/components/TimeAgo';
import { getErrorMessageFromResponse } from '@/app/util/response';

export async function generateMetadata({
  params,
}: {
  params: ModelPageParams;
}): Promise<Metadata> {
  const model = await retrieveModelOrLegacy(params.modelId);

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
    if (res.status === 404) {
      return undefined;
    }
    console.error(
      `Model with id ${modelId} not found, status returned: ${res.status}`,
    );
    throw new Error(await getErrorMessageFromResponse(res));
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
    }
    console.error(
      `Model with id ${modelId} not found, status returned: ${res.status}`,
    );
    throw new Error(await getErrorMessageFromResponse(res));
  }

  return res.json();
}

interface ModelPageParams {
  modelId: string;
}

async function retrieveModelOrLegacy(modelId: string): Promise<ModelDto> {
  let model;
  console.log('retrieve', modelId);
  if (isNaN(Number(modelId))) {
    // legacy id detected
    model = await getLegacyModel(modelId);
    if (!model) {
      console.log('ohhai');
      notFound();
    }
    redirect(`/dashboard/models/${model.id}/description`);
  } else {
    model = await getModel(modelId);
    if (!model) {
      console.log('ohhai2');
      notFound();
    }
  }
  return model;
}

export default async function Page({ params }: { params: ModelPageParams }) {
  const model = await retrieveModelOrLegacy(params.modelId);

  return (
    <div className="p-2 sm:p-0">
      <ModelBreadcrumbs model={model} />

      <div className="flex flex-col pl-0">
        {/* Title */}
        <div className="max-w-3xl py-3 text-3xl font-semibold">
          {model.name}
        </div>
        <div className="flex items-center gap-4 py-3">
          <div className="flex items-center text-sm text-gray-400">
            {model.type && (
              <>
                <BeakerIcon className="mr-2 size-5 text-gray-400" />
                <span>{model.type}</span>
              </>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            {model.creator && (
              <>
                <UserIcon className="mr-2 size-5 text-gray-400" />
                <span>{model.creator?.name}</span>
              </>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-400">
            {model.createdAt && (
              <>
                <CalendarDaysIcon className="mr-2 size-5 text-gray-400" />
                <JaqpotTimeAgo
                  date={new Date(model.createdAt as unknown as string)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <ModelTabs model={model} />
    </div>
  );
}
