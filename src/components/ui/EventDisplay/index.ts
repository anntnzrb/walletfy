import { EventDisplay as EventDisplayRoot } from "./EventDisplay";
import { EventDisplayActions } from "./EventDisplayActions";
import { EventDisplayBadge } from "./EventDisplayBadge";
import { EventDisplayCard } from "./EventDisplayCard";
import { EventDisplayTitle } from "./EventDisplayTitle";

export const EventDisplay = {
  ...EventDisplayRoot,
  Actions: EventDisplayActions,
  Badge: EventDisplayBadge,
  Card: EventDisplayCard,
  Title: EventDisplayTitle,
};

export type {
  EventDisplayProps,
  EventDisplayBadgeProps,
  EventDisplayCardProps,
  EventDisplayContextValue,
} from "./types";

export {
  formatCurrency,
  getEventColor,
  getEventSign,
  getTooltipContent,
} from "./utils";
