import {
    BadgeCheck,
    BadgeQuestionMark,
    BadgeX,
    Calendar,
    Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TimeAgo from "../../components/TimeAgo";
import "./css/booking-last-card.css";

const STATUS_CONFIG = {
    accepted: {
        label: "Aceptada",
        className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        icon: <BadgeCheck strokeWidth={3.25} />,
    },
    canceled: {
        label: "Cancelada",
        className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        icon: <BadgeX strokeWidth={3.25} />,
    },
    unknown: {
        label: "Desconocido",
        className:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        icon: <BadgeQuestionMark strokeWidth={3.25} />,
    },
};

function BookingLastCard({ name, status, createdAt, bookingDateTime }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
    const bookingDate = new Date(bookingDateTime);
    const now = new Date();

    const isSameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    // English: Calculate relative dates
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    // English: Determine the label
    let formattedDate;
    if (isSameDay(bookingDate, now)) {
        formattedDate = "Hoy";
    } else if (isSameDay(bookingDate, yesterday)) {
        formattedDate = "Ayer";
    } else if (isSameDay(bookingDate, tomorrow)) {
        formattedDate = "Mañana";
    } else {
        formattedDate = new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "long",
        }).format(bookingDate);
    }

    const formattedTime = new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(bookingDate);

    return (
        <li className="booking-last-card">
            <section className="head">
                <div className="time-ago">
                    <Clock strokeWidth={2.5} />
                    <TimeAgo timestamp={createdAt} />
                </div>
                <Badge className={`badge ${config.className}`}>
                    {config.icon}
                    {config.label}
                </Badge>
            </section>
            <h4>{name}</h4>
            <section className="datetime">
                <div className="date">
                    <Calendar strokeWidth={2.5} />
                    {formattedDate}
                </div>
                <div className="time">
                    <Clock strokeWidth={2.5} />
                    {formattedTime}
                </div>
            </section>
        </li>
    );
}

export default BookingLastCard;
