import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminStaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell
      title="Staff Management"
      description="Add, edit, remove, and manage staff profiles and photos."
    >
      {children}
    </AdminShell>
  );
}
