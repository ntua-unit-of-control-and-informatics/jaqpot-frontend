import { BuildingOfficeIcon, PlusIcon } from '@heroicons/react/24/solid';
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
          <PlusIcon className="w-6 h-6 text-gray-400" />
          <ChevronDownIcon
            className="w-4 h-4 text-gray-400 ml-1"
            aria-hidden="true"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Create new items">
        <DropdownItem
          key="new-organization"
          textValue="New Organization"
          onClick={() => router.push('/dashboard/new/organization')}
        >
          <div className="flex">
            <BuildingOfficeIcon className="w-6 h-6 mr-2" />
            New Organization
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
