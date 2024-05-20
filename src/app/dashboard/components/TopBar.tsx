import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserAvatar from '@/app/dashboard/components/UserAvatar';
import { Session } from 'next-auth';
import SearchBar from '@/app/dashboard/components/SearchBar';

export default function TopBar({ session }: { session: Session | null }) {
  return (
    <div className="w-full px-8 py-3 border-b border-b-gray-300 shadow-[rgba(0,0,0,0.05)_0_1px_2px_0px]">
      <div className="flex flex-row gap-x-6 ">
        <SearchBar />
        <div className="flex gap-x-5 items-center">
          <button type="button" className="p-2.5">
            <BellIcon className="size-6 text-gray-400" />
          </button>
          {/*DIVIDER*/}
          <div
            className="bg-gray-900 w-px h-6 bg-opacity-10"
            aria-hidden="true"
          ></div>
          <UserAvatar session={session} />
        </div>
      </div>
    </div>
  );
}
