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
import React, { useCallback, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useAppDispatch } from "../redux/hooks";
import { deleteEvent } from "../redux/slices/eventsSlice";
import type { Event } from "../types/Event";
import { dateHelpers } from "../utils/dateHelpers";
import { storageUtils } from "../utils/storage";

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
		const ingresos = events
			.filter((event) => event.tipo === "ingreso")
			.reduce((sum, event) => sum + event.cantidad, 0);
		const egresos = events
			.filter((event) => event.tipo === "egreso")
			.reduce((sum, event) => sum + event.cantidad, 0);
		return { totalIngresos: ingresos, totalEgresos: egresos };
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
								Ingresos: ${totalIngresos.toFixed(2)}
							</Badge>
							<Badge color="red" variant="light">
								Egresos: ${totalEgresos.toFixed(2)}
							</Badge>
						</Group>
					</Group>

					<Stack gap="xs">
						{events.map((event) => (
							<Card key={event.id} padding="sm" radius="sm" withBorder>
								<Group justify="space-between" align="center">
									<Group gap="sm" align="center">
										<Text
											fw={500}
											data-tooltip-id={`tooltip-${event.id}`}
											data-tooltip-content={
												event.descripcion || "Sin descripción"
											}
											style={{ cursor: "pointer" }}
										>
											{event.nombre}
										</Text>
										<Tooltip id={`tooltip-${event.id}`} />
										<Badge
											color={event.tipo === "ingreso" ? "green" : "red"}
											variant="filled"
											size="sm"
										>
											{event.tipo === "ingreso" ? "+" : "-"}$
											{event.cantidad.toFixed(2)}
										</Badge>
									</Group>

									<Group gap="xs">
										<Text size="sm" c="gray.6">
											{dateHelpers.formatDate(event.fecha)}
										</Text>
										<ActionIcon
											size="sm"
											variant="subtle"
											color="blue"
											onClick={() => handleViewEvent(event)}
										>
											<IconEye size={16} />
										</ActionIcon>
										<ActionIcon
											size="sm"
											variant="subtle"
											color="yellow"
											onClick={() => onEditEvent(event)}
										>
											<IconEdit size={16} />
										</ActionIcon>
										<ActionIcon
											size="sm"
											variant="subtle"
											color="red"
											onClick={() => handleDeleteEvent(event.id)}
										>
											<IconTrash size={16} />
										</ActionIcon>
									</Group>
								</Group>
							</Card>
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
							<Badge
								color={selectedEvent.tipo === "ingreso" ? "green" : "red"}
								variant="filled"
							>
								{selectedEvent.tipo === "ingreso" ? "+" : "-"}$
								{selectedEvent.cantidad.toFixed(2)}
							</Badge>
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
