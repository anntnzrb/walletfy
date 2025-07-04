import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "@/components/Header";
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
				className={`min-h-screen ${themeMode === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
			>
				<Outlet />
			</main>
			<TanStackRouterDevtools />
			<TanStackQueryLayout />
		</>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});
