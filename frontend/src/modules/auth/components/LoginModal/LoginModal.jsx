import { DialogContent } from "@/components/ui/dialog";
import darkBg from "../../../setup/assets/dark-bg.png";
import { useEffect, useState } from "react";
import "./css/login-modal.css";
import LoginForm from "./LoginForm";
import { useStore } from "@nanostores/react";
import { $loginResponseStore, $loginStore } from "../../contexts/loginStore";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

function LoginModal() {
	const [shakeTrigger, setShakeTrigger] = useState(0);
	const { identifier, password } = useStore($loginStore);
	const { login, loading, error } = useAuth();
	const { token, user, account } = useStore($loginResponseStore);

	const isValid = () => {
		return identifier.trim().length > 0 && password.trim().length > 0;
	};

	const handleContinue = async (e) => {
		e.preventDefault();

		if (!isValid()) {
			setShakeTrigger((prev) => prev + 1);
		} else {
			setShakeTrigger(0);
		}

		if (!isValid()) return;

		await login({ identifier, password });
	};

	useEffect(() => {
		console.log(account);
	}, [token, user, account]);

	return (
		<DialogContent className="login-modal">
			<aside>
				<img src={darkBg} alt="" />
			</aside>
			<div className="login-container">
				<div className="step-wrapper">
					<LoginForm
						isValid={isValid()}
						shakeTrigger={shakeTrigger}
						error={error}
					/>
					<button
						form="login-form"
						disabled={loading}
						className={`continue`}
						onClick={handleContinue}
						type="submit"
					>
						<p>Iniciar sesión</p>
						{loading && <Spinner data-icon="inline-start" />}
					</button>
				</div>
			</div>
		</DialogContent>
	);
}

export default LoginModal;
