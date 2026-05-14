import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "./css/booking-cm-add.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import InputTimePicker from "@/modules/dashboard/components/DateTime/InputTimePicker";
import InputDatePicker from "@/modules/dashboard/components/DateTime/InputDatePicker";

export default function BookingCMAdd({ open, setOpen = () => {} }) {
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

    useEffect(() => {
        bookingDate.setUTCDate(selectedDate?.getDate());
        bookingDate.setUTCMonth(selectedDate?.getMonth());
        bookingDate.setUTCFullYear(selectedDate?.getFullYear());

        bookingDate.setUTCHours(hours);
        bookingDate.setUTCMinutes(minutes);
        bookingDate.setUTCSeconds(0);
        bookingDate.setUTCMilliseconds(0);
        console.log("BOOKING: ", bookingDate);
        console.log(open);

        return () => {};
    }, [bookingDate, selectedDate, hours, minutes, open]);

    const isValid = () => {
        return bookingDate.valueOf();
    };

    useEffect(() => {
        console.log(isValid());
    }, [bookingDate, selectedDate, hours, minutes]);

    const handleAddClick = () => {
        if (!bookingDate) {
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

    const handleTimeChange = (value) => {
        console.log("TIME");

        const time = value.split(":");
        setHours(time[0]);
        setMinutes(time[1]);
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
            <DialogDescription>
                Selecciona la fecha y la hora de la nueva reserva.
            </DialogDescription>
            <div
                className="wrapper"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
            >
                {/* <DayPicker
                    locale={es}
                    mode="single"
                    showOutsideDays
                    disabled={{ before: new Date() }}
                    startMonth={new Date()}
                    endMonth={addMonths(new Date(), 3)}
                    animate
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    footer={dateFooter}
                /> */}
                <InputDatePicker
                    label={"Fecha"}
                    required
                    placeholder={"Selecciona una fecha"}
                    onDateChange={setSelectedDate}
                />
                <InputTimePicker
                    label={"Hora"}
                    required
                    readOnly
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
