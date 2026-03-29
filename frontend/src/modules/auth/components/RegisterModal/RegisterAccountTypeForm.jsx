import "./css/register-account-type-form.css";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";

function RegisterAccountTypeForm({ isValid, shakeTrigger }) {
	// const { name } = useStore($setupDataStore);
	const [valid, setValid] = useState(true);

	const handleChange = (value) => {
		// setSetupDataName(value);
	};

	const handleBlur = (value) => {
		// setSetupDataName(value.trim());
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
	}, [shakeTrigger]);

	return (
		<div className="register-account-type-form">
			<h2 className="text-2xl font-semibold">Tipo de cuenta</h2>
			<p>
				Selecciona el tipo de cuenta para registrarte.
			</p>
			<form>
				<label htmlFor="name">Tipo de cuenta</label>
				{/* <input
					key={shakeTrigger}
					required
					className={!valid ? "invalid" : ""}
					type="text"
					name="name"
					id="name"
					value={name}
					onChange={(e) => handleChange(e.target.value)}
					onBlur={(e) => handleBlur(e.target.value)}
				/> */}
				{!isValid && !valid && <p className="error">Elige una opción.</p>}
			</form>
		</div>
	);
}

export default RegisterAccountTypeForm;
