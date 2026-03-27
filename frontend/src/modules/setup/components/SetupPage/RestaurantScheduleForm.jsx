import React, { useState } from "react";
import {
    Clock,
    Plus,
    Trash2,
    Sun,
    Moon,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    XCircle,
} from "lucide-react";

const daysOfWeek = [
    { id: 0, name: "Lunes" },
    { id: 1, name: "Martes" },
    { id: 2, name: "Miércoles" },
    { id: 3, name: "Jueves" },
    { id: 4, name: "Viernes" },
    { id: 5, name: "Sábado" },
    { id: 6, name: "Domingo" },
];

function RestaurantScheduleForm({ onSave }) {
    const [openDay, setOpenDay] = useState(0); // Controla qué acordeón está abierto
    const [schedule, setSchedule] = useState(
        daysOfWeek.map((day) => ({
            dayOfWeek: day.id,
            dayName: day.name,
            isClosed: false,
            slots: [{ openTime: "09:00", closeTime: "17:00" }],
        })),
    );

    const toggleDay = (index) => setOpenDay(openDay === index ? null : index);

    const updateDayStatus = (index, e) => {
        e.stopPropagation(); // Evita abrir el acordeón al hacer clic en el checkbox
        const newSchedule = [...schedule];
        newSchedule[index].isClosed = !newSchedule[index].isClosed;
        setSchedule(newSchedule);
    };

    const addSlot = (index) => {
        const newSchedule = [...schedule];
        newSchedule[index].slots.push({
            openTime: "20:00",
            closeTime: "00:00",
        });
        setSchedule(newSchedule);
    };

    const removeSlot = (dayIdx, slotIdx) => {
        const newSchedule = [...schedule];
        newSchedule[dayIdx].slots.splice(slotIdx, 1);
        if (newSchedule[dayIdx].slots.length === 0)
            newSchedule[dayIdx].isClosed = true;
        setSchedule(newSchedule);
    };

    const updateTime = (dayIdx, slotIdx, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[dayIdx].slots[slotIdx][field] = value;
        setSchedule(newSchedule);
    };

    const handleFinalSubmit = () => {
        const payload = schedule.flatMap((day) => {
            if (day.isClosed) {
                return [
                    {
                        typeName: "RECURRING",
                        dayOfWeek: day.dayOfWeek,
                        isClosed: true,
                        openTime: null,
                        closeTime: null,
                    },
                ];
            }
            return day.slots.map((slot) => ({
                typeName: "RECURRING",
                dayOfWeek: day.dayOfWeek,
                openTime: `${slot.openTime}:00`,
                closeTime: `${slot.closeTime}:00`,
                isClosed: false,
            }));
        });
        onSave(payload);
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                    Configura tu rutina
                </h2>
                <p className="text-gray-500 text-sm">
                    Establece los horarios base de tu restaurante.
                </p>
            </div>

            <div className="space-y-3">
                {schedule.map((day, dIdx) => (
                    <div
                        key={day.dayOfWeek}
                        className="border border-gray-100 rounded-2xl overflow-hidden transition-all"
                    >
                        {/* Cabecera del Desplegable */}
                        <div
                            onClick={() => toggleDay(dIdx)}
                            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${openDay === dIdx ? "bg-primary/5" : "hover:bg-gray-50"}`}
                        >
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    checked={!day.isClosed}
                                    onChange={(e) => updateDayStatus(dIdx, e)}
                                    className="w-5 h-5 accent-primary rounded-md"
                                />
                                <span
                                    className={`font-bold text-lg ${day.isClosed ? "text-gray-400 line-through" : "text-gray-800"}`}
                                >
                                    {day.dayName}
                                </span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-14 text-left">
                                    {!day.isClosed && openDay !== dIdx && (
                                        <span className="text-xs font-medium text-gray-400 hidden sm:block">
                                            {`${day.slots.length} turno${day.slots.length > 1 ? "s" : ""}`}
                                        </span>
                                    )}
                                    {day.isClosed && (
                                        <span className="text-xs text-red-400 font-bold uppercase">
                                            Cerrado
                                        </span>
                                    )}
                                </div>
                                {openDay === dIdx ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </div>
                        </div>

                        {/* Contenido del Desplegable */}
                        {openDay === dIdx && !day.isClosed && (
                            <div className="p-4 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-4">
                                    {day.slots.map((slot, sIdx) => (
                                        <div
                                            key={sIdx}
                                            className="flex flex-col sm:flex-row items-center gap-3"
                                        >
                                            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
                                                <Sun
                                                    size={16}
                                                    className="text-orange-400 ml-1"
                                                />
                                                <input
                                                    type="time"
                                                    value={slot.openTime}
                                                    onChange={(e) =>
                                                        updateTime(
                                                            dIdx,
                                                            sIdx,
                                                            "openTime",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="bg-transparent outline-none text-sm font-semibold"
                                                />
                                            </div>
                                            <span className="text-gray-300 font-bold">
                                                a
                                            </span>
                                            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
                                                <Moon
                                                    size={16}
                                                    className="text-indigo-400 ml-1"
                                                />
                                                <input
                                                    type="time"
                                                    value={slot.closeTime}
                                                    onChange={(e) =>
                                                        updateTime(
                                                            dIdx,
                                                            sIdx,
                                                            "closeTime",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="bg-transparent outline-none text-sm font-semibold"
                                                />
                                            </div>
                                            {day.slots.length > 1 && (
                                                <button
                                                    onClick={() =>
                                                        removeSlot(dIdx, sIdx)
                                                    }
                                                    className="text-red-400 hover:bg-red-50 p-2 rounded-full transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addSlot(dIdx)}
                                        className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <Plus size={16} /> Añadir turno partido
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={handleFinalSubmit}
                className="mt-10 w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
                Confirmar horario base <CheckCircle2 size={22} />
            </button>
        </div>
    );
}

export default RestaurantScheduleForm;
