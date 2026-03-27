import "./css/restaurant-radius-form.css";

import LocationPicker from "../LocationPicker/LocationPicker";
import MapboxPicker from "../LocationPicker/MapboxPicker";
import "./css/restaurant-name-form.css";
import { ChevronLeft } from "lucide-react";

function RestaurantRadiusForm({ onBackClick }) {
    const handleLocationChange = () => {};

    return (
        <div className="restaurant-radius-form">
            <h2 className="text-3xl font-semibold">
                <button type="button" onClick={onBackClick}>
                    <ChevronLeft />
                </button>
                Área de entrega
            </h2>
            <p>
                Selecciona tu restaurante en el mapa y modifica el área
                operativa de entrega.
            </p>

            <LocationPicker
                height={"200px"}
                onLocationChange={handleLocationChange}
            />
            {/* <MapboxPicker /> */}
        </div>
    );
}

export default RestaurantRadiusForm;
