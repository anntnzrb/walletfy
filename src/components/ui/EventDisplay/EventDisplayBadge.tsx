import { Badge } from "@mantine/core";
import React from "react";
import { useEventDisplayContext } from "./EventDisplay";
import type { EventDisplayBadgeProps } from "./types";
import { formatCurrency, getEventColor, getEventSign } from "./utils";

const EventDisplayBadgeComponent: React.FC<EventDisplayBadgeProps> = ({
	variant = "filled",
	size = "sm",
}) => {
	const { event } = useEventDisplayContext();

	return (
		<Badge color={getEventColor(event.tipo)} variant={variant} size={size}>
			{getEventSign(event.tipo)}
			{formatCurrency(event.cantidad)}
		</Badge>
	);
};

export const EventDisplayBadge = React.memo(EventDisplayBadgeComponent);
