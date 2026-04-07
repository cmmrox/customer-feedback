import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminStaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminShell
      title="Staff Management"
      description="Add, edit, remove, and prepare profile photos before backend integration."
    >
      {children}
    </AdminShell>
  );
}
