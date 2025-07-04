import { Badge } from "@mantine/core";
import React from "react";
import type { Event } from "../types/Event";

const getEventColor = (tipo: Event["tipo"]) =>
	tipo === "ingreso" ? "green" : "red";
const getEventSign = (tipo: Event["tipo"]) => (tipo === "ingreso" ? "+" : "-");
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

interface EventBadgeProps {
	event: Event;
	variant?: "filled" | "light";
	size?: "sm" | "md" | "lg";
}

const EventBadgeComponent: React.FC<EventBadgeProps> = ({
	event,
	variant = "filled",
	size = "sm",
}) => (
	<Badge color={getEventColor(event.tipo)} variant={variant} size={size}>
		{getEventSign(event.tipo)}
		{formatCurrency(event.cantidad)}
	</Badge>
);

export const EventBadge = React.memo(EventBadgeComponent);
