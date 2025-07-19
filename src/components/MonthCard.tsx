import { Group, Image, Modal, Stack, Text } from "@mantine/core";
import { pipe } from "effect";
import React, { useCallback, useMemo } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { deleteEvent } from "@/redux/slices/eventsSlice";
import type { Event } from "@/types/Event";
import { dateHelpers } from "@/utils/dateHelpers";
import { storageUtils } from "@/utils/storage";
import { EventDisplay } from "@/components/ui/EventDisplay";
import { componentHelpers } from "@/utils/componentHelpers";
import { styleHelpers } from "@/utils/styleHelpers";
import { formatters } from "@/utils/formatters";
import { eventTypeHelpers } from "@/utils/eventTypeHelpers";

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
  const {
    opened,
    selectedItem: selectedEvent,
    open,
    close,
  } = componentHelpers.createModalHandler<Event>();

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
      open(event);
    },
    [open],
  );

  return (
    <>
      <div {...styleHelpers.card()}>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text {...styleHelpers.sectionTitle("lg")}>📅 {monthName}</Text>
            <Group gap="sm">
              <div {...styleHelpers.badge("ingreso", "sm")}>
                {eventTypeHelpers.getIcon("ingreso")} Ingresos:{" "}
                {formatters.currency(totalIngresos)}
              </div>
              <div {...styleHelpers.badge("egreso", "sm")}>
                {eventTypeHelpers.getIcon("egreso")} Egresos:{" "}
                {formatters.currency(totalEgresos)}
              </div>
            </Group>
          </Group>

          <div {...styleHelpers.grid({ responsive: true })}>
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
          </div>
        </Stack>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Detalle del Evento"
        {...styleHelpers.modal()}
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
