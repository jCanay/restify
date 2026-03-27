import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const OperativeRadiusMapArea = ({ position, radius }) => {
    const map = useMap();
    // Usamos una referencia para no recrear el círculo innecesariamente
    const circleRef = useRef(null);

    useEffect(() => {
        if (!map) return;

        // 1. Limpiamos el círculo anterior si existe
        if (circleRef.current) {
            map.removeLayer(circleRef.current);
        }

        // 2. Si no hay posición o radio, no dibujamos nada
        if (!position || !radius || radius <= 0) return;

        // 3. Creamos el nuevo círculo con estilo
        const newCircle = L.circle([position.lat, position.lng], {
            radius: radius,
            color: "#5095FF",
            fillColor: "#90D5FF",
            fillOpacity: 0.25,
            weight: 2.5,
            dashArray: "10, 10",
        });

        // 4. Lo añadimos al mapa y guardamos la referencia
        newCircle.addTo(map);
        circleRef.current = newCircle;

        // 5. Ajustamos el zoom del mapa para que quepa todo el círculo
        map.fitBounds(newCircle.getBounds(), { padding: [10, 10] }); // Opcional, puede ser intrusivo

        // Cleanup function para cuando el componente se desmonte
        return () => {
            if (circleRef.current) {
                map.removeLayer(circleRef.current);
            }
        };
    }, [map, position, radius]); // Se ejecuta al cambiar mapa, posición o radio

    return null;
};

export default OperativeRadiusMapArea;
