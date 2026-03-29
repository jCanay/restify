import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import darkBg from "../../../setup/assets/dark-bg.png";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import "./css/register-modal.css";
import RegisterAccountTypeForm from "./RegisterAccountTypeForm";

function RegisterModal() {
	const [index, setIndex] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const [direction, setDirection] = useState("forward");
	const [shakeTrigger, setShakeTrigger] = useState(0);

	const handleBack = () => {
		if (index > 0) {
			setIndex(index - 1);
			setHasStarted(true);
			setDirection("backward");
		}
	};

	const steps = [
		<RegisterAccountTypeForm />,
		<RegisterAccountTypeForm />,
	];

	const isValid = () => {
		switch (index) {
			case 0:
				return true;
			case 1:
				return true;
			default:
				return true;
		}
	};

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

	return <DialogContent className="register-modal">
		<aside>
			<img src={darkBg} alt="" />
		</aside>
		<div className="register-container">
			<div className={`step-wrapper ${getAnimationClass()}`}>
				{steps[index]}
				<button
					className={`continue ${index != steps.length - 1 && "animation"}`}
					onClick={handleContinue}
					type="submit"
				>
					<p>
						{index == steps.length - 1 ? "Finalizar registro" : (
							<>
								Continuar
								<ArrowRight size={14} />
							</>
						)}
					</p>
				</button>
			</div>
		</div>
	</DialogContent>;

}

export default RegisterModal;