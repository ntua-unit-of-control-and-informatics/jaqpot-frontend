import {
  BuildingOfficeIcon,
  CircleStackIcon,
  PlusIcon,
  QueueListIcon,
} from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Tooltip } from '@nextui-org/tooltip';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { Link } from '@nextui-org/link';

export default function CreateMenu() {
  const router = useRouter();

  return (
    <Dropdown
      classNames={{
        trigger: 'p-0 min-w-0 gap-0', // change arrow background
      }}
    >
      <DropdownTrigger>
        <Button variant="light">
          <PlusIcon className="h-6 w-6 text-gray-400" />
          <ChevronDownIcon
            className="ml-1 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Create new items">
        <DropdownItem
          key="new-model"
          textValue="New Model"
          href="/dashboard/new/model"
        >
          <div className="flex">
            <CircleStackIcon className="mr-2 size-6" />
            New Model
          </div>
        </DropdownItem>
        <DropdownItem
          key="new-organization"
          textValue="New Organization"
          href="/dashboard/new/organization"
        >
          <div className="flex">
            <BuildingOfficeIcon className="mr-2 h-6 w-6" />
            New Organization
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
