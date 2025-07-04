import { Button, Group, Title } from "@mantine/core";
import {
	IconPlus,
	IconScale,
	IconDatabase,
	IconDatabaseOff,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import React from "react";
import { useAppDispatch } from "../redux/hooks";
import { setEvents } from "../redux/slices/eventsSlice";
import type { Event } from "../types/Event";
import { storageUtils } from "../utils/storage";
import { ThemeToggle } from "./ThemeToggle";

const HeaderComponent = () => {
	const dispatch = useAppDispatch();

	const handleMockDataOperation = (operation: () => Event[]) => {
		const events = operation();
		dispatch(setEvents(events));
	};

	return (
		<header className="p-4 bg-blue-600 text-white shadow-lg">
			<Group justify="space-between" align="center">
				<Group gap="lg">
					<Title order={2} c="white">
						💰 Walletfy
					</Title>
					<nav>
						<Group gap="md">
							<Button variant="subtle" color="white" component={Link} to="/">
								<IconScale size={18} />
							</Button>
							<Button
								variant="subtle"
								color="white"
								component={Link}
								to="/events/new"
							>
								<IconPlus size={18} />
							</Button>
							<Button
								variant="subtle"
								color="white"
								onClick={() =>
									handleMockDataOperation(storageUtils.loadMockData)
								}
								title="Load Mock Data"
							>
								<IconDatabase size={18} />
							</Button>
							<Button
								variant="subtle"
								color="white"
								onClick={() =>
									handleMockDataOperation(storageUtils.removeMockData)
								}
								title="Remove Mock Data"
							>
								<IconDatabaseOff size={18} />
							</Button>
						</Group>
					</nav>
				</Group>
				<ThemeToggle />
			</Group>
		</header>
	);
};

export default React.memo(HeaderComponent);
