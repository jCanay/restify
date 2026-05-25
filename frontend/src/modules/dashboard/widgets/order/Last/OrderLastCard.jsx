import {
	BadgeCheck,
	BadgeMinus,
	BadgeQuestionMark,
	BadgeX,
	Calendar,
	ChevronDown,
	Clock,
	X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RelativeTime from "../../../components/RelativeTime";
import "./css/order-last-card.css";
import { PRODUCT_IMAGES_MOCK } from "@/modules/restaurants/utils/constants";

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
export default function OrderLastCard({
	name,
	status,
	createdAt,
	size = "normal",
	hideRelativeTime = false
}) {
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.UNKNOWN;
	const now = new Date();

	// Calculate relative dates
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);

	return (
		<div>
			<details className="order-last-card" name="order">
				<summary>
					<li className={`${hideRelativeTime ? "relative-time-hidden" : ""}`}>
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
					</li>
					<ChevronDown size={30} />
				</summary>
				<section className="order-detail">
					<span>4 productos</span>
					<ul>
						<li>
							<img src={PRODUCT_IMAGES_MOCK[3]} alt="" />
							<h5>2<X size={12} /> Hamburguesa</h5>
							<span>22,50 €</span>
						</li>
						<li>
							<img src={PRODUCT_IMAGES_MOCK[0]} alt="" />
							<h5>1<X size={12} />Patatas</h5>
							<span>6,50 €</span>
						</li>
						<li>
							<img src={PRODUCT_IMAGES_MOCK[9]} alt="" />
							<h5>1<X size={12} />Coca-Cola</h5>
							<span>2,20 €</span>
						</li>
					</ul>
					<div className="total">
						<span>Total</span>
						<span className="quantity">31,20€</span>
					</div>
				</section>
			</details>
		</div>
	);
}
