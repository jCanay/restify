import "../css/restaurants-page.css";
import { useEffect, useState } from "react";
import { useRestaurants } from "../hooks/useRestaurants";
import RestaurantsNavbar from "../components/RestaurantsNavbar/RestaurantsNavbar";
import RestaurantCategories from "../components/RestaurantCategories/RestaurantCategories";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";

export default function RestaurantsPage({ countryCode, city }) {
	const { getRestaurants, loading, error } = useRestaurants();
	const [restaurants, setRestaurants] = useState([]);
	const [filteredRestaurants, setFilteredRestaurants] = useState([]);

	const fake = [
		{ id: 1, name: "McDonald's 1" },
		{ id: 2, name: "McDonald's 3" },
		{ id: 3, name: "McDonald's 2" },
		{ id: 4, name: "McDonald's 5" },
		{ id: 5, name: "McDonald's 3" },
		{ id: 6, name: "McDonald's 2" },
		{ id: 7, name: "McDonald's 4" },
		{ id: 8, name: "McDonald's 2" },
		{ id: 9, name: "McDonald's 4" },
		{ id: 10, name: "McDonald's 2" },
		{ id: 11, name: "McDonald's 5" },
		{ id: 12, name: "McDonald's 3" },
		{ id: 13, name: "McDonald's 1" },
		{ id: 14, name: "McDonald's 2" },
		{ id: 15, name: "McDonald's 4" },
		{ id: 16, name: "McDonald's 4" },
		{ id: 17, name: "McDonald's 1" },
		{ id: 18, name: "McDonald's 5" },
		{ id: 19, name: "McDonald's 4" },
		{ id: 20, name: "McDonald's 3" },
		{ id: 21, name: "McDonald's 3" },
		{ id: 22, name: "McDonald's 3" },
		{ id: 23, name: "McDonald's 2" },
		{ id: 24, name: "McDonald's 1" },
	];

	useEffect(() => {
		const loadRestaurants = async () => {
			const response = await getRestaurants(countryCode, city);
			setRestaurants(response.content);
			setFilteredRestaurants(response.content);
		};

		loadRestaurants();
	}, [getRestaurants, countryCode, city]);

	const handleInputChange = (value) => {
		setFilteredRestaurants(restaurants.filter(r => r.name.toLowerCase().includes(value.toLowerCase().trim())));
	};

	const capitalize = (str) => {
		if (!str) return '';
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return (
		<>
			<RestaurantsNavbar city={city} onInputChange={handleInputChange} />
			<main className="restaurants-page container">
				<span><a href="/">{capitalize(city)}</a> {">"} Comida</span>
				<h3>Comida</h3>
				<RestaurantCategories />
				<hr />
				<div className="sort">
					<button type="button" className="bg-gray-200 rounded-2xl">...Ordenar por...</button>
				</div>
				<h2>Todos los establecimientos</h2>
				<div className="restaurants-grid">
					{!loading && !error && filteredRestaurants?.map((r, i) => (
						<RestaurantCard key={i} id={r.id} name={r.name} />
					))}
				</div>
			</main>
		</>
	);
}