import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip";
import "./css/schedule-form.css";
import { ChevronDown, ClockPlus, Trash2 } from "lucide-react";
import { useStore } from "@nanostores/react";
import { $setupDataStore, setSetupDataSchedule } from "../../contexts/setupDataStore";

function ScheduleForm({ modifiable = false, expanded = false }) {
	const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
	const { schedule } = useStore($setupDataStore);

	const handleAddClick = (dayIndex) => {
		const newSchedule = [...schedule];

		if (newSchedule[dayIndex].isClosed) {
			newSchedule[dayIndex].isClosed = false;
		}

		newSchedule[dayIndex].slots.push({ openTime: "00:00", closeTime: "00:00" });
		setSetupDataSchedule(newSchedule);
	};

	const handleRemoveClick = (dayIndex, slotIndex) => {
		const newSchedule = [...schedule];
		newSchedule[dayIndex].slots.splice(slotIndex, 1);

		if (newSchedule[dayIndex].slots.length === 0) {
			newSchedule[dayIndex].isClosed = true;
		}

		setSetupDataSchedule(newSchedule);
	};

	const handleTimeChange = (dayIndex, slotIndex, field, value) => {
		const newSchedule = [...schedule];
		newSchedule[dayIndex].slots[slotIndex][field] = value;
		setSetupDataSchedule(newSchedule);
	};

	return <div className={`schedule-form ${expanded && "expanded"}`}>
		{schedule.map((day, dayIndex) => (
			<Tooltip key={dayIndex}>
				<DropdownMenu>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<button className={`${day.isClosed && "closed"}`}>{days[day.dayOfWeek]} {!day.isClosed || modifiable ? <ChevronDown size={16} /> : ""}</button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent className="schedule-form-tooltip">
						<p>{day.isClosed ? "Cerrado" : `${day.slots.length} turno${day.slots.length > 1 ? "s" : ""}`}</p>
					</TooltipContent>
					{modifiable || !day.isClosed ? <DropdownMenuContent className={`schedule-form-content`}>
						{!day.isClosed ? (
							<>
								<div className={`time ${expanded && "expanded"}`}>
									{day.slots.map((slot, slotIndex) => (
										<div key={slotIndex} className="times">
											{modifiable
												? (
													<div className="opening-times-form">
														<input type="time" value={slot.openTime} onChange={(e) => handleTimeChange(dayIndex, slotIndex, "openTime", e.target.value)} />
														<p>a</p>
														<input type="time" value={slot.closeTime} onChange={(e) => handleTimeChange(dayIndex, slotIndex, "closeTime", e.target.value)} />
														<button className="delete" type="button" onClick={() => handleRemoveClick(dayIndex, slotIndex)}><Trash2 size={16} /></button>
													</div>
												) : (
													<div className="opening-times">{`${slot.openTime} - ${slot.closeTime}`}</div>
												)}
										</div>
									))}
								</div>
							</>
						) : (
							<div className="italic text-destructive">Cerrado</div>
						)}

						{modifiable && day.slots.length < 8 && <button className="add" onClick={() => handleAddClick(dayIndex)}>Añadir turno <ClockPlus size={14} /></button>}

					</DropdownMenuContent> : ""}
				</DropdownMenu>
			</Tooltip>
		))}
	</div>;
}

export default ScheduleForm;;