import "./css/login-form.css";
import { useEffect, useState } from "react";

function LoginForm({ isValid, shakeTrigger }) {
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
		<div className="login-form">
			<h2 className="text-2xl font-semibold">Inicia sesión</h2>
			<p>
				Introduce los datos de tu cuenta para iniciar sesión
			</p>
			<form>
				<div>
					<label htmlFor="name">Usuario o correo electrónico*</label>
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
					{!isValid && !valid && <p className="error">Este campo es obligatorio.</p>}
				</div>
				<div>
					<label htmlFor="name">Contraseña*</label>
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
					{!isValid && !valid && <p className="error">Este campo es obligatorio.</p>}
				</div>
			</form>
		</div>
	);
}

export default LoginForm;
