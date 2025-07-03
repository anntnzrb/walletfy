import {
	Button,
	FileInput,
	Group,
	NumberInput,
	Select,
	Stack,
	TextInput,
	Textarea,
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
import { useAppDispatch } from "../redux/hooks";
import { addEvent, updateEvent } from "../redux/slices/eventsSlice";
import { type EventFormData, eventCreateSchema } from "../schemas/eventSchema";
import type { Event } from "../types/Event";
import { dateHelpers } from "../utils/dateHelpers";
import { storageUtils } from "../utils/storage";

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
		initialValues: {
			nombre: event?.nombre || "",
			descripcion: event?.descripcion || "",
			cantidad: event?.cantidad || 0,
			fecha: event?.fecha || dateHelpers.getCurrentDate(),
			tipo: event?.tipo || "ingreso",
			adjunto: event?.adjunto || "",
		},
		validate: zodResolver(eventCreateSchema),
	});

	const handleSubmit = useCallback(
		(values: EventFormData) => {
			if (isEditing && event) {
				const updatedEvent: Event = {
					...event,
					...values,
				};
				dispatch(updateEvent(updatedEvent));
			} else {
				dispatch(addEvent(values));
			}

			// Save to localStorage
			const events = storageUtils.loadEvents();
			const updatedEvents =
				isEditing && event
					? events.map((e) => (e.id === event.id ? { ...event, ...values } : e))
					: [...events, { ...values, id: crypto.randomUUID() }];

			storageUtils.saveEvents(updatedEvents);

			form.reset();
			onSubmit?.();
		},
		[isEditing, event, dispatch, form, onSubmit],
	);

	const handleFileUpload = useCallback(
		(file: File | null) => {
			if (!file) {
				form.setFieldValue("adjunto", "");
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				const base64String = e.target?.result as string;
				form.setFieldValue("adjunto", base64String);
			};
			reader.readAsDataURL(file);
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
					{...form.getInputProps("fecha")}
				/>

				<Select
					label="Tipo"
					placeholder="Selecciona el tipo de evento"
					required
					data={[
						{ value: "ingreso", label: "Ingreso" },
						{ value: "egreso", label: "Egreso" },
					]}
					{...form.getInputProps("tipo")}
				/>

				<FileInput
					label="Adjunto (opcional)"
					placeholder="Selecciona una imagen"
					accept="image/*"
					leftSection={<IconPaperclip size={16} />}
					onChange={handleFileUpload}
				/>

				<Group justify="flex-end" mt="md">
					{onCancel && (
						<Button variant="subtle" onClick={onCancel}>
							<IconX size={18} />
						</Button>
					)}
					<Button
						type="submit"
						variant={isEditing ? "outline" : "filled"}
						color={isEditing ? "blue" : "green"}
					>
						{isEditing ? <IconRefresh size={18} /> : <IconCheck size={18} />}
					</Button>
				</Group>
			</Stack>
		</form>
	);
};

export const EventForm = React.memo(EventFormComponent);
