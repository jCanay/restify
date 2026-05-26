import { useEffect } from "react";
import "./css/week-schedule.css";
import { Plus, Trash2 } from "lucide-react";

export default function WeekSchedule({
    schedule = [],
    setSchedule = () => {},
}) {
    const weekDays = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
    ];

    const handleOpenChange = (e, index) => {
        const checked = e.target.checked;
        const newSchedule = structuredClone(schedule);

        newSchedule[index].isClosed = !checked;

        if (checked && newSchedule[index].slots.length === 0) {
            newSchedule[index].slots.push({
                openTime: "08:00",
                closeTime: "23:59",
            });
        }

        setSchedule(newSchedule);
    };

    const handleValueChange = (dayIndex, slotIndex, field, value) => {
        const newSchedule = structuredClone(schedule);
        const currentSlot = newSchedule[dayIndex].slots[slotIndex];
        currentSlot[field] = value;
        setSchedule(newSchedule);
    };

    const handleTimeChange = (dayIndex, slotIndex, field, value) => {
        const newSchedule = structuredClone(schedule);
        const currentSlot = newSchedule[dayIndex].slots[slotIndex];

        if (
            field === "closeTime" &&
            getTotalMinutes(currentSlot.openTime) < getTotalMinutes(value)
        ) {
            currentSlot[field] = value;
        } else {
            currentSlot[field] = currentSlot.openTime;
        }

        if (
            field === "openTime" &&
            getTotalMinutes(currentSlot.closeTime) > getTotalMinutes(value)
        ) {
            currentSlot[field] = value;
        } else {
            currentSlot[field] = currentSlot.closeTime;
        }

        setSchedule(newSchedule);
    };

    const getTotalMinutes = (time) => {
        const hour = Number.parseInt(time.split(":")[0]) * 60;
        const minute = Number.parseInt(time.split(":")[1]);
        return hour + minute;
    };

    const handleAddClick = (dayIndex) => {
        const newSchedule = structuredClone(schedule);

        if (newSchedule[dayIndex].isClosed) {
            newSchedule[dayIndex].isClosed = false;
        }

        newSchedule[dayIndex].slots.push({
            openTime: "08:00",
            closeTime: "23:59",
        });
        setSchedule(newSchedule);
    };

    const handleRemoveClick = (dayIndex, slotIndex) => {
        const newSchedule = structuredClone(schedule);
        newSchedule[dayIndex].slots.splice(slotIndex, 1);

        if (newSchedule[dayIndex].slots.length === 0) {
            newSchedule[dayIndex].isClosed = true;
        }

        setSchedule(newSchedule);
    };

    return (
        <div className="week-schedule">
            {schedule.map((day, i) => (
                <li key={i}>
                    <input
                        type="checkbox"
                        name=""
                        id={i}
                        checked={!day.isClosed}
                        onChange={(e) => handleOpenChange(e, i)}
                    />
                    <label htmlFor={i}>{weekDays[i]}</label>
                    {day.isClosed ? (
                        <span>Cerrado</span>
                    ) : (
                        <div className="times">
                            <ul>
                                {day.slots.map((slot, index) => (
                                    <li key={index}>
                                        <input
                                            type="time"
                                            name=""
                                            id=""
                                            value={slot.openTime}
                                            onChange={(e) =>
                                                handleValueChange(
                                                    i,
                                                    index,
                                                    "openTime",
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={(e) =>
                                                handleTimeChange(
                                                    i,
                                                    index,
                                                    "openTime",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        a
                                        <input
                                            type="time"
                                            name=""
                                            id=""
                                            value={slot.closeTime}
                                            onChange={(e) =>
                                                handleValueChange(
                                                    i,
                                                    index,
                                                    "closeTime",
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={(e) =>
                                                handleTimeChange(
                                                    i,
                                                    index,
                                                    "closeTime",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveClick(i, index)
                                            }
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                type="button"
                                onClick={() => handleAddClick(i)}
                            >
                                <Plus size={18} />
                                Añadir turno
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </div>
    );
}
