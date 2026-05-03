import { useStore } from "@nanostores/react";
import "./css/register-form.css";
import { useEffect, useState } from "react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { $registerStore, setRegister } from "../../contexts/registerStore";
import { useAuth } from "../../hooks/useAuth";

function RegisterForm({ isValid, shakeTrigger, error, onBackClick }) {
	const { user, account, password } = useStore($registerStore);
	const registerStore = useStore($registerStore);
	const [emailValid, setEmailValid] = useState(true);
	const [usernameValid, setUsernameValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		const { id, value } = e.target;

		if (id === "username" || id === "email") {
			setRegister({ user: { [id]: value } });
		} else if (id === "name" || id === "surname") {
			setRegister({ account: { [id]: value } });
		} else {
			setRegister({ [id]: value });
		}
	};

	const handleBlur = (e) => {
		const { id, value } = e.target;

		if (id === "username" || id === "email") {
			setRegister({ user: { [id]: value.trim() } });
		} else if (id === "name" || id === "surname") {
			setRegister({ account: { [id]: value.trim() } });
		} else {
			setRegister({ [id]: value.trim() });
		}
	};

	const handleShowPassword = (e) => {
		e.preventDefault();
		setShowPassword(!showPassword);
	};

	useEffect(() => {
		const validate = () => {
			if (shakeTrigger > 0) {
				setUsernameValid(user.username.trim().length > 0);
				setEmailValid(user.email.trim().length > 0);
				setPasswordValid(password.trim().length >= 8);
			}
		};

		validate();
	}, [shakeTrigger, user, password]);

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
			{error && <p className="register-error">{error}</p>}
			<form id="register-form">
				<div>
					<label htmlFor="name">Nombre</label>
					<input
						key={shakeTrigger}
						type="text"
						name="name"
						id="name"
						value={account.name}
						onChange={handleChange}
						onBlur={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="name">Apellidos</label>
					<input
						key={shakeTrigger}
						type="text"
						name="surname"
						id="surname"
						value={account.surname}
						onChange={handleChange}
						onBlur={handleChange}
					/>
				</div>
				<div>
					<label htmlFor="identifier">Usuario*</label>
					<input
						key={shakeTrigger}
						className={!usernameValid ? "invalid" : ""}
						type="text"
						name="username"
						id="username"
						value={user.username}
						onChange={handleChange}
						onBlur={handleBlur}
					/>
					{!isValid && !usernameValid && (
						<p className="error">Este campo es obligatorio.</p>
					)}
				</div>
				<div>
					<label htmlFor="identifier">Correo electrónico*</label>
					<input
						key={shakeTrigger}
						className={!emailValid ? "invalid" : ""}
						type="text"
						name="email"
						id="email"
						value={user.email}
						onChange={handleChange}
						onBlur={handleChange}
					/>
					{!isValid && !emailValid && (
						<p className="error">Este campo es obligatorio.</p>
					)}
				</div>
				<div className="password">
					<label htmlFor="password">Contraseña*</label>
					<div key={shakeTrigger}>
						<input
							autoComplete="on"
							type={showPassword ? "text" : "password"}
							className={!passwordValid ? "invalid" : ""}
							name="password"
							id="password"
							value={password}
							onChange={handleChange}
							onBlur={handleChange}
						/>
						<button
							type="button"
							className="flex absolute right-0 px-3 items-center h-full hover:bg-transparent cursor-pointer"
							onClick={(e) => handleShowPassword(e)}
						>
							{showPassword ? (
								<EyeOff
									size={20}
									className="w-13 text-muted-foreground"
								/>
							) : (
								<Eye
									size={20}
									className="w-13 text-muted-foreground"
								/>
							)}
						</button>
					</div>
					{!isValid && !passwordValid && (
						<p className="error">
							La contraseña debe tener al menos 8 caracteres.
						</p>
					)}
				</div>
			</form>
		</div>
	);
}

export default RegisterForm;
