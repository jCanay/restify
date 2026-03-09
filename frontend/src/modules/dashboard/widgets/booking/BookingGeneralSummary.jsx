import "../../css/booking-general-summary.css"
import Chart from "../Chart"

function BookingGeneralSummary() {
	return (
		<div className="booking-general-summary">
			<section className="header">
				<h3>Resumen general de reservas</h3>
				<div className="drag-handle">
					<svg viewBox="0 0 24 24" width="20">
						<path
							d="M7 15h10v2H7zm0-4h10v2H7zm0-4h10v2H7z"
							fill="currentColor"
						/>
					</svg>
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