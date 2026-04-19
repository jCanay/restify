import "./css/register-account-type-form.css";
import { useStore } from "@nanostores/react";
import { useEffect, useState } from "react";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function RegisterAccountTypeForm({ isValid, shakeTrigger }) {
    // const { name } = useStore($setupDataStore);
    const [valid, setValid] = useState(true);
    const [value, setValue] = useState("user");

    const handleChange = (value) => {
        // setSetupDataName(value);
    };

    const handleBlur = (value) => {
        // setSetupDataName(value.trim());
        setValid(value.trim().length > 2);
    };

    useEffect(() => {
        console.log(value);
    }, [value]);

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
            <p>Selecciona el tipo de cuenta para registrarte.</p>
            <form>
                <label htmlFor="name">Tipo de cuenta</label>
                <RadioGroup
                    defaultValue="user"
                    className="max-w-sm"
                    value={value}
                    onValueChange={setValue}
                >
                    <FieldLabel htmlFor="user" className="field-label">
                        <Field orientation="horizontal">
                            <FieldContent className="content">
                                <FieldTitle>Usuario</FieldTitle>
                                <FieldDescription>
                                    Cuenta estándar de usuario. Para pedir
                                    comida y reservar.
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="user" id="user" />
                        </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="owner" className="field-label">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Dueño</FieldTitle>
                                <FieldDescription>
                                    Si tienes un restaurante esta es tu cuenta.
                                    Con ella podrás gestionar tu propio
                                    restaurante.
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="owner" id="owner" />
                        </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="rider" className="field-label">
                        <Field orientation="horizontal">
                            <FieldContent>
                                <FieldTitle>Repartidor</FieldTitle>
                                <FieldDescription>
                                    Cuenta para trabajar con nostros como
                                    repartidor de comida.
                                </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value="rider" id="rider" />
                        </Field>
                    </FieldLabel>
                </RadioGroup>
                {!isValid && !valid && (
                    <p className="error">Elige una opción.</p>
                )}
            </form>
        </div>
    );
}

export default RegisterAccountTypeForm;
