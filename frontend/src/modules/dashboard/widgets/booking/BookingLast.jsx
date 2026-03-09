import { Calendar, Check, Clock, Grip } from "lucide-react";
import "./css/booking-last.css";
import BookingLastCard from "./BookingLastCard";

function BookingLast() {
    return (
        <div className="booking-last">
            <section className="header">
                <h3>Últimas reservas</h3>
                <div className="drag-handle">
                    <Grip />
                </div>
            </section>
            <section className="body">
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:18:44+01:00"}
                    bookingDateTime={"2026-03-09T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:25:44+01:00"}
                    bookingDateTime={"2026-03-10T14:30:00+01:00"}
                    status={"canceled"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T10:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-07T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-02T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>
                <BookingLastCard
                    name={"Enooc Domínguez"}
                    createdAt={"2026-03-09T13:18:44+01:00"}
                    bookingDateTime={"2026-03-12T14:30:00+01:00"}
                    status={"accepted"}
                ></BookingLastCard>

            </section>
        </div>
    );
}

export default BookingLast;
