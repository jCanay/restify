import { Minus, Plus, Trash } from "lucide-react";
import "./css/stepper.css";

export default function Stepper({ className = "", onValueChange = () => { }, showValueOnMin = true, showDeleteButton = false, value = 1, minValue = 1, maxValue = 9 }) {
	const handlePlusClick = (e) => {
		e.stopPropagation();
		if (value >= maxValue) return;

		onValueChange(value + 1);
	};

	const handleMinusClick = (e) => {
		e.stopPropagation();
		if (value <= minValue) return;

		onValueChange(value - 1);
	};

	return (
		<div className={`stepper ${className}${(showValueOnMin ? true : value !== minValue) ? "" : "zero"}`} onClick={(e) => e.stopPropagation()}>
			{(showValueOnMin ? true : value !== minValue) && (
				<>
					<button onClick={handleMinusClick} disabled={value <= minValue} className={`${showDeleteButton && value === minValue + 1 ? "delete" : ""}`}>
						{showDeleteButton && value === minValue + 1 ? (
							<Trash strokeWidth={2} size={18} />
						) : (
							<Minus strokeWidth={1.75} />
						)}
					</button>
					<span>{value}</span>
				</>
			)}
			<button onClick={handlePlusClick} disabled={value >= maxValue}>
				<Plus strokeWidth={1.75} />
			</button>
		</div>
	);
}