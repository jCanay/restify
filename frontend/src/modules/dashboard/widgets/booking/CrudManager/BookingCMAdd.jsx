import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "./css/booking-cm-add.css";
import { WheelPicker, WheelPickerWrapper } from "@/@components/wheel-picker";

export default function BookingCMAdd({ setOpen = Function }) {
	const { addBooking, loading, error } = useBookings();
	const [hours, setHours] = useState("00");
	const [minutes, setMinutes] = useState("00");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const bookingDate = useMemo(() => new Date(), []);
	const dateFooter = selectedDate ? (
		<span>{format(selectedDate, "PPP", { locale: es })}</span>
	) : (
		<span>Selecciona una fecha</span>
	);

	const addMonths = (date, months) => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + months);
		return newDate;
	};

	const getTimeOptions = (maxNum) => {
		const hourOptions = [];

		for (let i = 0; i < maxNum; i++) {
			hourOptions.push({
				label: i.toString().padStart(2, "0"),
				value: i.toString().padStart(2, "0"),
			});
		}

		return hourOptions;
	};

	useEffect(() => {
		bookingDate.setUTCDate(selectedDate?.getDate());
		bookingDate.setUTCMonth(selectedDate?.getMonth());
		bookingDate.setUTCFullYear(selectedDate?.getFullYear());

		bookingDate.setUTCHours(hours);
		bookingDate.setUTCMinutes(minutes);
		bookingDate.setUTCSeconds(0);
		bookingDate.setUTCMilliseconds(0);
	}, [bookingDate, selectedDate, hours, minutes]);

	const handleAddClick = () => {
		if (!bookingDate) {
			return;
		}

		const newBooking = addBooking({ bookingDate }, getUserDefaultRestaurant()?.id);

		if (newBooking) {
			setOpen(false);
		}
	};

	return (
		<DialogContent
			className="booking-crud-manager add"
			aria-describedby={undefined}
		>
			<DialogTitle>Añadir reserva</DialogTitle>
			<DialogDescription>
				Selecciona la fecha y la hora de la nueva reserva.
			</DialogDescription>
			<div className="wrapper">
				<DayPicker
					fixedWeeks
					showOutsideDays
					locale={es}
					hidden={{ before: new Date() }}
					modifiers={{}}
					startMonth={new Date()}
					endMonth={addMonths(new Date(), 3)}
					animate
					selected={selectedDate}
					onSelect={setSelectedDate}
					mode="single"
					footer={dateFooter}
				/>
				<WheelPickerWrapper className="time-picker">
					<WheelPicker
						options={getTimeOptions(24)}
						value={hours}
						infinite
						onValueChange={setHours}
					/>
					<WheelPicker
						options={getTimeOptions(60)}
						value={minutes}
						infinite
						onValueChange={setMinutes}
					/>
				</WheelPickerWrapper>

			</div>
			<button onClick={handleAddClick} disabled={loading} className="btn" type="button">
				<span>Añadir reserva</span>
				{loading && <Spinner data-icon="inline-start" />}
			</button>
		</DialogContent>
	);
}