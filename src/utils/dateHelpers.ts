import dayjs from "dayjs";
import "dayjs/locale/es";
import type { Event } from "../types/Event";

// Configure dayjs to use Spanish locale
dayjs.locale("es");

export const dateHelpers = {
	// Format date for display (DD/MM/YYYY)
	formatDate: (date: Date): string => {
		return dayjs(date).format("DD/MM/YYYY");
	},

	// Get month and year for grouping
	getMonthYear: (date: Date): string => {
		return dayjs(date).format("MMMM YYYY");
	},

	// Get month key for grouping (YYYY-MM)
	getMonthKey: (date: Date): string => {
		return dayjs(date).format("YYYY-MM");
	},

	// Group events by month
	groupEventsByMonth: (events: Event[]): Record<string, Event[]> => {
		return events.reduce(
			(groups, event) => {
				const monthKey = dateHelpers.getMonthKey(event.fecha);
				if (!groups[monthKey]) {
					groups[monthKey] = [];
				}
				groups[monthKey].push(event);
				return groups;
			},
			{} as Record<string, Event[]>,
		);
	},

	// Sort events by date (newest first)
	sortEventsByDate: (events: Event[]): Event[] => {
		return [...events].sort((a, b) => dayjs(b.fecha).diff(dayjs(a.fecha)));
	},

	// Get formatted month name for display
	getMonthName: (monthKey: string): string => {
		return dayjs(monthKey, "YYYY-MM").format("MMMM YYYY");
	},

	// Check if date is valid
	isValidDate: (date: Date): boolean => {
		return dayjs(date).isValid();
	},

	// Get current date
	getCurrentDate: (): Date => {
		return dayjs().toDate();
	},

	// Parse date string to Date object
	parseDate: (dateString: string): Date => {
		return dayjs(dateString).toDate();
	},
};
