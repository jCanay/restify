import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = "";

export default function MapboxPicker({ onLocationChange }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [lng, setLng] = useState(-3.7); // Madrid
    const [lat, setLat] = useState(40.41);
    const [zoom, setZoom] = useState(15);

    useEffect(() => {
        if (map.current) return; // Inicializar solo una vez

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: zoom,
        });

        // 1. Crear el marcador arrastrable
        marker.current = new mapboxgl.Marker({ draggable: true })
            .setLngLat([lng, lat])
            .addTo(map.current);

        // 2. Evento al terminar de arrastrar
        marker.current.on("dragend", () => {
            const { lng, lat } = marker.current.getLngLat();
            onLocationChange({ lat, lng });
        });

        // 3. Añadir el buscador (Geocodificador)
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false, // No queremos que cree un segundo marcador
            placeholder: "Busca la dirección del restaurante",
        });

        map.current.addControl(geocoder);

        // 4. Sincronizar búsqueda con nuestro marcador
        geocoder.on("result", (e) => {
            const [newLng, newLat] = e.result.center;
            marker.current.setLngLat([newLng, newLat]);
            onLocationChange({ lat: newLat, lng: newLng });
        });

        // 5. Geolocalización automática inicial
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            map.current.flyTo({ center: [longitude, latitude], speed: 1.5 });
            marker.current.setLngLat([longitude, latitude]);
            onLocationChange({ lat: latitude, lng: longitude });
        });
    }, []);

    return (
        <div className="mapbox-wrapper">
            <div
                ref={mapContainer}
                style={{ height: "400px", borderRadius: "1rem" }}
            />
        </div>
    );
}
