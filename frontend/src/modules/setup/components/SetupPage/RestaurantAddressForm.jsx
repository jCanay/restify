import { ChevronLeft } from "lucide-react";
import "./css/restaurant-address-form.css";
import { $setupDataStore, setSetupDataAddress } from "../../contexts/setupDataStore";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

function RestaurantAddressForm({ onBackClick, isValid, shakeTrigger }) {
	const { address } = useStore($setupDataStore);
	const [streetValid, setStreetValid] = useState(true);
	const [cityValid, setCityValid] = useState(true);
	const [countryValid, setCountryValid] = useState(true);
	const [zipcodeValid, setZipcodeValid] = useState(true);

	const handleChange = (target) => {
		setSetupDataAddress({ ...address, [target.id]: target.value });
	};

	const handleBlur = (target) => {
		setSetupDataAddress({ ...address, [target.id]: target.value.trim() });

		if (address.street.trim().length > 0) setStreetValid(true);
		else if (shakeTrigger > 0) setStreetValid(false);

		if (address.city.trim().length > 0) setCityValid(true);
		else if (shakeTrigger > 0) setCityValid(false);

		if (address.country.trim().length > 0) setCountryValid(true);
		else if (shakeTrigger > 0) setCountryValid(false);

		if (address.zipcode.trim().length > 0) setZipcodeValid(true);
		else if (shakeTrigger > 0) setZipcodeValid(false);
	};

	useEffect(() => {
		// const validateAddress = () => {
		// 	return address.street.trim().length <= 0
		// 		&& address.city.trim().length <= 0
		// 		&& address.country.trim().length <= 0
		// 		&& address.zipcode.trim().length <= 0;
		// };

		const validate = () => {
			if (shakeTrigger > 0) {
				setStreetValid(address.street.trim().length > 0);
				setCityValid(address.city.trim().length > 0);
				setCountryValid(address.country.trim().length > 0);
				setZipcodeValid(address.zipcode.trim().length > 0);
			}
		};

		validate();
	}, [shakeTrigger, address]);

	return (
		<div className="restaurant-direction-form">
			<h2 className="text-2xl font-semibold">
				<button type="button" onClick={onBackClick}>
					<ChevronLeft size={20} />
				</button>
				Dirección
			</h2>
			<p>Introduce los datos de la dirección de tu restaurante.</p>
			<form>
				<div>
					<label htmlFor="street">Dirección de la calle*</label>
					<input
						key={shakeTrigger}
						required
						type="text"
						name="street"
						className={!streetValid ? "invalid" : ""}
						id="street"
						value={address.street}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target)}
					/>
					{!isValid && !streetValid && <p className="error">Este campo es obligatorio.</p>}
				</div>
				<div>
					<label htmlFor="city">Ciudad*</label>
					<input
						key={shakeTrigger}
						required
						type="text"
						name="city"
						className={!cityValid ? "invalid" : ""}
						id="city"
						value={address.city}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target)}
					/>
					{!isValid && !cityValid && <p className="error">Este campo es obligatorio.</p>}
				</div>
				<div>
					<label required htmlFor="country">País*</label>
					<input
						key={shakeTrigger}
						type="text"
						pattern="\d*"
						name="country"
						className={!countryValid ? "invalid" : ""}
						id="country"
						value={address.country}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target)}
					/>
					{!isValid && !countryValid && <p className="error">Este campo es obligatorio.</p>}
				</div>
				<div>
					<label required htmlFor="zipcode">Código postal*</label>
					<input
						key={shakeTrigger}
						type="number"
						pattern="\d*"
						name="zipcode"
						className={!zipcodeValid ? "invalid" : ""}
						id="zipcode"
						value={address.zipcode}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target)}
					/>
					{!isValid && !zipcodeValid && <p className="error">Este campo es obligatorio.</p>}
				</div>
			</form>
		</div>
	);
}

export default RestaurantAddressForm;
