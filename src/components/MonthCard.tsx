import {
	Badge,
	Card,
	Group,
	Image,
	Modal,
	SimpleGrid,
	Stack,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { pipe } from "effect";
import React, { useCallback, useMemo, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { deleteEvent } from "@/redux/slices/eventsSlice";
import type { Event } from "@/types/Event";
import { dateHelpers } from "@/utils/dateHelpers";
import { storageUtils } from "@/utils/storage";
import { EventDisplay, formatCurrency } from "@/components/ui/EventDisplay";

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
				(filteredEvents) =>
					filteredEvents.reduce((sum, event) => sum + event.cantidad, 0),
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

					<SimpleGrid
						cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
						spacing="md"
						verticalSpacing="md"
					>
						{events.map((event) => (
							<EventDisplay.Root
								key={event.id}
								event={event}
								onView={handleViewEvent}
								onEdit={onEditEvent}
								onDelete={handleDeleteEvent}
							>
								<EventDisplay.Card />
							</EventDisplay.Root>
						))}
					</SimpleGrid>
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
							<EventDisplay.Root event={selectedEvent}>
								<EventDisplay.Badge />
							</EventDisplay.Root>
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
