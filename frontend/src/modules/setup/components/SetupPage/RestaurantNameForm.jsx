import "./css/restaurant-name-form.css";
import { useStore } from "@nanostores/react";
import {
    $setupDataStore,
    setSetupDataName,
} from "../../contexts/setupDataStore";
import { useEffect, useState } from "react";

function RestaurantNameForm({ isValid, shakeTrigger }) {
    const { name } = useStore($setupDataStore);
    const [valid, setValid] = useState(true);

    const handleChange = (value) => {
        setSetupDataName(value);
    };

    const handleBlur = (value) => {
        setSetupDataName(value.trim());
        setValid(value.trim().length > 2);
    };

    useEffect(() => {
        const validate = () => {
            if (shakeTrigger > 0 && name.trim().length <= 2) {
                setValid(false);
            } else {
                setValid(true);
            }
        };

        validate();
    }, [shakeTrigger, name]);

    return (
        <div className="restaurant-name-form">
            <h2 className="text-2xl font-semibold">Configura tu restaurante</h2>
            <p>
                Introduce los datos de tu restaurante. Podrás crear restaurantes
                adicionales más tarde.
            </p>
            <form>
                <label htmlFor="name">Nombre del restaurante*</label>
                <input
                    key={shakeTrigger}
                    required
                    className={!valid ? "invalid" : ""}
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={(e) => handleBlur(e.target.value)}
                />
                {!isValid && !valid && (
                    <p className="error">
                        El nombre debe tener al menos 3 caracteres.
                    </p>
                )}
            </form>
        </div>
    );
}

export default RestaurantNameForm;
