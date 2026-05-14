// GridDayPickerEditor.jsx
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import "./grid-day-picker-editor.css";

export const GridDayPickerEditor = (props) => {
	console.log(props);

	const [selectedDate, setSelectedDate] = useState(() => {
		return props.value ? parse(props.value, "dd/MM/yyyy", new Date()) : new Date();
	});

	const handleSelect = (date) => {
		if (!date) return;

		const newDateStr = format(date, "dd/MM/yyyy");
		props.node.setDataValue(props.column.getColId(), newDateStr);
		setSelectedDate(date);
		props.stopEditing();
	};

	const addMonths = (date, months) => {
		const newDate = new Date(date);
		newDate.setMonth(newDate.getMonth() + months);
		return newDate;
	};

	return (
		<DayPicker
			mode="single"
			locale={es}
			selected={selectedDate}
			onSelect={handleSelect}
			showOutsideDays
			disabled={{ before: new Date() }}
			startMonth={new Date()}
			endMonth={addMonths(new Date(), 3)}
			animate
			className="shadow-2xl grid-day-picker-editor"
		/>
	);
};