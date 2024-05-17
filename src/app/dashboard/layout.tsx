import Sidebar from '@/app/components/Sidebar';

export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <div className="p-4 h-screen sm:ml-64">{children}</div>
    </>
  );
}
