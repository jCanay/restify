import { Grip } from "lucide-react"
import "./css/booking-general-summary.css"
import Chart from "../Chart"

function BookingGeneralSummary() {
	return (
		<div className="booking-general-summary">
			<section className="header">
				<h3>Resumen general de reservas</h3>
				<div className="drag-handle">
					<Grip />
				</div>
			</section>
			<section className="body">
				<select name="" id="">
					<option value="asdasd">Última semana</option>
				</select>
				<Chart></Chart>
			</section>
		</div>
	)
}

export default BookingGeneralSummary