import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import type { Event as WalletfyEvent } from "@/types/Event";

dayjs.extend(isBetween);

// Search criteria interface for event deletion
export interface SearchCriteria {
  keywords?: string[];
  dateRange?: { start: Date; end: Date };
  amount?: { value: number; tolerance?: number };
  tipo?: "ingreso" | "egreso";
}

// Event search result with relevance scoring
export interface EventSearchResult {
  event: WalletfyEvent;
  score: number;
  matchReasons: string[];
}

export const parseDeleteQuery = (query: string): SearchCriteria => {
  const lowercaseQuery = query.toLowerCase();
  const criteria: SearchCriteria = {};

  const stopWords = [
    "eliminar",
    "borrar",
    "delete",
    "remove",
    "quitar",
    "el",
    "la",
    "los",
    "las",
    "de",
    "del",
    "en",
    "que",
    "por",
  ];
  const words = lowercaseQuery
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  if (words.length > 0) {
    criteria.keywords = words;
  }

  // Detect event type
  if (
    lowercaseQuery.includes("gasto") ||
    lowercaseQuery.includes("egreso") ||
    lowercaseQuery.includes("expense")
  ) {
    criteria.tipo = "egreso";
  } else if (
    lowercaseQuery.includes("ingreso") ||
    lowercaseQuery.includes("income") ||
    lowercaseQuery.includes("salario")
  ) {
    criteria.tipo = "ingreso";
  }

  const amountMatch = lowercaseQuery.match(/(\$?\d+(?:[.,]\d{2})?)/);
  if (amountMatch) {
    const amount = parseFloat(
      amountMatch[1].replace("$", "").replace(",", "."),
    );
    if (!isNaN(amount)) {
      criteria.amount = { value: amount, tolerance: 0.01 };
    }
  }

  const dateRange = parseDateRange(lowercaseQuery);
  if (dateRange) {
    criteria.dateRange = dateRange;
  }

  return criteria;
};

const parseDateRange = (query: string): { start: Date; end: Date } | null => {
  const now = dayjs();

  const monthYearMatch = query.match(
    /(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})/i,
  );
  if (monthYearMatch) {
    const monthMap: Record<string, number> = {
      enero: 0,
      january: 0,
      febrero: 1,
      february: 1,
      marzo: 2,
      march: 2,
      abril: 3,
      april: 3,
      mayo: 4,
      may: 4,
      junio: 5,
      june: 5,
      julio: 6,
      july: 6,
      agosto: 7,
      august: 7,
      septiembre: 8,
      september: 8,
      octubre: 9,
      october: 9,
      noviembre: 10,
      november: 10,
      diciembre: 11,
      december: 11,
    };

    const month = monthMap[monthYearMatch[1].toLowerCase()];
    const year = parseInt(monthYearMatch[2]);

    if (month !== undefined) {
      const start = dayjs().year(year).month(month).startOf("month");
      const end = start.endOf("month");
      return { start: start.toDate(), end: end.toDate() };
    }
  }

  if (query.includes("este mes") || query.includes("this month")) {
    const start = now.startOf("month");
    const end = now.endOf("month");
    return { start: start.toDate(), end: end.toDate() };
  }

  if (query.includes("mes pasado") || query.includes("last month")) {
    const start = now.subtract(1, "month").startOf("month");
    const end = start.endOf("month");
    return { start: start.toDate(), end: end.toDate() };
  }

  if (query.includes("esta semana") || query.includes("this week")) {
    const start = now.startOf("week");
    const end = now.endOf("week");
    return { start: start.toDate(), end: end.toDate() };
  }

  return null;
};

export const searchEvents = (
  events: WalletfyEvent[],
  criteria: SearchCriteria,
): EventSearchResult[] => {
  const results: EventSearchResult[] = [];

  for (const event of events) {
    let score = 0;
    const matchReasons: string[] = [];

    if (criteria.keywords && criteria.keywords.length > 0) {
      const eventText =
        `${event.nombre} ${event.descripcion || ""}`.toLowerCase();
      const keywordMatches = criteria.keywords.filter((keyword) =>
        eventText.includes(keyword.toLowerCase()),
      );

      if (keywordMatches.length > 0) {
        score += (keywordMatches.length / criteria.keywords.length) * 40;
        matchReasons.push(`Coincide con: ${keywordMatches.join(", ")}`);
      }
    }

    if (criteria.tipo && event.tipo === criteria.tipo) {
      score += 20;
      matchReasons.push(`Tipo: ${event.tipo}`);
    }

    if (criteria.amount) {
      const diff = Math.abs(event.cantidad - criteria.amount.value);
      const tolerance = criteria.amount.tolerance || 0.01;

      if (diff <= tolerance) {
        score += 30;
        matchReasons.push(`Cantidad exacta: $${event.cantidad}`);
      } else if (diff <= criteria.amount.value * 0.1) {
        score += 20;
        matchReasons.push(`Cantidad similar: $${event.cantidad}`);
      }
    }

    if (criteria.dateRange) {
      const eventDate = dayjs(event.fecha);
      const startDate = dayjs(criteria.dateRange.start);
      const endDate = dayjs(criteria.dateRange.end);

      if (eventDate.isBetween(startDate, endDate, "day", "[]")) {
        score += 25;
        matchReasons.push(`Fecha en rango: ${eventDate.format("DD/MM/YYYY")}`);
      }
    }

    if (score > 0) {
      results.push({ event, score, matchReasons });
    }
  }

  return results.sort((a, b) => b.score - a.score);
};

