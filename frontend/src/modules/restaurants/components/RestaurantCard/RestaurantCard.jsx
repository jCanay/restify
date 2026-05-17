import "./css/restaurant-card.css";

export default function RestaurantCard({ id, name }) {
	const RESTAURANT_IMAGES = [
		"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=350&fit=crop&q=80",
		"https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=350&fit=crop&q=80"
	];

	const capitalize = (str) => {
		if (!str) return '';
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const img = RESTAURANT_IMAGES[id % RESTAURANT_IMAGES.length];

	return (
		<button className="restaurant-card">
			<img src={img} alt="" />
			<h4>{capitalize(name)}</h4>
		</button>
	);
}