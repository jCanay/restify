import { LocateFixed } from "lucide-react"; // Usamos un icono elegante

function CurrentLocationButton({ setPosition, onLocationChange, map }) {
    const handleLocate = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización");
            return;
        }

        // Mostramos un feedback visual o loading si quieres
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newCoords = { lat: latitude, lng: longitude };

                // 1. Actualizamos el estado local del Picker
                setPosition(newCoords);

                // 2. Notificamos al padre (Restify Store/Database)
                if (onLocationChange) onLocationChange(newCoords);

                // 3. Movemos la cámara del mapa con suavidad
                if (map) {
                    map.flyTo([latitude, longitude], 17, { duration: 1.5 });
                }
            },
            (error) => {
                console.error("Error al obtener ubicación:", error);
                alert(
                    "No pudimos obtener tu ubicación. Revisa los permisos de tu navegador.",
                );
            },
            { enableHighAccuracy: true },
        );
    };

    return (
        <button
            onClick={handleLocate}
            type="button"
            title="Usar mi ubicación actual"
            style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                zIndex: 1000,
                backgroundColor: "white",
                border: "none",
                borderRadius: "50%",
                width: "45px",
                height: "45px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                cursor: "pointer",
                transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            <LocateFixed size={20} color="#CBA17D" />{" "}
            {/* Color bronce de tu diseño premium */}
        </button>
    );
}

export default CurrentLocationButton;
