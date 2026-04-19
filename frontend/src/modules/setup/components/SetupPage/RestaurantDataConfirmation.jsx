import { ChevronLeft } from "lucide-react";
import "./css/restaurant-data-confirmation.css";
import ScheduleForm from "../ScheduleForm/ScheduleForm";
import { useStore } from "@nanostores/react";
import {
    $hasAnimatedConfirmation,
    $setupDataStore,
} from "../../contexts/setupDataStore";
import { useEffect, useState } from "react";

function RestaurantDataConfirmation({ onBackClick }) {
    const { name, address, radius } = useStore($setupDataStore);
    const hasAnimated = useStore($hasAnimatedConfirmation);
    const [shouldAnimate] = useState(!hasAnimated);

    useEffect(() => {
        if (!hasAnimated) {
            $hasAnimatedConfirmation.set(true);
        }
    }, [hasAnimated]);

    return (
        <div className="restaurant-data-confirmation">
            <h2 className="text-2xl font-semibold">
                <button type="button" onClick={onBackClick}>
                    <ChevronLeft size={20} />
                </button>
                Confirma los datos
            </h2>
            <p>
                Revisa los datos de tu restaurante. Puedes volver atrás si lo
                necesitas.
            </p>
            <form className={`${shouldAnimate && "animated"} `}>
                <div className="name">
                    <label>Nombre del restaurante</label>
                    <p>{!name ? "[Nombre del restaurante]" : name}</p>
                </div>
                <div className="street">
                    <label>Dirección de la calle</label>
                    <p>
                        {!address.street
                            ? "[Dirección de la calle]"
                            : address.street}
                    </p>
                </div>
                <div className="city">
                    <label>Ciudad</label>
                    <p>{!address.city ? "[Ciudad]" : address.city}</p>
                </div>
                <div className="country">
                    <label>País</label>
                    <p>{!address.country ? "[País]" : address.country}</p>
                </div>
                <div className="postalCode">
                    <label>Código postal</label>
                    <p>
                        {!address.zipcode ? "[Código postal]" : address.zipcode}
                    </p>
                </div>
                <div className="radius">
                    <label>Área de entrega</label>
                    <p>{!radius ? "[Área de entrega]" : radius} m</p>
                </div>
                <div className="schedule">
                    <label>Horario</label>
                    <ScheduleForm />
                </div>
            </form>
        </div>
    );
}

export default RestaurantDataConfirmation;
