import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  nombre: z
    .string()
    .min(1, "Nombre es requerido")
    .max(20, "Nombre debe tener máximo 20 caracteres"),
  descripcion: z
    .string()
    .max(100, "Descripción debe tener máximo 100 caracteres")
    .optional(),
  cantidad: z.number().positive("Cantidad debe ser un número positivo"),
  fecha: z.date({
    required_error: "Fecha es requerida",
    invalid_type_error: "Fecha debe ser válida",
  }),
  tipo: z.enum(["ingreso", "egreso"], {
    required_error: "Tipo es requerido",
    invalid_type_error: 'Tipo debe ser "ingreso" o "egreso"',
  }),
  adjunto: z.string().optional(),
});

export const eventCreateSchema = eventSchema.omit({ id: true });

export type EventFormData = z.infer<typeof eventCreateSchema>;
export type EventData = z.infer<typeof eventSchema>;
