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
          className="flex gap-3 p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
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
        <div className="flex gap-3 p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
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
          className="flex gap-3 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
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
          className="flex gap-3 p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
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
