import {
	ActionIcon,
	Badge,
	Card,
	Group,
	Image,
	Modal,
	Stack,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { pipe } from "effect";
import React, { useCallback, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useAppDispatch } from "../redux/hooks";
import { deleteEvent } from "../redux/slices/eventsSlice";
import type { Event } from "../types/Event";
import { dateHelpers } from "../utils/dateHelpers";
import { storageUtils } from "../utils/storage";

// Helper functions for better readability
const getEventColor = (tipo: Event["tipo"]) => (tipo === "ingreso" ? "green" : "red");
const getEventSign = (tipo: Event["tipo"]) => (tipo === "ingreso" ? "+" : "-");
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
const getTooltipContent = (descripcion?: string) => descripcion || "Sin descripción";

// Event actions component to reduce repetition
interface EventActionsProps {
	event: Event;
	onView: (event: Event) => void;
	onEdit: (event: Event) => void;
	onDelete: (eventId: string) => void;
}

const EventActions: React.FC<EventActionsProps> = ({ event, onView, onEdit, onDelete }) => (
	<Group gap="xs">
		<Text size="sm" c="gray.6">
			{dateHelpers.formatDate(event.fecha)}
		</Text>
		<ActionIcon size="sm" variant="subtle" color="blue" onClick={() => onView(event)}>
			<IconEye size={16} />
		</ActionIcon>
		<ActionIcon size="sm" variant="subtle" color="yellow" onClick={() => onEdit(event)}>
			<IconEdit size={16} />
		</ActionIcon>
		<ActionIcon size="sm" variant="subtle" color="red" onClick={() => onDelete(event.id)}>
			<IconTrash size={16} />
		</ActionIcon>
	</Group>
);

// Event badge component for amount display
interface EventBadgeProps {
	event: Event;
	variant?: "filled" | "light";
	size?: "sm" | "md" | "lg";
}

const EventBadge: React.FC<EventBadgeProps> = ({ event, variant = "filled", size = "sm" }) => (
	<Badge color={getEventColor(event.tipo)} variant={variant} size={size}>
		{getEventSign(event.tipo)}{formatCurrency(event.cantidad)}
	</Badge>
);

// Individual event card component
interface EventCardProps {
	event: Event;
	onView: (event: Event) => void;
	onEdit: (event: Event) => void;
	onDelete: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onView, onEdit, onDelete }) => (
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

interface MonthCardProps {
	monthKey: string;
	events: Event[];
	onEditEvent: (event: Event) => void;
}

const MonthCardComponent: React.FC<MonthCardProps> = ({
	monthKey,
	events,
	onEditEvent,
}) => {
	const dispatch = useAppDispatch();
	const [opened, { open, close }] = useDisclosure(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	const monthName = useMemo(
		() => dateHelpers.getMonthName(monthKey),
		[monthKey],
	);

	const { totalIngresos, totalEgresos } = useMemo(() => {
		const calculateTotal = (tipo: Event["tipo"]) =>
			pipe(
				events,
				(events) => events.filter((event) => event.tipo === tipo),
				(filteredEvents) => filteredEvents.reduce((sum, event) => sum + event.cantidad, 0)
			);

		return {
			totalIngresos: calculateTotal("ingreso"),
			totalEgresos: calculateTotal("egreso"),
		};
	}, [events]);

	const handleDeleteEvent = useCallback(
		(eventId: string) => {
			dispatch(deleteEvent(eventId));
			const updatedEvents = storageUtils
				.loadEvents()
				.filter((e) => e.id !== eventId);
			storageUtils.saveEvents(updatedEvents);
		},
		[dispatch],
	);

	const handleViewEvent = useCallback(
		(event: Event) => {
			setSelectedEvent(event);
			open();
		},
		[open],
	);

	return (
		<>
			<Card shadow="sm" padding="lg" radius="md" withBorder>
				<Stack gap="md">
					<Group justify="space-between" align="center">
						<Text size="xl" fw={700} c="gray.8">
							{monthName}
						</Text>
						<Group gap="sm">
							<Badge color="green" variant="light">
								Ingresos: {formatCurrency(totalIngresos)}
							</Badge>
							<Badge color="red" variant="light">
								Egresos: {formatCurrency(totalEgresos)}
							</Badge>
						</Group>
					</Group>

					<Stack gap="xs">
						{events.map((event) => (
							<EventCard
								key={event.id}
								event={event}
								onView={handleViewEvent}
								onEdit={onEditEvent}
								onDelete={handleDeleteEvent}
							/>
						))}
					</Stack>
				</Stack>
			</Card>

			<Modal
				opened={opened}
				onClose={close}
				title="Detalle del Evento"
				centered
			>
				{selectedEvent && (
					<Stack gap="md">
						<Group justify="space-between">
							<Text fw={500}>Nombre:</Text>
							<Text>{selectedEvent.nombre}</Text>
						</Group>
						<Group justify="space-between">
							<Text fw={500}>Cantidad:</Text>
							<EventBadge event={selectedEvent} />
						</Group>
						<Group justify="space-between">
							<Text fw={500}>Fecha:</Text>
							<Text>{dateHelpers.formatDate(selectedEvent.fecha)}</Text>
						</Group>
						<Group justify="space-between">
							<Text fw={500}>Tipo:</Text>
							<Text>{selectedEvent.tipo}</Text>
						</Group>
						{selectedEvent.descripcion && (
							<Stack gap="xs">
								<Text fw={500}>Descripción:</Text>
								<Text>{selectedEvent.descripcion}</Text>
							</Stack>
						)}
						{selectedEvent.adjunto && (
							<Stack gap="xs">
								<Text fw={500}>Adjunto:</Text>
								<Image
									src={selectedEvent.adjunto}
									alt="Adjunto"
									radius="md"
									maw={300}
									mx="auto"
								/>
							</Stack>
						)}
					</Stack>
				)}
			</Modal>
		</>
	);
};

export const MonthCard = React.memo(MonthCardComponent);
