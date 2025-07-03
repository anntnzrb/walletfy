import { Button, Group, Title } from "@mantine/core";
import { IconPlus, IconScale } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";

const HeaderComponent = () => {
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
						</Group>
					</nav>
				</Group>
				<ThemeToggle />
			</Group>
		</header>
	);
};

export default React.memo(HeaderComponent);
