import { Container, Group, Modal, Title, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { EventForm } from "@/components/EventForm";
import { EventList } from "@/components/EventList";
import { InitialBalanceInput } from "@/components/InitialBalanceInput";
import { BalanceFlow } from "@/components/BalanceFlow";
import type { Event } from "@/types/Event";

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
    <Container size="xl" py="xl">
      <div
        style={{
          textAlign: "center",
          marginBottom: "var(--walletfy-space-2xl)",
        }}
      >
        <Title
          order={1}
          className="walletfy-financial-figure"
          style={{ marginBottom: "var(--walletfy-space-sm)" }}
        >
          ✨ Walletfy Dashboard
        </Title>
        <Text className="walletfy-helper-text" style={{ fontSize: "1rem" }}>
          Gestiona tus ingresos y egresos de manera inteligente
        </Text>
      </div>

      <Stack gap="xl">
        {/* Initial Balance Input */}
        <InitialBalanceInput />

        {/* Balance Flow */}
        <BalanceFlow onEditEvent={handleEditEvent} />

        {/* Events List */}
        <EventList onEditEvent={handleEditEvent} />
      </Stack>

      <Modal
        opened={opened}
        onClose={handleCloseModal}
        title={
          <Group gap="xs">
            {editingEvent ? <IconEdit size={18} /> : <IconPlus size={18} />}
            <Text
              className="walletfy-section-title"
              style={{ fontSize: "1.125rem" }}
            >
              {editingEvent ? "✏️ Editar Evento" : "➕ Crear Evento"}
            </Text>
          </Group>
        }
        centered
        size="md"
        radius="lg"
        overlayProps={{ blur: 4 }}
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
