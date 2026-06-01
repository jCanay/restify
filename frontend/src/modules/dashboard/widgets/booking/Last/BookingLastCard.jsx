import {
	BadgeCheck,
	BadgeMinus,
	BadgeQuestionMark,
	BadgeX,
	Calendar,
	Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RelativeTime from "../../../components/RelativeTime";
import "./css/booking-last-card.css";

const STATUS_CONFIG = {
	PENDING: {
		label: "Pendiente",
		className:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
		icon: <BadgeMinus strokeWidth={2.75} />,
	},
	ACCEPTED: {
		label: "Aceptada",
		className:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		icon: <BadgeCheck strokeWidth={3.25} />,
	},
	CANCELLED: {
		label: "Cancelada",
		className:
			"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
		icon: <BadgeX strokeWidth={3.25} />,
	},
	UNKNOWN: {
		label: "Desconocido",
		className:
			"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
		icon: <BadgeQuestionMark strokeWidth={3.25} />,
	},
};

/**
 * 
 * @param {object} props
 * @param {"ACCEPTED" | "CANCELLED"} [props.status]
 * @param {string} [props.name]
 * @param {Date} [props.createdAt]
 * @param {Date} [props.bookingDateTime]
 * @param {"compact" | "normal"} [props.size]
 * @param {boolean} [props.hideDay]
 * @param {boolean} [props.hideRelativeTime]
 */
function BookingLastCard({ name, status, createdAt, bookingDateTime, size = "normal", hideDay = false, hideRelativeTime = false }) {
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.UNKNOWN;
	const bookingDate = new Date(bookingDateTime);
	const now = new Date();

	const isSameDay = (d1, d2) =>
		d1.getDate() === d2.getDate() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getFullYear() === d2.getFullYear();

	// Calculate relative dates
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);

	// Determine the label
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
		<li className={`booking-last-card ${hideRelativeTime ? "relative-time-hidden" : ""}`}>
			<section className="head">
				{!hideRelativeTime && <div className="time-ago">
					<Clock strokeWidth={2.5} />
					<span><RelativeTime timestamp={createdAt} /></span>
				</div>}
				<Badge className={`badge ${config?.className} ${size === "compact" ? "compact" : ""}`}>
					{config?.icon}
					{size !== "compact" && config?.label}
				</Badge>
			</section>
			<h4>{name}</h4>
			<section className="datetime">
				{!hideDay && <div className="date">
					<Calendar strokeWidth={2.5} />
					{formattedDate}
				</div>}
				<div className="time">
					<Clock strokeWidth={2.5} />
					{formattedTime}
				</div>
			</section>
		</li>
	);
}

export default BookingLastCard;
