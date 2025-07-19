import { Stack, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React, { useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import type { Event } from "@/types/Event";
import { dateHelpers } from "@/utils/dateHelpers";
import { MonthCard } from "@/components/MonthCard";

interface EventListProps {
  onEditEvent: (event: Event) => void;
}

const EventListComponent: React.FC<EventListProps> = ({ onEditEvent }) => {
  const events = useAppSelector((state) => state.events.events);
  const [searchTerm, setSearchTerm] = useState("");

  const groupedEvents = useMemo(() => {
    const filteredEvents = events.filter(
      (event) =>
        event.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dateHelpers
          .getMonthYear(event.fecha)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

    const sortedEvents = dateHelpers.sortEventsByDate(filteredEvents);

    const grouped = dateHelpers.groupEventsByMonth(sortedEvents);

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
      <div className="walletfy-empty-state">
        <div className="walletfy-empty-state-icon">📊</div>
        <div className="walletfy-empty-state-title">
          ¡Comienza tu viaje financiero!
        </div>
        <div className="walletfy-empty-state-description">
          No hay eventos registrados aún. Crea tu primer evento de ingreso o
          egreso para comenzar a visualizar tu balance financiero.
        </div>
      </div>
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
        <div className="walletfy-empty-state">
          <div className="walletfy-empty-state-icon">🔍</div>
          <div className="walletfy-empty-state-title">
            No se encontraron resultados
          </div>
          <div className="walletfy-empty-state-description">
            No hay eventos que coincidan con tu búsqueda. Intenta con otros
            términos o revisa la ortografía.
          </div>
        </div>
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
