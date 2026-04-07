import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell
      title="Dashboard"
      description="Monitor customer feedback trends and export monthly reports."
    >
      {children}
    </AdminShell>
  );
}
