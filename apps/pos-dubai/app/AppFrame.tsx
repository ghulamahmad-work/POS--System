import { AppShell } from "@repo/ui/AppShell";
import type { ReactNode } from "react";

type AppFrameProps = {
  pageTitle: string;
  headerActions?: ReactNode;
  children: ReactNode;
};

export function AppFrame({ pageTitle, headerActions, children }: AppFrameProps) {
  return (
    <AppShell
      appName="Dubai Grocery Store"
      pageTitle={pageTitle}
      headerActions={headerActions}
      userLabel="Dubai Counter"
    >
      {children}
    </AppShell>
  );
}
