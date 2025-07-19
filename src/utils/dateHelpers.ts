import dayjs from "dayjs";
import "dayjs/locale/es";
import { pipe, Array as A, Record } from "effect";
import type { Event } from "@/types/Event";

dayjs.locale("es");

export const dateHelpers = {
  formatDate: (date: Date): string => dayjs(date).format("DD/MM/YYYY"),

  getMonthYear: (date: Date): string => dayjs(date).format("MMMM YYYY"),

  getMonthKey: (date: Date): string => dayjs(date).format("YYYY-MM"),

  groupEventsByMonth: (events: Event[]): Record<string, Event[]> =>
    pipe(
      events,
      A.groupBy((event) => dateHelpers.getMonthKey(event.fecha)),
      Record.map(A.sort((a, b) => dayjs(b.fecha).diff(dayjs(a.fecha)))),
    ),

  sortEventsByDate: (events: Event[]): Event[] =>
    pipe(
      events,
      A.sort((a, b) => dayjs(b.fecha).diff(dayjs(a.fecha))),
    ),

  getMonthName: (monthKey: string): string =>
    dayjs(monthKey, "YYYY-MM").format("MMMM YYYY"),

  isValidDate: (date: Date): boolean => dayjs(date).isValid(),

  getCurrentDate: (): Date => dayjs().toDate(),

  parseDate: (dateString: string): Date => dayjs(dateString).toDate(),
};
