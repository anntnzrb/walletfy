import { Group, Stack } from "@mantine/core";
import React from "react";
import { useEventDisplayContext } from "./EventDisplay";
import { EventDisplayActions } from "./EventDisplayActions";
import { EventDisplayBadge } from "./EventDisplayBadge";
import { EventDisplayTitle } from "./EventDisplayTitle";
import { styleHelpers } from "@/utils/styleHelpers";

const EventDisplayCardComponent: React.FC = () => {
  const { event } = useEventDisplayContext();
  const cardStyles = styleHelpers.card({ compact: true, hover: true });

  return (
    <div
      key={event.id}
      {...cardStyles}
      style={{ ...cardStyles.style, height: "100%" }}
    >
      <Stack gap="sm" style={{ height: "100%" }}>
        <Group
          justify="center"
          style={{ minHeight: "60px", alignItems: "center" }}
        >
          <EventDisplayBadge size="lg" />
        </Group>

        <Stack gap="xs" style={{ flex: 1 }}>
          <EventDisplayTitle />
        </Stack>

        <EventDisplayActions />
      </Stack>
    </div>
  );
};

export const EventDisplayCard = React.memo(EventDisplayCardComponent);
