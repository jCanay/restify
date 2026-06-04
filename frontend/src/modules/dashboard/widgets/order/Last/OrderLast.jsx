import "./css/order-last.css";
import Widget from "../../general/Widget";
import OrderLastCard from "./OrderLastCard";
import { useEffect, useState } from "react";
import { useOrders } from "@/modules/restaurants/hooks/useOrders";
import { $userStore, getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";
import { Package } from "lucide-react";


export default function OrderLast() {
	const { getAllOrdersByRestaurantId, loading, error } = useOrders();
	const { user } = useStore($userStore);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const loadOrders = async () => {
			const response = await getAllOrdersByRestaurantId(
				getUserDefaultRestaurant()?.id, { page: 0, size: 100, sort: "createdAt,desc" }
			);

			setOrders(response.content);
		};

		loadOrders();
	}, [getAllOrdersByRestaurantId]);

	return (
		<Widget title="Últimos pedidos" className="order-last">
			{orders.length > 0 ? (
				orders.map((order, i) => {

					const isCurrentUser = order.user?.username === user?.username;
					const displayName = order.account?.name
						? `${order.account.name} ${order.account.surname}`
						: isCurrentUser
							? `${order.user.username} (Tú)`
							: order.user.username;

					return <OrderLastCard key={i} name={displayName} order={order} />;
				})
			) : (
				<div className="empty">
					<Package size={42} strokeWidth={1.5} />
					<h4>No hay pedidos</h4>
					<p>Todavía no se han creado pedidos</p>
				</div>
			)}
		</Widget>
	);
}