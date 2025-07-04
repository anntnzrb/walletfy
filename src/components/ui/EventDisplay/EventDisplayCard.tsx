import { Card, Group } from "@mantine/core";
import React from "react";
import { useEventDisplayContext } from "./EventDisplay";
import { EventDisplayActions } from "./EventDisplayActions";
import { EventDisplayBadge } from "./EventDisplayBadge";
import { EventDisplayTitle } from "./EventDisplayTitle";
import type { EventDisplayCardProps } from "./types";

const EventDisplayCardComponent: React.FC<EventDisplayCardProps> = ({
	padding = "sm",
	radius = "sm",
	withBorder = true,
}) => {
	const { event } = useEventDisplayContext();

	return (
		<Card
			key={event.id}
			padding={padding}
			radius={radius}
			withBorder={withBorder}
		>
			<Group justify="space-between" align="center">
				<Group gap="sm" align="center">
					<EventDisplayTitle />
					<EventDisplayBadge />
				</Group>
				<EventDisplayActions />
			</Group>
		</Card>
	);
};

export const EventDisplayCard = React.memo(EventDisplayCardComponent);
