import { Text } from "@mantine/core";
import React from "react";
import { Tooltip } from "react-tooltip";
import { useEventDisplayContext } from "./EventDisplay";
import { formatters } from "@/utils/formatters";

const EventDisplayTitleComponent: React.FC = () => {
  const { event } = useEventDisplayContext();

  return (
    <>
      <Text
        fw={500}
        data-tooltip-id={`tooltip-${event.id}`}
        data-tooltip-content={formatters.tooltipContent(event.descripcion)}
        style={{ cursor: "pointer" }}
      >
        {event.nombre}
      </Text>
      <Tooltip id={`tooltip-${event.id}`} />
    </>
  );
};

export const EventDisplayTitle = React.memo(EventDisplayTitleComponent);
