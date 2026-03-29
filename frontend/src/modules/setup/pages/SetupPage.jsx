import "../css/setup-page.css";
import darkBg from "../assets/dark-bg.png";
import { ArrowRight } from "lucide-react";
import RestaurantNameForm from "../components/SetupPage/RestaurantNameForm";
import RestaurantAddressForm from "../components/SetupPage/RestaurantAddressForm";
import { useState } from "react";
import RestaurantRadiusForm from "../components/SetupPage/RestaurantRadiusForm";
import RestaurantScheduleForm from "../components/SetupPage/RestaurantScheduleForm";
import RestaurantDataConfirmation from "../components/SetupPage/RestaurantDataConfirmation";
import { useStore } from "@nanostores/react";
import { $setupDataStore } from "../contexts/setupDataStore";

function SetupPage() {
	const [index, setIndex] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const [direction, setDirection] = useState("forward");
	const [shakeTrigger, setShakeTrigger] = useState(0);
	const { name, address } = useStore($setupDataStore);

	const handleBack = () => {
		if (index > 0) {
			setIndex(index - 1);
			setHasStarted(true);
			setDirection("backward");
		}
	};

	const isValid = () => {
		switch (index) {
			case 0:
				return name.trim().length > 2;
			case 1:
				return address.city.trim().length > 0 && address.country.trim().length > 0 && address.street.trim().length > 0 && address.zipcode.trim().length > 0;
			// case 2:
			// return address.latitude !== 0;
			default:
				return true;
		}
	};

	const steps = [
		<RestaurantNameForm isValid={isValid()} shakeTrigger={shakeTrigger} />,
		<RestaurantAddressForm isValid={isValid()} onBackClick={handleBack} shakeTrigger={shakeTrigger} />,
		<RestaurantRadiusForm isValid={isValid()} onBackClick={handleBack} shakeTrigger={shakeTrigger} />,
		<RestaurantScheduleForm onBackClick={handleBack} />,
		<RestaurantDataConfirmation onBackClick={handleBack} />
	];

	const handleContinue = () => {
		if (!isValid()) {
			setShakeTrigger(prev => prev + 1);
		} else {
			setShakeTrigger(0);
		}

		if (index < steps.length - 1 && isValid()) {
			setIndex(index + 1);
			setHasStarted(true);
			setDirection("forward");
		}
	};

	const getAnimationClass = () => {
		if (!hasStarted) return "";
		return direction === "forward" ? "animate-forward" : "animate-backward";
	};

	return (
		<main className="setup-page">
			<div className="content">
				<aside>
					<img src={darkBg} alt="" />
				</aside>
				<div className="setup-container">
					<div
						key={index}
						className={`step-wrapper ${getAnimationClass()}`}
					>
						{steps[index]}
						<button
							className={`continue ${index != steps.length - 1 && "animation"}`}
							onClick={handleContinue}
							type="submit"
						>
							<p>
								{index == steps.length - 1 ? (
									"Finalizar configuración"
								) : (
									<>
										Continuar
										<ArrowRight size={14} />
									</>
								)}
							</p>
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}

export default SetupPage;
