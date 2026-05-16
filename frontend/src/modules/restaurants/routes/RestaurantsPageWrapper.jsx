// src/modules/restaurants/routes/RestaurantsPageWrapper.jsx
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import RestaurantsPage from "../pages/RestaurantsPage";

export default function RestaurantsPageWrapper() {
	const { country, city } = useParams();
	const navigate = useNavigate();

	// Estados para controlar la validación del backend
	const [isValid, setIsValid] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// TRANFORMAR URL A LOWERCASE
		const hasUppercaseCountry = country && country !== country.toLowerCase();
		const hasUppercaseCity = city && city !== city.toLowerCase();

		if (hasUppercaseCountry || hasUppercaseCity) {
			const cleanCountry = country ? country.toLowerCase() : "";
			const cleanCity = city ? city.toLowerCase() : "";

			// Construimos la ruta limpia dependiente de si hay ciudad o no
			const targetUrl = cleanCity ? `/${cleanCountry}/${cleanCity}` : `/${cleanCountry}`;

			// Redirigimos de inmediato usando { replace: true } para no ensuciar el historial del navegador
			navigate(targetUrl, { replace: true });
			return; // Cortamos la ejecución aquí, el re-render por el cambio de URL se encargará del resto
		}

		checkLocationExists(country, city)
			.then(({ matchCountry, matchCity }) => {
				const isLocationValid = country && matchCountry && (matchCity || !city);

				setIsValid(isLocationValid);
				return;
			})
			.catch(() => {
				setIsValid(false);
			})
			.finally(() => {
				setLoading(false);
			});

	}, [country, city, navigate]);

	if (loading) return <div>Loading</div>;

	if (!isValid) return <button onClick={() => navigate("/")}>Volver al inicio</button>;

	return (
		<RestaurantsPage
			key={`${country?.toLowerCase()}-${city?.toLowerCase()}`}
			country={country?.toLowerCase()}
			city={city?.toLowerCase()}
		/>
	);
}

// -----------------------------------------------------------------------------
// Función auxiliar de ejemplo para simular la petición a tu API
const checkLocationExists = async (country, city) => {
	// Aquí iría tu fetch/axios. De momento simulamos con un delay:
	return new Promise((resolve) => {
		setTimeout(() => {
			const mock = {
				es: ["ourense", "madrid"],
				pt: ["lisboa", "oporto"]
			};

			const matchCountry = !!mock[country?.toLowerCase()]?.length;
			const matchCity = mock[country?.toLowerCase()]?.includes(city?.toLowerCase());

			resolve({ matchCountry, matchCity });
		}, 300);
	});
};