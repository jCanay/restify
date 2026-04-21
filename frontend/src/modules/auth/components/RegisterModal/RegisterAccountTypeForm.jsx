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
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

function RegisterAccountTypeForm({ isValid, shakeTrigger }) {
	// const { name } = useStore($setupDataStore);
	const [valid, setValid] = useState(true);
	const [value, setValue] = useState("user");

	const accountTypes = [
		{
			type: "user",
			title: "Usuario",
			description: "Cuenta estándar para pedir y reservar."
		},
		{
			type: "owner",
			title: "Dueño",
			description: "Gestiona tu propio restaurante."
		},
		{
			type: "rider",
			title: "Repartidor",
			description: "Trabaja con nosotros como repartidor."
		}
	];

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
			<DialogTitle className="text-2xl font-semibold">
				Tipo de cuenta
			</DialogTitle>
			<DialogDescription>
				Selecciona el tipo de cuenta para registrarte.
			</DialogDescription>
			<form>
				<label htmlFor="name">Tipo de cuenta</label>
				<RadioGroup
					defaultValue="user"
					className="max-w-sm"
					value={value}
					onValueChange={setValue}
				>
					{accountTypes.map((e, i) => (
						<FieldLabel key={i} htmlFor={e.type} className="field-label">
							<Field orientation="horizontal">
								<FieldContent className="content">
									<FieldTitle>{e.title}</FieldTitle>
									<FieldDescription>{e.description}</FieldDescription>
								</FieldContent>
								<RadioGroupItem className="radio" value={e.type} id={e.type} />
							</Field>
						</FieldLabel>
					))}
				</RadioGroup>
				{!isValid && !valid && (
					<p className="error">Elige una opción.</p>
				)}
			</form>
		</div>
	);
}

export default RegisterAccountTypeForm;
