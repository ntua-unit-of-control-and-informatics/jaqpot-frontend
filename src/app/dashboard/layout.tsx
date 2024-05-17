import Sidebar from '@/app/components/Sidebar';
import { auth } from '@/auth';

export default async function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <>
      <Sidebar session={session} />
      <div className="p-4 h-screen sm:ml-64">{children}</div>
    </>
  );
}
