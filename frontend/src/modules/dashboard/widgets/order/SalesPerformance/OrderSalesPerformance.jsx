import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Chart from "../../Chart";
import Widget from "../../general/Widget";
import "./css/order-sales-performance.css";

export default function OrderSalesPerformance() {
	return (
		<Widget className="order-sales-performance" title="Rendimiento de ventas">
			<section className="filter">
				<Select defaultValue="today">
					<SelectTrigger className="select text-ellipsis">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="select-filter" >
						<SelectGroup>
							<SelectItem value="today">Hoy</SelectItem>
							<SelectItem value="week">Esta semana</SelectItem>
							<SelectItem value="month">Este mes</SelectItem>
							<SelectItem value="year">Este año</SelectItem>
							<SelectItem value="all">Desde el principio</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<div className="money">
					<h4>23,33€</h4>
					<span>+ 5,35%</span>
				</div>
			</section>
			<Chart />
		</Widget>
	);
}