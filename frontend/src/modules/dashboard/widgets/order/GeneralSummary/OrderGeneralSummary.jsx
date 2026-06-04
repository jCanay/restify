import "./css/order-general-summary.css";
import Widget from "../../general/Widget";
import BarChart from "../../booking/GeneralSummary/BarChart";


export default function OrderGeneralSummary() {
	return (
		<Widget className="order-general-summary" title="Resumen general de pedidos">
			<select name="" id="">
				<option value="">Última semana</option>
			</select>
			<BarChart />
		</Widget>
	);
}
