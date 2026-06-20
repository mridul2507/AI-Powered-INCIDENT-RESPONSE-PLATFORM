import Sidebar from "@/components/Sidebar";
import PageTransition from "@/components/PageTransition";
import AIAssistant from "@/components/AIAssistant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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