import { Container, Paper, Title } from "@mantine/core";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { EventForm } from "@/components/EventForm";

function NewEventPage() {
  const navigate = useNavigate();

  const handleSubmit = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  const handleCancel = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  return (
    <Container size="md" py="md">
      <Title order={1} mb="lg" ta="center">
        Crear Nuevo Evento
      </Title>

      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </Paper>
    </Container>
  );
}

export const Route = createFileRoute("/events/new")({
  component: NewEventPage,
});
