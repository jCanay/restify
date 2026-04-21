import { useStore } from "@nanostores/react";
import "./css/register-form.css";
import { useEffect, useState } from "react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { $registerStore, setRegister } from "../../contexts/RegisterStore";

function RegisterForm({ isValid, shakeTrigger, error, onBackClick }) {
	const { name, surname, username, email, password, role } = useStore($registerStore);
	const registerStore = useStore($registerStore);
	const [emailValid, setEmailValid] = useState(true);
	const [usernameValid, setUsernameValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);

	const handleChange = (target) => {
		setRegister({
			...registerStore,
			[target.id]: target.value || "",
		});
	};

	const handleBlur = (target) => {
		setRegister({
			...registerStore,
			[target.id]: target.value || "",
		});

		if (username.length > 3) setUsernameValid(true);
		else if (shakeTrigger > 0) setUsernameValid(false);

		if (email.length > 3) setEmailValid(true);
		else if (shakeTrigger > 0) setEmailValid(false);

		if (password.length >= 8) setPasswordValid(true);
		else if (shakeTrigger > 0) setPasswordValid(false);
	};

	useEffect(() => {
		const validate = () => {
			if (shakeTrigger > 0) {
				setUsernameValid(username.trim().length > 3);
				setEmailValid(email.trim().length > 3);
				setPasswordValid(password.trim().length >= 8);
			}
		};

		validate();
	}, [shakeTrigger, username, email, password]);

	return (
		<div className="register-form">
			<DialogTitle className="text-2xl font-semibold">
				<button type="button" onClick={onBackClick}>
					<ChevronLeft size={20} />
				</button>
				Regístrate
			</DialogTitle>
			<DialogDescription>
				Introduce los datos para registrarte
			</DialogDescription>
			{error && (
				<p className="register-error">
					No se ha podido iniciar sesión. Comprueba los datos y vuelve
					a intentarlo de nuevo.
				</p>
			)}
			<form>
				<div>
					<label htmlFor="name">
						Nombre
					</label>
					<input
						key={shakeTrigger}
						required
						type="text"
						name="name"
						id="name"
						value={name}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="name">
						Apellidos
					</label>
					<input
						key={shakeTrigger}
						required
						type="text"
						name="surname"
						id="surname"
						value={surname}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target.value)}
					/>
				</div>
				<div>
					<label htmlFor="identifier">
						Usuario*
					</label>
					<input
						key={shakeTrigger}
						required
						className={!usernameValid ? "invalid" : ""}
						type="text"
						name="username"
						id="username"
						value={username}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target.value)}
					/>
					{!isValid && !usernameValid && (
						<p className="error">Este campo es obligatorio.</p>
					)}
				</div>
				<div>
					<label htmlFor="identifier">
						Correo electrónico*
					</label>
					<input
						key={shakeTrigger}
						required
						className={!emailValid ? "invalid" : ""}
						type="text"
						name="email"
						id="email"
						value={email}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target.value)}
					/>
					{!isValid && !emailValid && (
						<p className="error">Este campo es obligatorio.</p>
					)}
				</div>
				<div>
					<label htmlFor="password">Contraseña*</label>
					<input
						key={shakeTrigger}
						required
						className={!passwordValid ? "invalid" : ""}
						type="text"
						name="password"
						id="password"
						value={password}
						onChange={(e) => handleChange(e.target)}
						onBlur={(e) => handleBlur(e.target.value)}
					/>
					{!isValid && !passwordValid && (
						<p className="error">La contraseña debe tener al menos 8 caracteres</p>
					)}
				</div>
			</form>
		</div>
	);
}

export default RegisterForm;
