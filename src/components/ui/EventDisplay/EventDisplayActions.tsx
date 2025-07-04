import { ActionIcon, Group, Text } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import React from "react";
import { dateHelpers } from "../../../utils/dateHelpers";
import { useEventDisplayContext } from "./EventDisplay";

const EventDisplayActionsComponent: React.FC = () => {
	const { event, onView, onEdit, onDelete } = useEventDisplayContext();

	return (
		<Group gap="xs">
			<Text size="sm" c="gray.6">
				{dateHelpers.formatDate(event.fecha)}
			</Text>
			{onView && (
				<ActionIcon
					size="sm"
					variant="subtle"
					color="blue"
					onClick={() => onView(event)}
				>
					<IconEye size={16} />
				</ActionIcon>
			)}
			{onEdit && (
				<ActionIcon
					size="sm"
					variant="subtle"
					color="yellow"
					onClick={() => onEdit(event)}
				>
					<IconEdit size={16} />
				</ActionIcon>
			)}
			{onDelete && (
				<ActionIcon
					size="sm"
					variant="subtle"
					color="red"
					onClick={() => onDelete(event.id)}
				>
					<IconTrash size={16} />
				</ActionIcon>
			)}
		</Group>
	);
};

export const EventDisplayActions = React.memo(EventDisplayActionsComponent);
