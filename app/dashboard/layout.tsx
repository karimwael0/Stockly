import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
