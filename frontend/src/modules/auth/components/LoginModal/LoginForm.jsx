import { useStore } from "@nanostores/react";
import { $loginStore, setLogin } from "../../contexts/loginStore";
import "./css/login-form.css";
import { useEffect, useState } from "react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

function LoginForm({ isValid, shakeTrigger, error }) {
    const { identifier, password } = useStore($loginStore);
    const loginStore = useStore($loginStore);
    const [identifierValid, setIdentifierValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setLogin({
            ...loginStore,
            [e.target.id]: e.target.value,
        });
    };

    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
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
            <form id="login-form">
                <div>
                    <label htmlFor="identifier">
                        Usuario o correo electrónico*
                    </label>
                    <input
                        key={shakeTrigger}
                        className={!identifierValid ? "invalid" : ""}
                        type="text"
                        name="identifier"
                        id="identifier"
                        value={identifier}
                        onChange={handleChange}
                        onBlur={handleChange}
                    />
                    {!isValid && !identifierValid && (
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
                <div className="password">
                    <label htmlFor="password">Contraseña*</label>
                    <div>
                        <input
                            autoComplete="on"
                            type={showPassword ? "text" : "password"}
                            key={shakeTrigger}
                            className={!passwordValid ? "invalid" : ""}
                            name="password"
                            id="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleChange}
                        />
                        <button
                            type="button"
                            className="flex absolute right-0 px-3 w-fit items-center h-full hover:bg-transparent cursor-pointer"
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
                        <p className="error">Este campo es obligatorio.</p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
