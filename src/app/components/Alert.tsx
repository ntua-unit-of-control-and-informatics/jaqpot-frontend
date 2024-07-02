import {
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

interface AlertProps {
  type: 'info' | 'danger' | 'success' | 'warning';
  title: string;
  description: string;
}

export default function Alert({ type, title, description }: AlertProps) {
  return (
    <>
      {type === 'info' && (
        <div
          className="mb-4 flex gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-gray-600 dark:text-blue-400"
          role="alert"
        >
          <div className="flex-shrink-0">
            <InformationCircleIcon className="size-6" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            {description}
          </div>
        </div>
      )}
      {type === 'danger' && (
        <div className="mb-4 flex gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-gray-600 dark:text-red-400">
          <div className="flex-shrink-0">
            <XCircleIcon className="size-6" />
          </div>
          <div role="alert">
            <p className="font-medium">{title}</p>
            {description}
          </div>
        </div>
      )}
      {type === 'success' && (
        <div
          className="mb-4 flex gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-gray-600 dark:text-green-400"
          role="alert"
        >
          <div className="flex-shrink-0">
            <CheckCircleIcon className="size-6" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            {description}
          </div>
        </div>
      )}
      {type === 'warning' && (
        <div
          className="mb-4 flex gap-3 rounded-lg bg-amber-100 p-4 text-sm text-amber-800 dark:bg-gray-600 dark:text-yellow-300"
          role="alert"
        >
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="size-6" />
          </div>
          <div>
            <p className="font-medium">{title}</p>
            {description}
          </div>
        </div>
      )}
    </>
  );
}
