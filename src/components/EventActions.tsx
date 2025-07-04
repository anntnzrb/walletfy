import { ActionIcon, Group, Text } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import React from "react";
import type { Event } from "../types/Event";
import { dateHelpers } from "../utils/dateHelpers";

interface EventActionsProps {
	event: Event;
	onView: (event: Event) => void;
	onEdit: (event: Event) => void;
	onDelete: (eventId: string) => void;
}

const EventActionsComponent: React.FC<EventActionsProps> = ({
	event,
	onView,
	onEdit,
	onDelete,
}) => (
	<Group gap="xs">
		<Text size="sm" c="gray.6">
			{dateHelpers.formatDate(event.fecha)}
		</Text>
		<ActionIcon
			size="sm"
			variant="subtle"
			color="blue"
			onClick={() => onView(event)}
		>
			<IconEye size={16} />
		</ActionIcon>
		<ActionIcon
			size="sm"
			variant="subtle"
			color="yellow"
			onClick={() => onEdit(event)}
		>
			<IconEdit size={16} />
		</ActionIcon>
		<ActionIcon
			size="sm"
			variant="subtle"
			color="red"
			onClick={() => onDelete(event.id)}
		>
			<IconTrash size={16} />
		</ActionIcon>
	</Group>
);

export const EventActions = React.memo(EventActionsComponent);
