import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/crm/Sidebar";

export default async function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If unauthenticated, redirect to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#0b0807] text-[#f4eee5]">
      {/* Navigation Sidebar */}
      <Sidebar user={session} />

      {/* Main App Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

