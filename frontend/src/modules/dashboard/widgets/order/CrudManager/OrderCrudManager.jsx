import "./css/order-crud-manager.css";
import OrderCMAdd from "./OrderCMAdd";
import OrderCMSearch from "./OrderCMSearch";

/**
 * @param {object} [props]
 * @param {"add" | "search" | "edit" | "delete"} [props.type]
 */
export default function OrderCrudManager({ type, open, setOpen }) {
	const components = {
		add: OrderCMAdd,
		search: OrderCMSearch,
	};

	const SelectedComponent = components[type];

	return SelectedComponent ? (
		<SelectedComponent open={open} setOpen={setOpen} />
	) : null;
}