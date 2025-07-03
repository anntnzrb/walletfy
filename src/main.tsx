import { MantineProvider, createTheme } from "@mantine/core";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProvider.getContext(),
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 30000,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Create Mantine theme with financial colors
const theme = createTheme({
	colors: {
		green: [
			"#dcfce7",
			"#bbf7d0",
			"#86efac",
			"#4ade80",
			"#22c55e",
			"#16a34a",
			"#15803d",
			"#166534",
			"#14532d",
			"#052e16",
		],
		red: [
			"#fee2e2",
			"#fecaca",
			"#fca5a5",
			"#f87171",
			"#ef4444",
			"#dc2626",
			"#b91c1c",
			"#991b1b",
			"#7f1d1d",
			"#450a0a",
		],
		blue: [
			"#dbeafe",
			"#bfdbfe",
			"#93c5fd",
			"#60a5fa",
			"#3b82f6",
			"#2563eb",
			"#1d4ed8",
			"#1e40af",
			"#1e3a8a",
			"#172554",
		],
	},
	primaryColor: "blue",
});

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<Provider store={store}>
				<MantineProvider theme={theme}>
					<TanStackQueryProvider.Provider>
						<RouterProvider router={router} />
					</TanStackQueryProvider.Provider>
				</MantineProvider>
			</Provider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
