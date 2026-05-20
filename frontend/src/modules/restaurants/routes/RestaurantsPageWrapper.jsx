// src/modules/restaurants/routes/RestaurantsPageWrapper.jsx
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import RestaurantsPage from "../pages/RestaurantsPage";
import { useRestaurantsLocation } from "../hooks/useRestaurantsLocation";

export default function RestaurantsPageWrapper() {
    const { countryCode, city } = useParams();
    const navigate = useNavigate();
    const { checkLocationStatus, loading, error } = useRestaurantsLocation();

    // Estados para controlar la validación del backend
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        // TRANFORMAR URL A LOWERCASE
        const hasUppercaseCountry =
            countryCode && countryCode !== countryCode.toLowerCase();
        const hasUppercaseCity = city && city !== city.toLowerCase();

        if (hasUppercaseCountry || hasUppercaseCity) {
            const cleanCountry = countryCode ? countryCode.toLowerCase() : "";
            const cleanCity = city ? city.toLowerCase() : "";

            // Construimos la ruta limpia dependiente de si hay ciudad o no
            const targetUrl = cleanCity
                ? `/${cleanCountry}/${cleanCity}`
                : `/${cleanCountry}`;

            // Redirigimos de inmediato usando { replace: true } para no ensuciar el historial del navegador
            navigate(targetUrl, { replace: true });
            return; // Cortamos la ejecución aquí, el re-render por el cambio de URL se encargará del resto
        }

        const checkLocation = async () => {
            const { countryExists, cityExists, restaurantCount } =
                await checkLocationStatus({ countryCode, city });
            const isLocationValid =
                countryCode && countryExists && (cityExists || !city);

            setIsValid(isLocationValid);
            return;
        };

        checkLocation();
    }, [countryCode, city, navigate, checkLocationStatus]);

    if (loading) return <div>Loading</div>;

    if (!isValid)
        return <button onClick={() => navigate("/")}>Volver al inicio</button>;

    return (
        <RestaurantsPage
            key={`${countryCode?.toLowerCase()}-${city?.toLowerCase()}`}
            countryCode={countryCode?.toLowerCase()}
            city={city?.toLowerCase()}
        />
    );
}
