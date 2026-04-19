import { useStore } from "@nanostores/react";
import { $loginStore, setLogin } from "../../contexts/LoginStore";
import "./css/login-form.css";
import { useEffect, useState } from "react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

function LoginForm({ isValid, shakeTrigger, error }) {
    const { identifier, password } = useStore($loginStore);
    const loginStore = useStore($loginStore);
    const [identifierValid, setIdentifierValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const handleChange = (target) => {
        setLogin({
            ...loginStore,
            [target.id]: target.value,
        });
    };

    const handleBlur = (target) => {
        setLogin({
            ...loginStore,
            [target.id]: target.value || "",
        });

        if (identifier.length > 0) setIdentifierValid(true);
        else if (shakeTrigger > 0) setIdentifierValid(false);

        if (password.length > 0) setPasswordValid(true);
        else if (shakeTrigger > 0) setPasswordValid(false);
    };

    useEffect(() => {
        const validate = () => {
            if (shakeTrigger > 0) {
                setIdentifierValid(identifier.trim().length > 0);
                setPasswordValid(password.trim().length > 0);
            }
        };

        validate();
    }, [shakeTrigger, identifier, password]);

    return (
        <div className="login-form">
            <DialogTitle className="text-2xl font-semibold">
                Inicia sesión
            </DialogTitle>
            <DialogDescription>
                Introduce los datos de tu cuenta para iniciar sesión
            </DialogDescription>
            {error && (
                <p className="login-error">
                    No se ha podido iniciar sesión. Comprueba los datos y vuelve
                    a intentarlo de nuevo.
                </p>
            )}
            <form>
                <div>
                    <label htmlFor="identifier">
                        Usuario o correo electrónico*
                    </label>
                    <input
                        key={shakeTrigger}
                        required
                        className={!identifierValid ? "invalid" : ""}
                        type="text"
                        name="identifier"
                        id="identifier"
                        value={identifier}
                        onChange={(e) => handleChange(e.target)}
                        onBlur={(e) => handleBlur(e.target.value)}
                    />
                    {!isValid && !identifierValid && (
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
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
