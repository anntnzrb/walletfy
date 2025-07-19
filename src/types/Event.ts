export interface Event {
  id: string;
  nombre: string;
  descripcion?: string;
  cantidad: number;
  fecha: Date;
  tipo: "ingreso" | "egreso";
  adjunto?: string;
}

export type EventType = "ingreso" | "egreso";
