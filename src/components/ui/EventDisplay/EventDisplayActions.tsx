import { ActionIcon, Group, Text } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import React from "react";
import { dateHelpers } from "@/utils/dateHelpers";
import { useEventDisplayContext } from "./EventDisplay";
import { styleHelpers } from "@/utils/styleHelpers";

const EventDisplayActionsComponent: React.FC = () => {
  const { event, onView, onEdit, onDelete } = useEventDisplayContext();
  const helperTextStyles = styleHelpers.helperText("sm");

  return (
    <Group gap="xs" justify="space-between" align="center">
      <Text {...helperTextStyles} style={{ fontSize: "0.75rem" }}>
        📅 {dateHelpers.formatDate(event.fecha)}
      </Text>
      <Group gap="xs">
        {onView && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => onView(event)}
            {...styleHelpers.actionIcon("var(--walletfy-primary)")}
            title="👁️ Ver detalles"
          >
            <IconEye size={16} />
          </ActionIcon>
        )}
        {onEdit && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => onEdit(event)}
            {...styleHelpers.actionIcon("var(--walletfy-gray-600)")}
            title="✏️ Editar evento"
          >
            <IconEdit size={16} />
          </ActionIcon>
        )}
        {onDelete && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => onDelete(event.id)}
            {...styleHelpers.actionIcon("var(--walletfy-expense)")}
            title="🗑️ Eliminar evento"
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </Group>
    </Group>
  );
};

export const EventDisplayActions = React.memo(EventDisplayActionsComponent);
