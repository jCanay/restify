import "./css/order-last.css";
import Widget from "../../general/Widget";
import OrderLastCard from "./OrderLastCard";


export default function OrderLast() {
	return (
		<Widget title="Últimos pedidos" className="order-last">
			<OrderLastCard name="User" bookingDateTime={new Date()} createdAt={new Date()} />
			<OrderLastCard name="User" bookingDateTime={new Date()} createdAt={new Date()} />
			<OrderLastCard name="User" bookingDateTime={new Date()} createdAt={new Date()} />
			<OrderLastCard name="User" bookingDateTime={new Date()} createdAt={new Date()} />
			<OrderLastCard name="User" bookingDateTime={new Date()} createdAt={new Date()} />
		</Widget>
	);
}