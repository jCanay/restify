import { useStore } from "@nanostores/react";
import "./css/register-form.css";
import { useEffect, useState } from "react";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { $registerStore, setRegister } from "../../contexts/registerStore";
import { useAuth } from "../../hooks/useAuth";

function RegisterForm({ isValid, shakeTrigger, error, onBackClick }) {
    const { name, surname, username, email, password, role } =
        useStore($registerStore);
    const registerStore = useStore($registerStore);
    const [emailValid, setEmailValid] = useState(true);
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setRegister({
            ...registerStore,
            [e.target.id]: e.target.value || "",
        });
    };

    const handleBlur = (e) => {
        setRegister({
            ...registerStore,
            [e.target.id]: e.target.value.trim() || "",
        });
    };

    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const validate = () => {
            if (shakeTrigger > 0) {
                setUsernameValid(username.trim().length > 0);
                setEmailValid(email.trim().length > 0);
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
            {error && <p className="register-error">{error}</p>}
            <form id="register-form">
                <div>
                    <label htmlFor="name">Nombre</label>
                    <input
                        key={shakeTrigger}
                        type="text"
                        name="name"
                        id="name"
                        value={name}
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
                        value={surname}
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
                        value={username}
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
                        value={email}
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
