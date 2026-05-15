import { DatesProvider, TimePicker } from "@mantine/dates";
import { ActionIcon, MantineProvider } from "@mantine/core";
import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";
import "./css/input-time-picker.css";
import "dayjs/locale/es";

export default function InputTimePicker({
	label,
	description,
	required = false,
	disabled = false,
	clearable = false,
	readOnly = false,
	defaultValue,
	error,
	presets,
	onTimeChange = () => { },
}) {
	const allowedTimes = [
		{
			label: "Mediodía",
			values: [
				"12:00",
				"12:30",
				"13:00",
				"13:30",
				"14:00",
				"14:30",
				"15:00",
				"15:30",
			],
		},
		{
			label: "Noche",
			values: [
				"20:00",
				"20:30",
				"21:00",
				"21:30",
				"22:00",
				"22:30",
				"23:00",
				"23:30",
			],
		},
	];
	const [dropdownOpened, setDropdownOpened] = useState(false);
	const [time, setTime] = useState(defaultValue || "");

	useEffect(() => {
		onTimeChange(time);
	}, [onTimeChange, time]);

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
				<TimePicker
					className={`input-time-picker ${readOnly ? "read-only" : ""} ${clearable && !readOnly ? "clearable" : ""}`}
					hoursInputLabel="Hours"
					minutesInputLabel="Minutes"
					label={label}
					description={description}
					clearable={clearable && !readOnly}
					required={required}
					disabled={disabled}
					error={error}
					withDropdown
					rightSection={
						<ActionIcon
							onClick={(e) => {
								e.stopPropagation();
								setDropdownOpened(!dropdownOpened);
							}}
							onBlur={() => setDropdownOpened(false)}
							variant="default"
						>
							<ClockIcon size={18} />
						</ActionIcon>
					}
					minutesStep={30}
					value={time}
					onClick={() => {
						if (readOnly) setDropdownOpened(!dropdownOpened);
					}}
					onChange={(value) => {
						if (!value && clearable && !readOnly) {
							setTime("");
							onTimeChange("");
						}

						allowedTimes.forEach((e) => {
							if (e.values.includes(value)) {
								setTime(value);
								onTimeChange(value);
							}
						});

						setDropdownOpened(false);

						if (document.activeElement instanceof HTMLElement) {
							document.activeElement.blur();
						}
					}}
					onBlur={() => setDropdownOpened(false)}
					styles={{
						input: {
							color:
								!readOnly || time ? "inherit" : "transparent",
							"&:focus": {
								backgroundColor: "transparent",
							},
							"&:focusWithin": {
								backgroundColor: "transparent",
							},
						},
						hoursInput: {
							"&:focus": { backgroundColor: "transparent" },
						},
						minutesInput: {
							"&:focus": { backgroundColor: "transparent" },
						},
					}}
					hoursPlaceholder={readOnly ? "" : "--"}
					minutesPlaceholder={readOnly ? "" : "--"}
					hoursInputProps={{
						onKeyDown: blockKeyboard,
						onClick: () => {
							if (readOnly) setDropdownOpened(!dropdownOpened);
						},
						tabIndex: -1,
						style: { pointerEvents: "none" },
					}}
					minutesInputProps={{
						onKeyDown: blockKeyboard,
						onClick: () => {
							if (readOnly) setDropdownOpened(!dropdownOpened);
						},
						tabIndex: -1,
						style: { pointerEvents: "none" },
					}}
					popoverProps={{
						opened: dropdownOpened,
						withinPortal: false,
						trapFocus: false,
						transitionProps: { duration: 100, timingFunction: "" },
					}}
					scrollAreaProps={{
						type: "auto",
						offsetScrollbars: "present",
						scrollbarSize: 6,
					}}
					presets={presets || allowedTimes}
				/>
			</DatesProvider>
		</MantineProvider>
	);
}
