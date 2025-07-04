import { Card, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { useEventDisplayContext } from "./EventDisplay";
import { EventDisplayActions } from "./EventDisplayActions";
import { EventDisplayBadge } from "./EventDisplayBadge";
import { EventDisplayTitle } from "./EventDisplayTitle";
import type { EventDisplayCardProps } from "./types";

const EventDisplayCardComponent: React.FC<EventDisplayCardProps> = ({
	padding = "md",
	radius = "md",
	withBorder = true,
}) => {
	const { event } = useEventDisplayContext();

	return (
		<Card
			key={event.id}
			padding={padding}
			radius={radius}
			withBorder={withBorder}
			style={{ height: "100%" }}
		>
			<Stack gap="md" style={{ height: "100%" }}>
				<Group
					justify="center"
					style={{ minHeight: "60px", alignItems: "center" }}
				>
					<EventDisplayBadge size="lg" />
				</Group>

				<Stack gap="xs" style={{ flex: 1 }}>
					<EventDisplayTitle />
					{event.descripcion && (
						<Text size="sm" c="dimmed" lineClamp={3}>
							{event.descripcion}
						</Text>
					)}
				</Stack>

				<EventDisplayActions />
			</Stack>
		</Card>
	);
};

export const EventDisplayCard = React.memo(EventDisplayCardComponent);
