import dayjs from "dayjs";
import "dayjs/locale/es";
import type { Event } from "../types/Event";

dayjs.locale("es");

export const dateHelpers = {
	formatDate: (date: Date): string => {
		return dayjs(date).format("DD/MM/YYYY");
	},

	getMonthYear: (date: Date): string => {
		return dayjs(date).format("MMMM YYYY");
	},

	getMonthKey: (date: Date): string => {
		return dayjs(date).format("YYYY-MM");
	},

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

	sortEventsByDate: (events: Event[]): Event[] => {
		return [...events].sort((a, b) => dayjs(b.fecha).diff(dayjs(a.fecha)));
	},

	getMonthName: (monthKey: string): string => {
		return dayjs(monthKey, "YYYY-MM").format("MMMM YYYY");
	},

	isValidDate: (date: Date): boolean => {
		return dayjs(date).isValid();
	},

	getCurrentDate: (): Date => {
		return dayjs().toDate();
	},

	parseDate: (dateString: string): Date => {
		return dayjs(dateString).toDate();
	},
};
