import { RESTAURANT_IMAGES } from "../../utils/constants";
import "./css/restaurant-card.css";



export default function RestaurantCard({ id, name, onClick }) {
	const capitalize = (str) => {
		if (!str) return "";
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const img = RESTAURANT_IMAGES[id % RESTAURANT_IMAGES.length];

	return (
		<button className="restaurant-card" onClick={onClick}>
			<img src={img} alt="" />
			<h4>{capitalize(name)}</h4>
		</button>
	);
}
