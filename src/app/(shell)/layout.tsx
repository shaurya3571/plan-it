import { AppSidebar } from "@/components/app-sidebar";
import { initials } from "@/lib/plan";
import { requireProfile } from "@/server/auth/guards";

export default async function ShellLayout({ children }: LayoutProps<"/">) {
  const { displayName } = await requireProfile();

  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <AppSidebar name={displayName} initials={initials(displayName)} />
      <main className="flex min-w-0 flex-1 flex-col pt-[84px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}
