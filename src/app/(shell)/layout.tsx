import { AppSidebar } from "@/components/app-sidebar";

export default function ShellLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col pt-[84px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}
