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
    const { name, addresses, deliveryRadius } = useStore($setupDataStore) || {};
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
            <form id="setup-form" className={`${shouldAnimate && "animated"} `}>
                <div className="name">
                    <label>Nombre del restaurante</label>
                    <p>{!name ? "[Nombre del restaurante]" : name}</p>
                </div>
                <div className="streetAddress">
                    <label>Dirección de la calle</label>
                    <p>
                        {!addresses[0].streetAddress
                            ? "[Dirección de la calle]"
                            : addresses[0].streetAddress}
                    </p>
                </div>
                <div className="city">
                    <label>Ciudad</label>
                    <p>{!addresses[0].city ? "[Ciudad]" : addresses[0].city}</p>
                </div>
                <div className="country">
                    <label>País</label>
                    <p>
                        {!addresses[0].country
                            ? "[País]"
                            : addresses[0].country}
                    </p>
                </div>
                <div className="postalCode">
                    <label>Código postal</label>
                    <p>
                        {!addresses[0].zipCode
                            ? "[Código postal]"
                            : addresses[0].zipCode}
                    </p>
                </div>
                <div className="radius">
                    <label>Área de entrega</label>
                    <p>
                        {!deliveryRadius ? "[Área de entrega]" : deliveryRadius}{" "}
                        m
                    </p>
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
