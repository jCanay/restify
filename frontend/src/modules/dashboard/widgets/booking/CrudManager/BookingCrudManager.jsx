import BookingCMAdd from "./BookingCMAdd";
import BookingCMSearch from "./BookingCMSearch";
import "./css/booking-crud-manager.css";

/**
 * @param {object} [props]
 * @param {"add" | "search" | "edit" | "delete"} [props.type]
 */
export default function BookingCrudManager({ type, setOpen }) {

	const components = {
		add: BookingCMAdd,
		search: BookingCMSearch
	};

	const SelectedComponent = components[type];

	return SelectedComponent ? <SelectedComponent setOpen={setOpen} /> : null;
}
