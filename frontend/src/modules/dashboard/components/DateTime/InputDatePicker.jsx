import { DateInput, DatesProvider } from "@mantine/dates";
import { ActionIcon, MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import "dayjs/locale/es";
import { addDays, addMonths, endOfMonth, isSameDay } from "date-fns";
import "./css/input-date-picker.css";

export default function InputDatePicker({
	label,
	description,
	required = false,
	disabled = false,
	clearable = false,
	readOnly = false,
	defaultValue,
	excludedDates = [],
	error,
	placeholder,
	onDateChange = () => { },
	shakeTrigger,
}) {
	const [dropdownOpened, setDropdownOpened] = useState(false);
	const [date, setDate] = useState(defaultValue || null);
	const [isValid, setIsValid] = useState(true);

	useEffect(() => {
		onDateChange(date);

		const validate = () => {
			if (shakeTrigger > 0 && required) {
				setIsValid(!isNaN(Date.parse(date)));
			}
		};

		validate();
	}, [date, onDateChange, shakeTrigger]);

	const blockKeyboard = (e) => {
		if (!readOnly) return;

		if (
			[
				"Tab",
				"Escape",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight",
			].includes(e.key)
		) {
			return;
		}
		e.preventDefault();
	};

	return (
		<MantineProvider>
			<DatesProvider settings={{ locale: "es" }}>
				<DateInput
					key={shakeTrigger}
					className={`input-date-picker ${readOnly ? "read-only" : ""} ${!isValid ? "invalid" : ""}`}
					locale="es"
					label={label}
					description={description}
					placeholder={placeholder}
					required={required}
					disabled={disabled}
					minDate={new Date()}
					maxDate={endOfMonth(addMonths(new Date(), 3))}
					excludeDate={(date) =>
						excludedDates.some((d) => isSameDay(date, d))
					}
					clearable={!readOnly && clearable}
					highlightToday
					maxLevel="year"
					error={required ? error : ""}
					rightSection={
						<ActionIcon
							onClick={(e) => {
								e.stopPropagation();
								setDropdownOpened(!dropdownOpened);
							}}
							onBlur={() => setDropdownOpened(false)}
							variant="default"
						>
							<Calendar size={18} />
						</ActionIcon>
					}
					popoverProps={{
						trapFocus: false,
						withinPortal: false,
						opened: dropdownOpened,
					}}
					value={date}
					valueFormat="LL"
					onKeyDown={blockKeyboard}
					onClick={() => setDropdownOpened(!dropdownOpened)}
					onBlur={() => setDropdownOpened(false)}
					onChange={(value) => {
						if (!value) {
							setDate(null);
							onDateChange(null);
							return;
						}

						setDate(new Date(value));
						onDateChange(new Date(value));

						setDropdownOpened(false);

						if (document.activeElement instanceof HTMLElement) {
							document.activeElement.blur();
						}
					}}
				/>
			</DatesProvider>
		</MantineProvider>
	);
}
