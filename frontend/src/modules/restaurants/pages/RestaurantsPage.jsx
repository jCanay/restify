import "../css/restaurants-page.css";
import { useEffect, useState } from "react";
import { useRestaurants } from "../hooks/useRestaurants";
import RestaurantsNavbar from "../components/RestaurantsNavbar/RestaurantsNavbar";
import RestaurantCategories from "../components/RestaurantCategories/RestaurantCategories";
import RestaurantCard from "../components/RestaurantCard/RestaurantCard";
import { useStore } from "@nanostores/react";
import {
	$restaurantsStore,
	restaurantsExists,
} from "../context/restaurantsStore";
import { deburr, flow, kebabCase } from "lodash";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router";
import { Footer } from "@/modules/core/components/Footer/Footer";

export default function RestaurantsPage({ countryCode, city }) {
	const navigate = useNavigate();
	const { getRestaurants, loading, error } = useRestaurants();
	const { getProducts } = useProducts();
	const { restaurants } = useStore($restaurantsStore);
	const [loadedRestaurants, setLoadedRestaurants] = useState([]);
	const [filteredRestaurants, setFilteredRestaurants] = useState([]);

	useEffect(() => {
		const loadRestaurants = async () => {
			if (!restaurantsExists()) {
				const response = await getRestaurants(countryCode, city);

				setLoadedRestaurants(response.content);
				setFilteredRestaurants(response.content);
			}

			setLoadedRestaurants(restaurants);
			setFilteredRestaurants(restaurants);
		};

		loadRestaurants();
	}, [restaurants, getRestaurants, countryCode, city]);

	useEffect(() => {
		console.log(filteredRestaurants);
	}, [filteredRestaurants]);

	const handleInputChange = (value) => {
		setFilteredRestaurants(
			loadedRestaurants.filter((r) =>
				r.name.toLowerCase().includes(value.toLowerCase().trim()),
			),
		);
	};

	const handleRestaurantClick = async (restaurant) => {
		navigate(`/${countryCode}/${city}/${restaurant.slug}`);
	};

	const capitalize = (str) => {
		if (!str) return "";
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return (
		<>
			<RestaurantsNavbar
				placeholder={`Buscar restaurantes${city ? ` en ${capitalize(city)}` : ""}`}
				onInputChange={handleInputChange}
			/>
			<main className="restaurants-page container">
				<span>
					<a href="/">{capitalize(city)}</a> {">"} Comida
				</span>
				<h3>Comida</h3>
				<RestaurantCategories />
				<hr />
				<div className="sort">
					<button type="button" className="bg-gray-200 rounded-2xl">
						...Ordenar por...
					</button>
				</div>
				<h2>Todos los establecimientos</h2>
				<div className="restaurants-grid">
					{!loading &&
						!error &&
						filteredRestaurants?.map((r, i) => (
							<RestaurantCard
								key={i}
								id={r.id}
								name={r.name}
								onClick={() => handleRestaurantClick(r)}
							/>
						))}
				</div>
			</main>
			<Footer variant="light" />
		</>
	);
}
