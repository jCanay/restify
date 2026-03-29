import {
	MapContainer,
	TileLayer,
	Marker,
	useMap,
	useMapEvents,
	AttributionControl,
} from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useState, useCallback, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import _ from "lodash";
import "./css/location-picker.css";
import OperativeRadiusMapArea from "./OperativeRadiusMapArea";

// Fix para los iconos de Leaflet en React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { Skeleton } from "@/components/ui/skeleton";
import CurrentLocationButton from "./CurrentLocationButton";

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 1. Creamos el controlador de movimiento
const RecenterMap = ({ position }) => {
	const map = useMap();

	useEffect(() => {
		if (position) {
			map.flyTo([position.lat, position.lng], map.getZoom(), {
				duration: 1.5, // Velocidad en segundos (ej: 0.5 es muy rápido, 3.0 es lento)
				easeLinearity: 0.25, // Suavizado de la curva (0 a 1)
				noMoveStart: true, // Evita pequeños saltos al inicio
			});
		}
	}, [position, map]); // Se ejecuta cada vez que la posición cambie

	return null;
};

function LocationPicker({ height, onLocationChange, radius, setRadius }) {
	const [position, setPosition] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState([]);
	const provider = new OpenStreetMapProvider();
	const searchWrapperRef = useRef(null);
	const [mapInstance, setMapInstance] = useState(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				setPosition({ lat: latitude, lng: longitude });
			},
			() => setPosition({ lat: 40.41, lng: -3.7 }),
		);
	}, []);

	// Función auxiliar para notificar cambios completos
	const notifyChange = (newPos, newRadius) => {
		if (onLocationChange) {
			onLocationChange({
				position: newPos,
				radius: newRadius,
			});
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			// Si el clic NO fue dentro del buscador, ocultamos la lista
			if (
				searchWrapperRef.current &&
				!searchWrapperRef.current.contains(event.target)
			) {
				setResults([]);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const getSuggestions = useCallback(
		_.debounce(async (query) => {
			if (query.length < 3) {
				setResults([]);
				return;
			}
			const data = await provider.search({ query });
			setResults(data);
		}, 300),
		[],
	);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setSearchQuery(value);
		getSuggestions(value);
	};

	const selectLocation = (result) => {
		const { x, y, label } = result;
		const newCoords = { lat: y, lng: x };
		setPosition(newCoords);
		if (onLocationChange) {
			onLocationChange(newCoords);
		}
		setSearchQuery(label);
		setResults([]);
	};

	if (!position) {
		return (
			<div className="flex flex-col gap-4">
				<Skeleton className="h-10.75 bg-gray-200"></Skeleton>
				<Skeleton className="h-50 bg-gray-200"></Skeleton>
				<Skeleton className="h-22.5 bg-gray-200"></Skeleton>
			</div>
		);
	}

	return (
		<div className="location-picker">
			<div
				ref={searchWrapperRef}
				className="custom-search-box"
				style={{ position: "relative", zIndex: 1100 }}
			>
				<input
					type="text"
					placeholder="Escribe la dirección..."
					value={searchQuery}
					onChange={handleInputChange}
					onFocus={() => {
						if (searchQuery.length > 2) getSuggestions(searchQuery);
					}} // Re-mostrar al volver a enfocar
					className="setup-input"
				/>

				{results.length > 0 && (
					<ul>
						{results.map((res, index) => (
							<button
								key={index}
								type="button"
								onClick={() => selectLocation(res)}
								style={{ padding: "0.8rem", cursor: "pointer" }}
							>
								{res.label}
							</button>
						))}
					</ul>
				)}
			</div>
			<div
				style={{
					height: height,
					marginTop: "1rem",
					borderRadius: "0.5rem",
					overflow: "hidden",
				}}
			>
				{position && (
					<MapContainer
						center={position}
						zoom={13}
						style={{ height: "100%", outline: "solid 2px black" }}
						ref={setMapInstance}
					>
						<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
						<CurrentLocationButton
							setPosition={setPosition}
							onLocationChange={onLocationChange}
							map={mapInstance}
						/>
						<RecenterMap position={position} />
						<OperativeRadiusMapArea
							position={position}
							radius={radius}
						/>
						<Marker
							draggable={true}
							position={position}
							eventHandlers={{
								dragend: (e) => {
									const newPos = e.target.getLatLng();
									setPosition(newPos);
									notifyChange(newPos, radius);
								},
							}}
						/>
					</MapContainer>
				)}
			</div>
			<div
				style={{
					marginTop: "1rem",
					padding: "1rem",
					background: "#FFFFFF",
					borderRadius: "0.5rem",
					border: "1px solid #E0E6ED",
					boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
				}}
			>
				<label
					style={{
						display: "block",
						marginBottom: "0.5rem",
						fontWeight: "bold",
					}}
				>
					Área de entrega:{" "}
					<span style={{ color: "#5095FF" }}>{radius} metros</span>
				</label>
				<input
					type="range"
					min="100" // 100 metros
					max="20000"
					step="100"
					value={radius}
					onChange={(e) => {
						const newRadius = parseInt(e.target.value);
						setRadius(newRadius);
						notifyChange(position, newRadius); // Notificamos el cambio al padre
					}}
					style={{ width: "100%", cursor: "pointer" }}
				/>
			</div>
		</div>
	);
}

export default LocationPicker;
