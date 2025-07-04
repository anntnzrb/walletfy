import type { Event } from "../../../types/Event";

export const getEventColor = (tipo: Event["tipo"]) =>
	tipo === "ingreso" ? "green" : "red";

export const getEventSign = (tipo: Event["tipo"]) =>
	tipo === "ingreso" ? "+" : "-";

export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export const getTooltipContent = (descripcion?: string) =>
	descripcion || "Sin descripción";
