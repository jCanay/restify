import { GripVertical } from "lucide-react";
import "./css/booking-general-summary.css";
import BarChart from "./BarChart";

function BookingGeneralSummary() {
	return (
		<div className="booking-general-summary">
			<section className="header">
				<div className="drag-handle">
					<GripVertical />
				</div>
				<h3>Resumen general de reservas</h3>
			</section>
			<section className="body">
				<select name="" id="">
					<option value="">Última semana</option>
				</select>
				{/* <Chart config={chartConfig} data={chartData} /> */}
				<BarChart />
			</section>
		</div>
	);
}

export default BookingGeneralSummary;