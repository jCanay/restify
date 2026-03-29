import "./css/restaurant-radius-form.css";

import LocationPicker from "../LocationPicker/LocationPicker";
import "./css/restaurant-name-form.css";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { $setupDataStore, setSetupDataRadius } from "../../contexts/setupDataStore";

function RestaurantRadiusForm({ onBackClick }) {
	const { radius } = useStore($setupDataStore);

	const handleLocationChange = () => {

	};

	return (
		<div className="restaurant-radius-form">
			<h2 className="text-2xl font-semibold">
				<button type="button" onClick={onBackClick}>
					<ChevronLeft size={20} />
				</button>
				Área de entrega
			</h2>
			<p>
				Selecciona la ubicación tu restaurante y modifica el área
				operativa de entrega.
			</p>

			<LocationPicker
				radius={radius}
				setRadius={setSetupDataRadius}
				height={"200px"}
				onLocationChange={handleLocationChange}
			/>
			{/* <MapboxPicker /> */}
		</div>
	);
}

export default RestaurantRadiusForm;
