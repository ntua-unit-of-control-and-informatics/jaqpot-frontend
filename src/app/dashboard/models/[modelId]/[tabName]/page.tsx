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

  if (!res.ok) return undefined;

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

  if (!res.ok) return undefined;

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { modelId: string };
}): Promise<Metadata> {
  const model = await getModel(params.modelId);

  return generateSharedMetadata(model?.name, model?.description);
}

export default async function Page({
  params,
}: {
  params: { modelId: string };
}) {
  let model;
  if (isNaN(Number(params.modelId))) {
    // legacy id detected
    model = await getLegacyModel(params.modelId);
    if (!model) {
      notFound();
    }
    redirect(`/dashboard/models/${model.id}/description`);
  }

  model = await getModel(params.modelId);
  if (!model) {
    notFound();
  }

  return (
    <>
      <ModelBreadcrumbs model={model} />

      <div className="flex flex-col pl-0">
        {/* Title */}
        <div className="max-w-3xl text-3xl font-semibold py-3">
          {model.name}
        </div>
        <div className="flex gap-4 items-center py-3">
          <div className="text-sm flex items-center">
            {model.type && (
              <>
                <BeakerIcon className="size-5 mr-2 text-gray-400" />
                <span>{model.type}</span>
              </>
            )}
          </div>
          <div className="text-sm flex items-center">
            {model.creator && (
              <>
                <UserIcon className="size-5 mr-2 text-gray-400" />
                <span>{model.creator?.name}</span>
              </>
            )}
          </div>
          <div className="text-sm flex items-center">
            {model.createdAt && (
              <>
                <CalendarDaysIcon className="size-5 mr-2 text-gray-400" />
                <JaqpotTimeAgo
                  date={new Date(model.createdAt as unknown as string)}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <ModelTabs model={model} />
    </>
  );
}
