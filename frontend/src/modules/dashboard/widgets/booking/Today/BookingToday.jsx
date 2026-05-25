import "./css/booking-today.css";
import Widget from "../../general/Widget";
import BookingLastCard from "../Last/BookingLastCard";

export default function BookingToday() {
	return <Widget title={"Reservas de hoy"} className={"booking-today"} >
		<section className="today">
			<div className="total">
				<h6>Total</h6>
				<span>27</span>
			</div>
			<div>
				<h6>Mediodía</h6>
				<span>10</span>
			</div>
			<div>
				<h6>Noche</h6>
				<span>17</span>
			</div>
		</section>
		<section>
			<h4>Reservas del mediodía</h4>
			<ul>
				<BookingLastCard hideDay hideRelativeTime size="compact" name="Miguel Bosques" bookingDateTime={new Date()} status="ACCEPTED" createdAt={new Date()} />
				<BookingLastCard hideDay hideRelativeTime size="compact" name="Miguel Bosques" bookingDateTime={new Date()} status="ACCEPTED" createdAt={new Date()} />
			</ul>
		</section>
		<section>
			<h4>Reservas de la noche</h4>
			<ul>
				<BookingLastCard hideDay hideRelativeTime size="compact" name="Silvia Rodrigo" bookingDateTime={new Date()} status="ACCEPTED" createdAt={new Date()} />
				<BookingLastCard hideDay hideRelativeTime size="compact" name="Silvia Rodrigo" bookingDateTime={new Date()} status="ACCEPTED" createdAt={new Date()} />
			</ul>
		</section>
	</Widget>;
}