import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import AIAssistant from "@/components/AIAssistant";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-emerald-950">

      <Sidebar />

      <main className="flex-1 bg-white dark:bg-emerald-950">
        <PageTransition>
          {children}
        </PageTransition>
      </main>

      <AIAssistant />

    </div>
  );
}