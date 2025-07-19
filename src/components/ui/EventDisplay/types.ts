import type { Event } from "@/types/Event";

export interface EventDisplayContextValue {
  event: Event;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export interface EventDisplayProps {
  event: Event;
  onView?: (event: Event) => void;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  children: React.ReactNode;
}

export interface EventDisplayBadgeProps {
  variant?: "filled" | "light";
  size?: "sm" | "md" | "lg";
}

export interface EventDisplayCardProps {
  padding?: string;
  radius?: string;
  withBorder?: boolean;
}
