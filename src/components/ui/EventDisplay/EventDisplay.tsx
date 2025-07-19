import React, { createContext, useContext } from "react";
import type { EventDisplayContextValue, EventDisplayProps } from "./types";

const EventDisplayContext = createContext<EventDisplayContextValue | null>(
  null,
);

export const useEventDisplayContext = () => {
  const context = useContext(EventDisplayContext);
  if (!context) {
    throw new Error(
      "EventDisplay compound components must be used within EventDisplay.Root",
    );
  }
  return context;
};

const EventDisplayRoot: React.FC<EventDisplayProps> = ({
  event,
  onView,
  onEdit,
  onDelete,
  children,
}) => {
  const contextValue: EventDisplayContextValue = {
    event,
    onView,
    onEdit,
    onDelete,
  };

  return (
    <EventDisplayContext.Provider value={contextValue}>
      {children}
    </EventDisplayContext.Provider>
  );
};

export const EventDisplay = {
  Root: React.memo(EventDisplayRoot),
};
