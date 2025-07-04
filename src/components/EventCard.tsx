import { Card, Group, Text } from "@mantine/core";
import React from "react";
import { Tooltip } from "react-tooltip";
import type { Event } from "../types/Event";
import { EventActions } from "./EventActions";
import { EventBadge } from "./EventBadge";

const getTooltipContent = (descripcion?: string) =>
	descripcion || "Sin descripción";

interface EventCardProps {
	event: Event;
	onView: (event: Event) => void;
	onEdit: (event: Event) => void;
	onDelete: (eventId: string) => void;
}

const EventCardComponent: React.FC<EventCardProps> = ({
	event,
	onView,
	onEdit,
	onDelete,
}) => (
	<Card key={event.id} padding="sm" radius="sm" withBorder>
		<Group justify="space-between" align="center">
			<Group gap="sm" align="center">
				<Text
					fw={500}
					data-tooltip-id={`tooltip-${event.id}`}
					data-tooltip-content={getTooltipContent(event.descripcion)}
					style={{ cursor: "pointer" }}
				>
					{event.nombre}
				</Text>
				<Tooltip id={`tooltip-${event.id}`} />
				<EventBadge event={event} />
			</Group>
			<EventActions
				event={event}
				onView={onView}
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</Group>
	</Card>
);

export const EventCard = React.memo(EventCardComponent);
