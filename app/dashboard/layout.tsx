// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <header className="shadow p-4">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
}
