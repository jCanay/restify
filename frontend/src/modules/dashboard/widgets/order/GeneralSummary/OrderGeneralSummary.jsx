import "./css/order-general-summary.css";
import Chart from "../../Chart";
import Widget from "../../general/Widget";


export default function OrderGeneralSummary() {
	return (
		<Widget className="order-general-summary" title="Resumen general de pedidos">
			<select name="" id="">
				<option value="">Última semana</option>
			</select>
			<Chart></Chart>
		</Widget>
	);
}
