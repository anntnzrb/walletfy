import {
  Button,
  FileInput,
  Group,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import {
  IconCheck,
  IconPaperclip,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import React, { useCallback } from "react";

import { useAppDispatch } from "@/redux/hooks";
import { addEvent, updateEvent } from "@/redux/slices/eventsSlice";
import { type EventFormData, eventCreateSchema } from "@/schemas/eventSchema";
import type { Event } from "@/types/Event";
import { dateHelpers } from "@/utils/dateHelpers";
import { storageUtils } from "@/utils/storage";
import { formHelpers } from "@/utils/formHelpers";
import { eventTypeHelpers } from "@/utils/eventTypeHelpers";
import { styleHelpers } from "@/utils/styleHelpers";

interface EventFormProps {
  event?: Event;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const EventFormComponent: React.FC<EventFormProps> = ({
  event,
  onSubmit,
  onCancel,
}) => {
  const dispatch = useAppDispatch();
  const isEditing = !!event;

  const form = useForm<EventFormData>({
    initialValues: formHelpers.createInitialValues(event, {
      nombre: "",
      descripcion: "",
      cantidad: 0,
      fecha: dateHelpers.getCurrentDate(),
      tipo: "ingreso" as const,
      adjunto: "",
    }),
    validate: zodResolver(eventCreateSchema),
  });

  const handleSubmit = useCallback(
    formHelpers.createSubmitHandler((values: EventFormData) => {
      formHelpers.handleFormMode(
        isEditing,
        event,
        (event) => {
          const updatedEvent: Event = { ...event, ...values };
          dispatch(updateEvent(updatedEvent));
        },
        () => dispatch(addEvent(values)),
      );

      const events = storageUtils.loadEvents();
      const updatedEvents = formHelpers.handleFormMode(
        isEditing,
        event,
        (event) =>
          events.map((e) => (e.id === event.id ? { ...event, ...values } : e)),
        () => [...events, { ...values, id: crypto.randomUUID() }],
      );

      storageUtils.saveEvents(updatedEvents);
      form.reset();
      onSubmit?.();
    }),
    [isEditing, event, dispatch, form, onSubmit],
  );

  const handleFileUpload = useCallback(
    (file: File | null) => {
      formHelpers.handleFileUpload(
        file,
        (base64) => form.setFieldValue("adjunto", base64),
        (error) => console.error("Failed to read file:", error),
      );
    },
    [form],
  );

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput
          label="Nombre"
          placeholder="Ingresa el nombre del evento"
          required
          {...form.getInputProps("nombre")}
        />

        <Textarea
          label="Descripción"
          placeholder="Descripción opcional del evento"
          rows={3}
          {...form.getInputProps("descripcion")}
        />

        <NumberInput
          label="Cantidad"
          placeholder="0.00"
          required
          min={0}
          step={0.01}
          decimalScale={2}
          {...form.getInputProps("cantidad")}
        />

        <DatePickerInput
          label="Fecha"
          placeholder="Selecciona una fecha"
          required
          valueFormat="DD/MM/YYYY"
          value={form.values.fecha}
          onChange={formHelpers.createDateChangeHandler(form, "fecha")}
          error={form.errors.fecha}
        />

        <div>
          <Text
            {...styleHelpers.helperText("md")}
            style={{ marginBottom: "var(--walletfy-space-sm)" }}
          >
            Tipo de Evento *
          </Text>
          <Group gap="sm">
            <Button
              {...formHelpers.createEventTypeButtonProps(
                form.values.tipo,
                "ingreso",
                (tipo) => form.setFieldValue("tipo", tipo),
              )}
            >
              {eventTypeHelpers.getIcon("ingreso")} Ingreso
            </Button>
            <Button
              {...formHelpers.createEventTypeButtonProps(
                form.values.tipo,
                "egreso",
                (tipo) => form.setFieldValue("tipo", tipo),
              )}
            >
              {eventTypeHelpers.getIcon("egreso")} Egreso
            </Button>
          </Group>
        </div>

        <FileInput
          label="Adjunto (opcional)"
          placeholder="Selecciona una imagen"
          accept="image/*"
          leftSection={<IconPaperclip size={16} />}
          onChange={handleFileUpload}
        />

        <Group justify="flex-end" mt="lg" gap="md">
          {onCancel && (
            <Button {...formHelpers.createCancelButtonProps(onCancel)}>
              <IconX size={18} />
              Cancelar
            </Button>
          )}
          <Button {...formHelpers.createFormButtonProps(isEditing)}>
            {isEditing ? <IconRefresh size={18} /> : <IconCheck size={18} />}
            {isEditing ? "✏️ Actualizar" : "✨ Crear Evento"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export const EventForm = React.memo(EventFormComponent);
