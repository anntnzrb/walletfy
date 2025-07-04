import type { Event } from "@/types/Event";

export const mockEvents: Event[] = [
	{
		id: "1",
		nombre: "Salario",
		descripcion: "Pago mensual de salario",
		cantidad: 3500,
		fecha: new Date("2024-12-01"),
		tipo: "ingreso",
	},
	{
		id: "2",
		nombre: "Alquiler",
		descripcion: "Pago mensual del apartamento",
		cantidad: 1200,
		fecha: new Date("2024-12-01"),
		tipo: "egreso",
	},
	{
		id: "3",
		nombre: "Freelance",
		descripcion: "Proyecto de desarrollo web",
		cantidad: 800,
		fecha: new Date("2024-12-03"),
		tipo: "ingreso",
	},
	{
		id: "4",
		nombre: "Supermercado",
		descripcion: "Compras semanales",
		cantidad: 150,
		fecha: new Date("2024-12-05"),
		tipo: "egreso",
	},
	{
		id: "5",
		nombre: "Gasolina",
		descripcion: "Tanque lleno",
		cantidad: 60,
		fecha: new Date("2024-12-06"),
		tipo: "egreso",
	},
];
