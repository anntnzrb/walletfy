import React from "react";
import { useEventDisplayContext } from "./EventDisplay";
import type { EventDisplayBadgeProps } from "./types";
import { styleHelpers } from "@/utils/styleHelpers";
import { eventTypeHelpers } from "@/utils/eventTypeHelpers";
import { formatters } from "@/utils/formatters";

const EventDisplayBadgeComponent: React.FC<EventDisplayBadgeProps> = ({
  size = "sm",
}) => {
  const { event } = useEventDisplayContext();
  const badgeStyles = styleHelpers.badge(event.tipo, size);

  return (
    <div {...badgeStyles}>
      {eventTypeHelpers.getIcon(event.tipo)}
      {formatters.eventAmount(event)}
    </div>
  );
};

export const EventDisplayBadge = React.memo(EventDisplayBadgeComponent);
