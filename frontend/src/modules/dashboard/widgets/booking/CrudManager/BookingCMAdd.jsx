import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import InputDatePicker from "@/modules/dashboard/components/DateTime/InputDatePicker";
import InputTimePicker from "@/modules/dashboard/components/DateTime/InputTimePicker";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./css/booking-cm-add.css";

export default function BookingCMAdd({ open, setOpen = () => {} }) {
    const { addBooking, loading, error } = useBookings();
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateError, setDateError] = useState("");
    const [timeError, setTimeError] = useState("");
    const [shakeTrigger, setShakeTrigger] = useState(0);
    const bookingDate = useMemo(() => new Date(), []);

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
        const reset = () => {
            if (!open) return;

            setDateError("");
            setTimeError("");
            setShakeTrigger(0);
        };

        reset();
    }, [open]);

    // Check if date and time are valid
    const isValid = useCallback(() => {
        const isDateValid = !isNaN(Date.parse(selectedDate));
        const isTimeValid = hours !== "" && minutes !== "";

        setDateError(isDateValid ? "" : "Selecciona una fecha.");
        setTimeError(isTimeValid ? "" : "Selecciona una hora.");

        return isDateValid && isTimeValid;
    }, [hours, minutes, selectedDate]);

    const handleAddClick = () => {
        setShakeTrigger(!isValid() ? (prev) => prev + 1 : 0);

        if (!isValid()) return;

        const newBooking = addBooking(
            { bookingDate },
            getUserDefaultRestaurant()?.id,
        );

        // Close dialog if added successfully
        if (newBooking) setOpen(false);
    };

    const handleDateChange = useCallback(
        (value) => {
            setSelectedDate(value);

            setDateError(
                !value && shakeTrigger > 0 ? "Selecciona una fecha." : "",
            );
        },
        [shakeTrigger],
    );

    const handleTimeChange = useCallback(
        (value) => {
            const time = value.split(":");
            setHours(time[0]);
            setMinutes(time[1]);

            setTimeError(
                !value && shakeTrigger > 0 ? "Selecciona una hora." : "",
            );
        },
        [shakeTrigger],
    );

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
                <InputDatePicker
                    label={"Fecha"}
                    required
                    readOnly
                    placeholder={"Selecciona una fecha"}
                    error={dateError}
                    onDateChange={handleDateChange}
                    shakeTrigger={shakeTrigger}
                />
                <InputTimePicker
                    label={"Hora"}
                    required
                    readOnly
                    error={timeError}
                    onTimeChange={handleTimeChange}
                    shakeTrigger={shakeTrigger}
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
