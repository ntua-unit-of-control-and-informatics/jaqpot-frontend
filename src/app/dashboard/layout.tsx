import Sidebar from '@/app/dashboard/components/Sidebar';
import { auth } from '@/auth';
import { ReactNode } from 'react';
import TopBar from '@/app/dashboard/components/TopBar';

export default async function Dashboard({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      <Sidebar session={session} />
      <div className="h-screen sm:ml-72">
        <TopBar session={session} />
        <main className="p-8">{children}</main>
      </div>
    </>
  );
}
