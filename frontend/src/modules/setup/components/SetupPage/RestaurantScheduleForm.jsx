import { ChevronLeft } from "lucide-react";
import ScheduleForm from "../ScheduleForm/ScheduleForm";
import "./css/restaurant-schedule-form.css";

function RestaurantScheduleForm({ onBackClick }) {

	return (
		<div className="restaurant-schedule-form">
			<h2 className="text-2xl font-semibold">
				<button type="button" onClick={onBackClick}>
					<ChevronLeft size={20} />
				</button>
				Horario de apertura
			</h2>
			<p>
				Introduce el horario habitual de apertura. Más tarde podrás añadir excepciones.
			</p>
			<ScheduleForm modifiable expanded />
		</div>
	);
}

export default RestaurantScheduleForm;
