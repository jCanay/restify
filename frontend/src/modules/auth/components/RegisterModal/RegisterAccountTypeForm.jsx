import "./css/register-account-type-form.css";
import { useStore } from "@nanostores/react";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    $registerStore,
    setRegisterRoleName,
} from "../../contexts/registerStore";

function RegisterAccountTypeForm() {
    const { role } = useStore($registerStore);

    const accountTypes = [
        {
            type: "ROLE_USER",
            title: "Usuario",
            description: "Cuenta estándar para pedir y reservar.",
        },
        {
            type: "ROLE_OWNER",
            title: "Dueño",
            description: "Gestiona tu propio restaurante.",
        },
        {
            type: "ROLE_RIDER",
            title: "Repartidor",
            description: "Trabaja con nosotros como repartidor.",
        },
    ];

    const handleChange = (value) => {
        setRegisterRoleName(value);
    };

    return (
        <div className="register-account-type-form">
            <DialogTitle className="text-2xl font-semibold">
                Tipo de cuenta
            </DialogTitle>
            <DialogDescription>
                Selecciona el tipo de cuenta para registrarte.
            </DialogDescription>
            <form id="register-form">
                <label htmlFor="name">Tipo de cuenta</label>
                <RadioGroup
                    defaultValue={role.name}
                    className="max-w-sm"
                    value={role.name}
                    onValueChange={handleChange}
                >
                    {accountTypes.map((e, i) => (
                        <FieldLabel
                            key={i}
                            htmlFor={e.type}
                            className="field-label"
                        >
                            <Field orientation="horizontal">
                                <FieldContent className="content">
                                    <FieldTitle>{e.title}</FieldTitle>
                                    <FieldDescription>
                                        {e.description}
                                    </FieldDescription>
                                </FieldContent>
                                <RadioGroupItem
                                    className="radio"
                                    value={e.type}
                                    id={e.type}
                                />
                            </Field>
                        </FieldLabel>
                    ))}
                </RadioGroup>
            </form>
        </div>
    );
}

export default RegisterAccountTypeForm;
