import {
	BadgeCheck,
	BadgeMinus,
	BadgeQuestionMark,
	BadgeX,
	Calendar,
	ChevronDown,
	Clock,
	ReceiptEuro,
	X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RelativeTime from "../../../components/RelativeTime";
import "./css/order-last-card.css";
import { PRODUCT_IMAGES_MOCK } from "@/modules/restaurants/utils/constants";
import { formatCurrency } from "@/modules/restaurants/utils/stringParser";
import { useProducts } from "@/modules/restaurants/hooks/useProducts";
import { getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useEffect, useState } from "react";

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
		icon: <BadgeCheck strokeWidth={2.75} />,
	},
	CANCELLED: {
		label: "Cancelada",
		className:
			"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
		icon: <BadgeX strokeWidth={2.75} />,
	},
	UNKNOWN: {
		label: "Desconocido",
		className:
			"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
		icon: <BadgeQuestionMark strokeWidth={2.75} />,
	},
};

const PAYMENT_STATUS_CONFIG = {
	PENDING: {
		label: "Pendiente",
		className:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
		icon: <BadgeMinus strokeWidth={2.75} />,
	},
	PAID: {
		label: "Aceptado",
		className:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
		icon: <BadgeCheck strokeWidth={2.75} />,
	},
	FAILED: {
		label: "Cancelado",
		className:
			"bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
		icon: <BadgeX strokeWidth={2.75} />,
	},
	UNKNOWN: {
		label: "Desconocido",
		className:
			"bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
		icon: <BadgeQuestionMark strokeWidth={2.75} />,
	},
};

/**
 * 
 * @param {object} props
 * @param {string} [props.name]
 * @param {object} [props.order]
 * @param {"compact" | "normal"} [props.size]
 * @param {boolean} [props.hideDay]
 * @param {boolean} [props.hideRelativeTime]
 */
export default function OrderLastCard({
	name,
	order = {},
	size = "normal",
	hideRelativeTime = false
}) {
	const config = STATUS_CONFIG[order?.status] || STATUS_CONFIG.UNKNOWN;
	const now = new Date();

	// Calculate relative dates
	const yesterday = new Date(now);
	yesterday.setDate(now.getDate() - 1);

	const tomorrow = new Date(now);
	tomorrow.setDate(now.getDate() + 1);

	const { getProducts } = useProducts();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const loadProducts = async () => {
			const response = await getProducts(getUserDefaultRestaurant()?.id);
			setProducts(response);
		};

		loadProducts();
	}, [getProducts]);

	return (
		<div>
			<details className="order-last-card" name="order">
				<summary>
					<li className={`${hideRelativeTime ? "relative-time-hidden" : ""}`}>
						<section className="head">
							{!hideRelativeTime && <div className="time-ago">
								<Clock strokeWidth={2.5} />
								<span><RelativeTime timestamp={order?.createdAt} /></span>
							</div>}
							<Badge className={`badge ${config?.className} ${size === "compact" ? "compact" : ""}`}>
								{config?.icon}
								{size !== "compact" && config?.label}
							</Badge>
						</section>
						<h4>{name}</h4>
						<section className="datetime">
							<div className="time">
								<ReceiptEuro />{formatCurrency.format(order?.payment?.amount)}
							</div>
						</section>
					</li>
					<ChevronDown size={30} />
				</summary>
				<section className="order-detail">
					<span>{order?.items.length} productos</span>
					<ul>
						{order?.items?.map((item, i) => (
							<li key={i}>
								<img src={
									PRODUCT_IMAGES_MOCK[
									products.findIndex((p) => p.id == item.id) - 1 %
									PRODUCT_IMAGES_MOCK.length
									] || PRODUCT_IMAGES_MOCK[0]
								} alt="" />
								<h5>
									{item.quantity}
									<X size={12} />
									{item.name}
								</h5>
								<span>{formatCurrency.format(item.price)}</span>
							</li>
						))}
					</ul>
					<div className="total">
						<span>Total</span>
						<span className="quantity">{formatCurrency.format(order?.payment?.amount)}</span>
					</div>
				</section>
			</details>
		</div>
	);
}
