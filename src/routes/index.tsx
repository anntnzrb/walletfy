import { Container, Group, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { EventForm } from "../components/EventForm";
import { EventList } from "../components/EventList";
import type { Event } from "../types/Event";

function BalancePage() {
	const [opened, { open, close }] = useDisclosure(false);
	const [editingEvent, setEditingEvent] = useState<Event | null>(null);

	const handleEditEvent = useCallback(
		(event: Event) => {
			setEditingEvent(event);
			open();
		},
		[open],
	);

	const handleCloseModal = useCallback(() => {
		setEditingEvent(null);
		close();
	}, [close]);

	return (
		<Container size="xl" py="md">
			<Title order={1} mb="lg" ta="center">
				Flujo Balance
			</Title>

			<EventList onEditEvent={handleEditEvent} />

			<Modal
				opened={opened}
				onClose={handleCloseModal}
				title={
					<Group gap="xs">
						{editingEvent ? <IconEdit size={18} /> : <IconPlus size={18} />}
						{editingEvent ? "Editar Evento" : "Crear Evento"}
					</Group>
				}
				centered
				size="md"
			>
				<EventForm
					event={editingEvent || undefined}
					onSubmit={handleCloseModal}
					onCancel={handleCloseModal}
				/>
			</Modal>
		</Container>
	);
}

export const Route = createFileRoute("/")({
	component: BalancePage,
});
