import {
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "./css/booking-cm-add.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import InputTimePicker from "@/modules/dashboard/components/DateTime/InputTimePicker";
import InputDatePicker from "@/modules/dashboard/components/DateTime/InputDatePicker";

export default function BookingCMAdd({ open, setOpen = () => { } }) {
	const { addBooking, loading, error } = useBookings();
	const [hours, setHours] = useState("");
	const [minutes, setMinutes] = useState("");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [dateError, setDateError] = useState("");
	const [timeError, setTimeError] = useState("");
	const bookingDate = useMemo(() => new Date(), []);
	const dateFooter = selectedDate ? (
		<span>{format(selectedDate, "PPP", { locale: es })}</span>
	) : (
		<span>Selecciona una fecha</span>
	);

	// Parse date and time
	useEffect(() => {
		bookingDate.setUTCDate(selectedDate?.getDate());
		bookingDate.setUTCMonth(selectedDate?.getMonth());
		bookingDate.setUTCFullYear(selectedDate?.getFullYear());

		bookingDate.setUTCHours(hours);
		bookingDate.setUTCMinutes(minutes);
		bookingDate.setUTCSeconds(0);
		bookingDate.setUTCMilliseconds(0);
	}, [bookingDate, selectedDate, hours, minutes, open]);

	// Reset errors on open
	useEffect(() => {
		const resetErrors = () => {
			if (!open) return;

			setDateError("");
			setTimeError("");
		};

		resetErrors();
	}, [open]);

	// Check if date and time are valid
	const isValid = useCallback(() => {
		const isDateOk = !isNaN(Date.parse(selectedDate));
		const isTimeOk = hours !== "" && minutes !== "";

		setDateError(isDateOk ? "" : "Selecciona una fecha.");
		setTimeError(isTimeOk ? "" : "Selecciona una hora.");

		return isDateOk && isTimeOk;
	}, [hours, minutes, selectedDate]);

	const handleAddClick = () => {
		if (!isValid()) {
			return;
		}

		const newBooking = addBooking(
			{ bookingDate },
			getUserDefaultRestaurant()?.id,
		);

		if (newBooking) {
			setOpen(false);
		}
	};

	const handleDateChange = (value) => {
		setSelectedDate(value);

		if (value) setDateError("");
	};

	const handleTimeChange = (value) => {
		const time = value.split(":");
		setHours(time[0]);
		setMinutes(time[1]);

		if (value) setTimeError("");
	};

	return (
		<DialogContent
			onOpenAutoFocus={(e) => {
				e.preventDefault();
				e.currentTarget.focus();
			}}
			className="booking-crud-manager add"
		>
			<DialogTitle>Añadir reserva</DialogTitle>
			<DialogDescription>Selecciona la fecha y la hora de la nueva reserva.</DialogDescription>
			<div
				className="wrapper"
				onMouseDown={(e) => e.stopPropagation()}
				onClick={(e) => e.stopPropagation()}
			>
				<InputDatePicker
					label={"Fecha"}
					required
					placeholder={"Selecciona una fecha"}
					error={dateError}
					onDateChange={handleDateChange}
				/>
				<InputTimePicker
					label={"Hora"}
					required
					readOnly
					error={timeError}
					onTimeChange={handleTimeChange}
				/>
			</div>
			<button
				onClick={handleAddClick}
				disabled={loading}
				className="btn"
				type="button"
			>
				<span>Añadir reserva</span>
				{loading && <Spinner data-icon="inline-start" />}
			</button>
		</DialogContent>
	);
}
