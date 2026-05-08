import {
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { WheelPicker, WheelPickerWrapper } from "@/@components/wheel-picker";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useBookings } from "../../hooks/useBooking";
import { useStore } from "@nanostores/react";
import { $userStore, getUserDefaultRestaurant } from "../../contexts/userStore";

/**
 * @param {object} [props]
 * @param {"add" | "search" | "edit" | "delete"} [props.type]
 */
export default function BookingCrudManager({ type }) {
    const { addBooking, getAllBookings, loading, error } = useBookings();
    const [hours, setHours] = useState("00");
    const [minutes, setMinutes] = useState("00");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookingDate, setBookingDate] = useState();
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
        const date = new Date();
        date.setDate(selectedDate.getDate());
        date.setMonth(selectedDate.getMonth());
        date.setFullYear(selectedDate.getFullYear());

        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        console.log(date.toJSON());
    }, [selectedDate, hours, minutes]);

    useEffect(() => {
        getAllBookings();
    }, []);

    const handleAddClick = () => {
        if (bookingDate) {
            addBooking({ bookingDate }, getUserDefaultRestaurant()?.id);
        }
    };

    const types = {
        add: (
            <DialogContent
                className="crud-manager-plus"
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
                <button onClick={handleAddClick} className="btn" type="button">
                    <span>Añadir reserva</span>
                    {loading && <Spinner data-icon="inline-start" />}
                </button>
            </DialogContent>
        ),
    };

    return types[type];
}
