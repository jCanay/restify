import React, { useState, useEffect, useRef } from "react";
import "../css/search-bar.css";

const MAPTILER_KEY = "QkO3eLDUFMUxb3ecqiD8";

const SearchBar = ({ onSelect }) => {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [userLocation, setUserLocation] = useState(null);
	const [focused, setFocused] = useState(false);
	const searchContainerRef = useRef(null);

	useEffect(() => {
		const fetchAddresses = async (searchQuery) => {
			setLoading(true);
			try {
				if (query.length < 3) {
					setResults([]);
					return;
				}

				let url = `https://api.maptiler.com/geocoding/${encodeURIComponent(searchQuery)}.json?key=${MAPTILER_KEY}&language=es&limit=5&country=es&types=postal_code,address,place`;

				if (userLocation) {
					url += `&proximity=${userLocation[0]},${userLocation[1]}`;
				}

				const response = await fetch(url);
				if (!response.ok) throw new Error("MapTiler error");

				const data = await response.json();
				const features = data.features || [];

				// ORDENACIÓN INTELIGENTE: Pasamos los códigos postales arriba del todo
				const sortedFeatures = features.sort((a, b) => {
					const aIsPostal =
						a.place_type?.includes("postal_code") ||
						a.id?.startsWith("postal_code");
					const bIsPostal =
						b.place_type?.includes("postal_code") ||
						b.id?.startsWith("postal_code");

					if (aIsPostal && !bIsPostal) return -1; // 'a' sube
					if (!aIsPostal && bIsPostal) return 1; // 'b' sube
					return 0; // Se quedan igual
				});

				// Guardamos solo los primeros 5 resultados ya ordenados
				setResults(sortedFeatures.slice(0, 5));
				setResults(data.features || []);
			} catch (error) {
				console.error("Fallo en MapTiler:", error);
				setResults([]);
			} finally {
				setLoading(false);
			}
		};

		const timeoutId = setTimeout(() => {
			fetchAddresses(query);
		}, 300);

		return () => clearTimeout(timeoutId);
	}, [query, userLocation]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				setUserLocation([
					position.coords.longitude,
					position.coords.latitude,
				]);
			},
			(error) => ({ enableHighAccuracy: true }),
		);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			// English: If the click is outside the searchContainerRef, hide results
			if (
				searchContainerRef.current &&
				!searchContainerRef.current.contains(event.target)
			) {
				setFocused(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const handleClick = (feature) => {
		const [longitude, latitude] = feature.geometry.coordinates;

		// 1. Extracción directa del código postal si viene en el primer intento
		let postalCode = "";
		if (
			feature.place_type?.includes("postal_code") ||
			feature.id?.startsWith("postal_code")
		) {
			postalCode = feature.text;
		} else {
			const postalContext = feature.context?.find((ctx) =>
				ctx.id.startsWith("postal_code"),
			);
			postalCode = postalContext ? postalContext.text : "";
		}

		// 2. Extracción limpia de la ciudad
		const cityContext = feature.context?.find(
			(ctx) =>
				ctx.id.startsWith("place") || ctx.id.startsWith("municipality"),
		);
		const cityName = cityContext ? cityContext.text : feature.text;

		// 3. Enviamos el objeto con las coordenadas nativas para el Backend
		const selectionData = {
			city: cityName,
			address: feature.place_name,
			latitude: latitude,
			longitude: longitude,
			postalCode: postalCode, // Puede ir vacío ('') si es un barrio amplio como "O Couto"
		};

		setQuery(feature.place_name);
		setResults([]);

		if (onSelect instanceof Function) {
			onSelect(selectionData);
		}
	};
	return (
		<div className="search-bar-directions" ref={searchContainerRef}>
			<input
				type="search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder={"Introduce tu código postal o dirección"}
				onFocus={() => setFocused(true)}
			/>

			{results.length > 0 && focused && (
				<ul className="results-dropdown">
					{results.map((feature) => (
						<li key={feature.id}>
							<button onClick={() => handleClick(feature)}>
								<div className="item-content">
									<strong>{feature.text}</strong>
									<small>{feature.place_name}</small>
								</div>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
