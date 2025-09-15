import {
  ArrowTopRightOnSquareIcon,
  BugAntIcon,
  BuildingOfficeIcon,
  CircleStackIcon,
  PlusIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Tooltip } from "@heroui/tooltip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useRouter } from 'next/navigation';
import { Link } from "@heroui/link";

export default function CreateMenu() {
  const router = useRouter();

  return (
    <div className="hidden sm:block">
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
        <DropdownMenu aria-label="Create new model">
          <DropdownItem
            key="new-model"
            textValue="New Model"
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/docs/getting-started`}
            target="_blank"
          >
            <div className="flex items-center">
              <CircleStackIcon className="mr-2 size-6" />
              New Model
              <ArrowTopRightOnSquareIcon className={`ml-2 h-4 w-4`} />
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
          <DropdownItem
            key="new-issue"
            textValue="Report a bug"
            href="https://github.com/ntua-unit-of-control-and-informatics/jaqpotpy/issues/new?assignees=&labels=&projects=&template=bug_report.md&title="
            target="_blank"
          >
            <div className="flex items-center">
              <BugAntIcon className="mr-2 h-6 w-6" />
              Report a bug
              <ArrowTopRightOnSquareIcon className={`ml-2 h-4 w-4`} />
            </div>
          </DropdownItem>
          <DropdownItem
            key="new-feature"
            textValue="Request a feature"
            href="https://github.com/ntua-unit-of-control-and-informatics/jaqpotpy/issues/new?assignees=&labels=&projects=&template=feature_request.md&title="
            target="_blank"
          >
            <div className="flex items-center">
              <LightBulbIcon className="mr-2 h-6 w-6" />
              Request a feature
              <ArrowTopRightOnSquareIcon className={`ml-2 h-4 w-4`} />
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