// Format event for display in chat
export const formatEventForDisplay = (event: WalletfyEvent): string => {
  const date = dayjs(event.fecha).format("DD/MM/YYYY");
  const amount =
    event.tipo === "ingreso" ? `+$${event.cantidad}` : `-$${event.cantidad}`;
  return `${event.nombre} - ${amount} - ${date}`;
};

export const parseSearchEventsCommand = (
  content: string,
): SearchCriteria | null => {
  const searchRegex = /\[SEARCH_EVENTS:\s*([^\]]+)\]/;
  const match = content.match(searchRegex);

  if (!match) return null;

  const paramString = match[1];
  const params: Record<string, string> = {};

  const paramRegex = /(\w+)=(?:"([^"]*)"|([^\s,]+))/g;
  let paramMatch;

  while ((paramMatch = paramRegex.exec(paramString)) !== null) {
    const [, key, quotedValue, unquotedValue] = paramMatch;
    params[key] = quotedValue || unquotedValue;
  }

  const criteria: SearchCriteria = {};

  if (params.keywords) {
    criteria.keywords = params.keywords.split(/\s+/);
  }

  if (params.tipo && (params.tipo === "ingreso" || params.tipo === "egreso")) {
    criteria.tipo = params.tipo;
  }

  if (params.amount) {
    const amount = parseFloat(params.amount);
    if (!isNaN(amount)) {
      criteria.amount = { value: amount, tolerance: 0.01 };
    }
  }

  if (params.month && params.year) {
    const month = parseInt(params.month) - 1;
    const year = parseInt(params.year);

    if (!isNaN(month) && !isNaN(year) && month >= 0 && month <= 11) {
      const start = dayjs().year(year).month(month).startOf("month");
      const end = start.endOf("month");
      criteria.dateRange = { start: start.toDate(), end: end.toDate() };
    }
  }

  return criteria;
};

export const parseConfirmDeleteCommand = (
  content: string,
): { id: string; name: string; amount: number; date: string } | null => {
  const confirmRegex = /\[CONFIRM_DELETE:\s*([^\]]+)\]/;
  const match = content.match(confirmRegex);

  if (!match) return null;

  const paramString = match[1];
  const params: Record<string, string> = {};

  const paramRegex = /(\w+)=(?:"([^"]*)"|([^\s,]+))/g;
  let paramMatch;

  while ((paramMatch = paramRegex.exec(paramString)) !== null) {
    const [, key, quotedValue, unquotedValue] = paramMatch;
    params[key] = quotedValue || unquotedValue;
  }

  if (!params.id || !params.name || !params.amount || !params.date) {
    return null;
  }

  const amount = parseFloat(params.amount);
  if (isNaN(amount)) {
    return null;
  }

  return {
    id: params.id,
    name: params.name,
    amount,
    date: params.date,
  };
};

export const parseDeleteEventCommand = (content: string): string | null => {
  const deleteRegex = /\[DELETE_EVENT:\s*id="([^"]+)"\]/;
  const match = content.match(deleteRegex);
  return match ? match[1] : null;
};

export const parseConversationalDate = (dateInput: string): Date | null => {
  const input = dateInput.toLowerCase().trim();

  if (input === "hoy" || input === "today") {
    return dayjs().toDate();
  }

  if (input === "ayer" || input === "yesterday") {
    return dayjs().subtract(1, "day").toDate();
  }

  if (input === "mañana" || input === "tomorrow") {
    return dayjs().add(1, "day").toDate();
  }

  const formats = [
    "DD/MM/YYYY",
    "DD-MM-YYYY",
    "DD.MM.YYYY",
    "YYYY-MM-DD",
    "MM/DD/YYYY",
    "DD/MM/YY",
    "DD-MM-YY",
    "DD MMM YYYY",
    "DD MMMM YYYY",
  ];

  for (const format of formats) {
    const parsed = dayjs(input, format, "es", true);
    if (parsed.isValid()) {
      return parsed.toDate();
    }
  }

  const standardParsed = dayjs(input);
  if (standardParsed.isValid()) {
    return standardParsed.toDate();
  }

  return null;
};

export const parseCreateEventCommand = (
  content: string,
): WalletfyEvent | null => {
  const createEventRegex = /\[CREATE_EVENT:\s*([^\]]+)\]/;
  const match = content.match(createEventRegex);

  if (!match) return null;

  const paramString = match[1];
  const params: Record<string, string> = {};

  const paramRegex = /(\w+)=(?:"([^"]*)"|([^\s,]+))/g;
  let paramMatch;

  while ((paramMatch = paramRegex.exec(paramString)) !== null) {
    const [, key, quotedValue, unquotedValue] = paramMatch;
    params[key] = quotedValue || unquotedValue;
  }

  if (!params.nombre || !params.cantidad || !params.tipo) {
    return null;
  }

  const cantidad = parseFloat(params.cantidad);
  if (isNaN(cantidad) || cantidad <= 0) {
    return null;
  }

  let fecha: Date;
  if (params.fecha) {
    const parsedDate = parseConversationalDate(params.fecha);
    if (!parsedDate) {
      return null;
    }
    fecha = parsedDate;
  } else {
    fecha = new Date();
  }

  if (params.tipo !== "ingreso" && params.tipo !== "egreso") {
    return null;
  }

  const eventData: Omit<WalletfyEvent, "id"> = {
    nombre: params.nombre.substring(0, 20),
    descripcion: params.descripcion || "",
    cantidad,
    fecha,
    tipo: params.tipo as "ingreso" | "egreso",
    adjunto: params.adjunto || "",
  };

  return {
    ...eventData,
    id: crypto.randomUUID(),
  };
};
