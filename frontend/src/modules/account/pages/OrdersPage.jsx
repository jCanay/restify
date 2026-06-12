import Navbar from "@/modules/core/components/Navbar";
import { useOrders } from "@/modules/restaurants/hooks/useOrders";
import { useEffect, useState } from "react";
import "../css/orders-page.css";
import { useNavigate } from "react-router";
import { BadgeCheck, BadgeMinus, BadgeQuestionMark, BadgeX, ChevronLeft, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RESTAURANT_IMAGES } from "@/modules/restaurants/utils/constants";
import { formatCurrency } from "@/modules/restaurants/utils/stringParser";

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

export default function OrdersPage() {
	const { getAllOrdersByUser } = useOrders();
	const [orders, setOrders] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const loadOrders = async () => {
			try {
				const response = await getAllOrdersByUser({ sort: "createdAt,desc" });

				setOrders(response.content);
			} catch (err) {
				console.error(err);
			}
		};

		loadOrders();
	}, [getAllOrdersByUser]);

	return (
		<>
			<Navbar />
			<main className="orders-page container">
				<nav>
					<button onClick={() => navigate(-1)}>
						<ChevronLeft size={32} />
					</button>
					<h2>Pedidos</h2>
				</nav>
				<section className="orders-list">
					{orders.length > 0 ? (
						orders.map((o, i) => (
							<>
								<article key={i} className="order">
									<img src={RESTAURANT_IMAGES[o.restaurant.id % RESTAURANT_IMAGES.length]} alt="" />
									<div className="body">
										<header>
											<h4>{o.restaurant.name}</h4>
											<Badge className={`badge ${STATUS_CONFIG[o.status].className}`}>
												{STATUS_CONFIG[o.status].icon}
												{STATUS_CONFIG[o.status].label}
											</Badge>
										</header>
										<div className="desc">
											<div className="items">
												<span>{o.items?.[0]?.quantity} x {o.items[0]?.name}</span>
												{o.items?.[1] && <span>{o.items?.[1]?.quantity} x {o.items[1]?.name}</span>}
											</div>
											<span className="price">{formatCurrency.format(o.payment.amount)}</span>
										</div>
									</div>
									{/* {o.items[0].quantity}
								{o.items[0].name}
								 */}
								</article>
								<hr />
							</>
						))
					) : (
						<div className="empty">
							<Package size={72} strokeWidth={1.25} />
							<h3>No hay pedidos</h3>
							<p>Todavía no has hecho ningún pedido. Cuando lo hagas, aparecerá aquí.</p>
						</div>
					)}
				</section>
			</main>
		</>
	);
}