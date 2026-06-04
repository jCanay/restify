import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./css/address-map.css";

// Corregir el problema de los iconos rotos en entornos empaquetados (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.71.1/images/marker-icon-2x.png',
	iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.71.1/images/marker-icon.png',
	shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.71.1/images/marker-shadow.png',
});

// Subcomponente interno para mover el mapa cuando cambia la posición geocodificada
function MapRecenter({ coords, currentZoom }) {
	const map = useMap();
	useEffect(() => {
		if (coords) {
			map.setView(coords, currentZoom);
		}
	}, [coords, currentZoom, map]);
	return null;
}

export default function AddressMap({ latitude, longitude, zoom = 17 }) {
	const [position, setPosition] = useState(null); // [lat, lon]
	const [displayName, setDisplayName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Por defecto empezamos en una posición neutral (ej. Madrid o el centro del mapa)
	const defaultPosition = [40.416775, -3.70379];

	useEffect(() => {
		if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) return;

		const fetchCoordinates = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
				);
				const data = await response.json();

				setPosition([parseFloat(latitude), parseFloat(longitude)]);

				if (data && data.display_name) {
					setDisplayName(data.display_name);
				} else {
					// Si Nominatim no encuentra una calle exacta, al menos dejamos las coordenadas legibles en el Popup
					setDisplayName(`Lat: ${latitude}, Lon: ${longitude}`);
				}
			} catch (err) {
				setPosition([parseFloat(latitude), parseFloat(longitude)]);
				setDisplayName(`Ubicación de entrega`);
			} finally {
				setLoading(false);
			}
		};

		fetchCoordinates();
	}, [latitude, longitude]);

	return (
		<div className='address-map' style={{ width: '100%', height: '200px', position: 'relative' }}>
			{loading && (
				<div style={overlayStyle}>
					<span>Buscando dirección...</span>
				</div>
			)}
			{error && (
				<div style={{ ...overlayStyle, backgroundColor: 'rgba(255,255,255,0.9)', color: 'red' }}>
					<span>{error}</span>
				</div>
			)}

			<MapContainer
				center={position || defaultPosition}
				zoom={zoom}
				// --- BLOQUEAR INTERACCIÓN Y MOVIMIENTO ---
				dragging={false}           // Desactiva arrastrar el mapa con el ratón/dedo
				zoomControl={false}        // Quita los botones físicos de + y -
				scrollWheelZoom={false}    // Evita que hagan zoom con la rueda del ratón
				doubleClickZoom={false}    // Desactiva el doble clic para acercar
				boxZoom={false}            // Desactiva el zoom por selección de caja
				keyboard={false}           // Desactiva el control del mapa con las flechas del teclado
				touchZoom={false}          // Desactiva el zoom táctil con dos dedos
				style={{ height: '100%', width: '100%', outline: 'solid 2px black' }}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>

				{position && (
					<>
						<Marker position={position} interactive={false}>
							<Popup>{displayName}</Popup>
						</Marker>
						<MapRecenter coords={position} currentZoom={zoom} />
					</>
				)}
			</MapContainer>
		</div>
	);
}

const overlayStyle = {
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: 'rgba(255,255,255,0.7)',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	zIndex: 1000, // Por encima de los controles de Leaflet
	fontFamily: 'sans-serif',
};