import Sidebar from '@/app/dashboard/components/Sidebar';
import { auth } from '@/auth';
import { ReactNode } from 'react';
import TopBar from '@/app/dashboard/components/TopBar';
import { SessionProvider } from 'next-auth/react';

export default async function Dashboard({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <Sidebar />
        <div className="min-h-screen sm:ml-72">
          <TopBar />
          <main className="p-8">{children}</main>
        </div>
      </SessionProvider>
    </>
  );
}
