import Sidebar from '@/app/dashboard/components/Sidebar';
import { auth } from '@/auth';
import { ReactNode } from 'react';
import TopBar from '@/app/dashboard/components/TopBar';
import { SessionProvider } from 'next-auth/react';
import DashboardLayout from '@/app/dashboard/dashboard-layout';

export default async function Dashboard({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth();
  return (
    <>
      <SessionProvider session={session}>
        <DashboardLayout>{children}</DashboardLayout>
      </SessionProvider>
    </>
  );
}
