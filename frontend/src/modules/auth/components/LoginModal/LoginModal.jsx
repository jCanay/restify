import { DialogContent } from "@/components/ui/dialog";
import darkBg from "../../../setup/assets/dark-bg.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./css/login-modal.css";
import LoginForm from "./LoginForm";
import { useStore } from "@nanostores/react";
import { $loginResponseStore, $loginStore } from "../../contexts/LoginStore";
import api from "../../../core/api/axios";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

function LoginModal() {
    const [index, setIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [direction, setDirection] = useState("forward");
    const [shakeTrigger, setShakeTrigger] = useState(0);
    const { identifier, password } = useStore($loginStore);
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

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
                return (
                    identifier.trim().length > 0 && password.trim().length > 0
                );
            case 1:
                return;
            default:
                return true;
        }
    };

    const steps = [
        <LoginForm
            isValid={isValid()}
            shakeTrigger={shakeTrigger}
            error={error}
        />,
    ];

    const handleContinue = async () => {
        if (!isValid()) {
            setShakeTrigger((prev) => prev + 1);
        } else {
            setShakeTrigger(0);
        }

        if (index < steps.length - 1 && isValid()) {
            setIndex(index + 1);
            setHasStarted(true);
            setDirection("forward");
        }

        if (!isValid()) return;

        switch (index) {
            case 0:
                await login({ identifier: identifier, password: password });
        }
    };

    const getAnimationClass = () => {
        if (!hasStarted) return "";
        return direction === "forward" ? "animate-forward" : "animate-backward";
    };

    return (
        <DialogContent className="login-modal">
            <aside>
                <img src={darkBg} alt="" />
            </aside>
            <div className="login-container">
                <div className={`step-wrapper ${getAnimationClass()}`}>
                    {steps[index]}

                    <button
                        disabled={loading}
                        className={`continue ${index != steps.length - 1 && "animation"}`}
                        onClick={handleContinue}
                        type="submit"
                    >
                        <p>
                            Iniciar sesión
                            {/* <ArrowRight size={14} /> */}
                        </p>
                        {loading && <Spinner data-icon="inline-start" />}
                    </button>
                </div>
            </div>
        </DialogContent>
    );
}

export default LoginModal;
