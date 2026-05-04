import { ChevronLeft } from "lucide-react";
import "./css/restaurant-address-form.css";
import {
    $setupDataStore,
    setSetupDataAddress,
} from "../../contexts/setupDataStore";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

function RestaurantAddressForm({ onBackClick, isValid, shakeTrigger }) {
    const { addresses } = useStore($setupDataStore) || [];
    const [streetAddressValid, setStreetAddressValid] = useState(true);
    const [cityValid, setCityValid] = useState(true);
    const [countryValid, setCountryValid] = useState(true);
    const [zipCodeValid, setZipCodeValid] = useState(true);

    const handleChange = (target) => {
        setSetupDataAddress({ ...addresses?.[0], [target.id]: target.value });
    };

    const handleBlur = (target) => {
        setSetupDataAddress({
            ...addresses?.[0],
            [target.id]: target.value.trim(),
        });
    };

    useEffect(() => {
        const validate = () => {
            if (shakeTrigger > 0) {
                setStreetAddressValid(
                    addresses?.[0].streetAddress.trim().length > 0,
                );
                setCityValid(addresses?.[0].city.trim().length > 0);
                setCountryValid(addresses?.[0].country.trim().length > 0);
                setZipCodeValid(addresses?.[0].zipCode.trim().length > 0);
            }
        };

        validate();
    }, [shakeTrigger, addresses]);

    return (
        <div className="restaurant-direction-form">
            <h2 className="text-2xl font-semibold">
                <button type="button" onClick={onBackClick}>
                    <ChevronLeft size={20} />
                </button>
                Dirección
            </h2>
            <p>Introduce los datos de la dirección de tu restaurante.</p>
            <form id="setup-form">
                <div>
                    <label htmlFor="streetAddress">
                        Dirección de la calle*
                    </label>
                    <input
                        key={shakeTrigger}
                        type="text"
                        name="streetAddress"
                        className={!streetAddressValid ? "invalid" : ""}
                        id="streetAddress"
                        value={addresses?.[0].streetAddress}
                        onChange={(e) => handleChange(e.target)}
                        onBlur={(e) => handleBlur(e.target)}
                    />
                    {!isValid && !streetAddressValid && (
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
                <div>
                    <label htmlFor="city">Ciudad*</label>
                    <input
                        key={shakeTrigger}
                        type="text"
                        name="city"
                        className={!cityValid ? "invalid" : ""}
                        id="city"
                        value={addresses?.[0].city}
                        onChange={(e) => handleChange(e.target)}
                        onBlur={(e) => handleBlur(e.target)}
                    />
                    {!isValid && !cityValid && (
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
                <div>
                    <label required htmlFor="country">
                        País*
                    </label>
                    <input
                        key={shakeTrigger}
                        type="text"
                        pattern="\d*"
                        name="country"
                        className={!countryValid ? "invalid" : ""}
                        id="country"
                        value={addresses?.[0].country}
                        onChange={(e) => handleChange(e.target)}
                        onBlur={(e) => handleBlur(e.target)}
                    />
                    {!isValid && !countryValid && (
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
                <div>
                    <label required htmlFor="zipCode">
                        Código postal*
                    </label>
                    <input
                        key={shakeTrigger}
                        type="number"
                        pattern="\d*"
                        name="zipCode"
                        className={!zipCodeValid ? "invalid" : ""}
                        id="zipCode"
                        value={addresses?.[0].zipCode}
                        onChange={(e) => handleChange(e.target)}
                        onBlur={(e) => handleBlur(e.target)}
                    />
                    {!isValid && !zipCodeValid && (
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default RestaurantAddressForm;
