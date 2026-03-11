import { GripVertical } from "lucide-react"
import "./css/booking-general-summary.css"
import Chart from "../Chart"

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
				<Chart></Chart>
			</section>
		</div>
	)
}

export default BookingGeneralSummary