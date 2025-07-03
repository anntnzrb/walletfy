import { Center, Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import type { Event } from "../types/Event";
import { dateHelpers } from "../utils/dateHelpers";
import { MonthCard } from "./MonthCard";

interface EventListProps {
	onEditEvent: (event: Event) => void;
}

const EventListComponent: React.FC<EventListProps> = ({ onEditEvent }) => {
	const events = useAppSelector((state) => state.events.events);
	const [searchTerm, setSearchTerm] = useState("");

	const groupedEvents = useMemo(() => {
		// Filter events by search term
		const filteredEvents = events.filter(
			(event) =>
				event.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
				event.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				dateHelpers
					.getMonthYear(event.fecha)
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
		);

		// Sort events by date (newest first)
		const sortedEvents = dateHelpers.sortEventsByDate(filteredEvents);

		// Group by month
		const grouped = dateHelpers.groupEventsByMonth(sortedEvents);

		// Sort months by year-month (newest first)
		const sortedMonthKeys = Object.keys(grouped).sort((a, b) =>
			b.localeCompare(a),
		);

		return sortedMonthKeys.map((monthKey) => ({
			monthKey,
			events: grouped[monthKey],
		}));
	}, [events, searchTerm]);

	if (events.length === 0) {
		return (
			<Center>
				<Text size="lg" c="gray.6">
					No hay eventos registrados. Crea el primer evento.
				</Text>
			</Center>
		);
	}

	return (
		<Stack gap="lg">
			<TextInput
				placeholder="Buscar por mes y año (ej: Diciembre 2024)"
				leftSection={<IconSearch size={16} />}
				value={searchTerm}
				onChange={(event) => setSearchTerm(event.currentTarget.value)}
			/>

			{groupedEvents.length === 0 ? (
				<Center>
					<Text size="lg" c="gray.6">
						No se encontraron eventos que coincidan con la búsqueda.
					</Text>
				</Center>
			) : (
				groupedEvents.map(({ monthKey, events: monthEvents }) => (
					<MonthCard
						key={monthKey}
						monthKey={monthKey}
						events={monthEvents}
						onEditEvent={onEditEvent}
					/>
				))
			)}
		</Stack>
	);
};

export const EventList = React.memo(EventListComponent);
