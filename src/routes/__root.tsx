import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import Header from "@/components/Header";
import { ProtectedChatAssistant } from "@/components/ProtectedChatAssistant";
import { AuthGuard } from "@/components/AuthGuard";
import { useInitialData } from "@/hooks/useInitialData";
import { useAppSelector } from "@/redux/hooks";

import TanStackQueryLayout from "@/integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

function RootComponent() {
  useInitialData();
  const themeMode = useAppSelector((state) => state.theme.mode);

  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "calc(100vh - 80px)",
          backgroundColor:
            themeMode === "dark"
              ? "var(--walletfy-dark-bg)"
              : "var(--walletfy-gray-50)",
          padding: "var(--walletfy-space-lg) 0",
        }}
      >
        <Outlet />
      </main>
      <AuthGuard>
        <ProtectedChatAssistant />
      </AuthGuard>
      <TanStackQueryLayout />
    </>
  );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});
