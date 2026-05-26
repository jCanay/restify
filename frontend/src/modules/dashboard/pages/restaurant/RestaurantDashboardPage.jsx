import { CalendarCog, Edit, Info } from "lucide-react";
import "./css/restaurant-dashboard-page.css";
import { useEffect, useState } from "react";
import WeekSchedule from "../../components/WeekSchedule/WeekSchedule";
import { isEqual } from "lodash";

const DEFAULT_SCHEDULE = [
    {
        dayOfWeek: 1,
        isClosed: false,
        slots: [{ openTime: "08:00", closeTime: "23:59" }],
    },
    { dayOfWeek: 2, isClosed: true, slots: [] },
    { dayOfWeek: 3, isClosed: true, slots: [] },
    { dayOfWeek: 4, isClosed: true, slots: [] },
    { dayOfWeek: 5, isClosed: true, slots: [] },
    { dayOfWeek: 6, isClosed: true, slots: [] },
    { dayOfWeek: 7, isClosed: true, slots: [] },
];

export default function RestaurantDashboardPage() {
    const [ogSchedule, setOgSchedule] = useState(DEFAULT_SCHEDULE);
    const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);

    const [changed, setChanged] = useState(false);

    useEffect(() => {
        const enoocCalvo = () => {
            setChanged(!isEqual(ogSchedule, schedule));
        };
        enoocCalvo();
    }, [schedule, ogSchedule, setChanged]);

    useEffect(() => {
        console.log(changed);
    }, [changed]);

    const handleCancel = () => {
        setSchedule(ogSchedule);
    };

    return (
        <div className="restaurant-dashboard-page">
            <section className="event">
                <CalendarCog size={32} />
                <div className="content">
                    <h3>
                        ¿Necesitas realizar un cambio puntual en tu horario de
                        apertura?
                    </h3>
                    <p>
                        Prepárate para un próximo cierre o cambio en el horario
                        de apertura modificándolo para días específicos.
                    </p>
                </div>
                <button type="button">
                    Editar disponibilidad
                    <Edit />
                </button>
            </section>
            <section className="opening-hours">
                <div className="hours">
                    <header>
                        <h3>Horario semanal de apertura</h3>
                        <p>
                            Los clientes esperan que todos los pedidos o
                            reservas se acepten durante estas horas. Esto puede
                            significar que el horario de apertura de Restify
                            difiera ligeramente de tu horario comercial
                            habitual.
                        </p>
                    </header>
                    <div className="info">
                        <Info />
                        Nuestros repartidores están disponibles de 8:00 a 23:59.
                    </div>
                    <div className="schedule">
                        <WeekSchedule
                            schedule={schedule}
                            setSchedule={setSchedule}
                        />
                    </div>
                </div>
                <div className="save">
                    <button type="button" disabled={!changed}>
                        Guardar cambios
                    </button>
                    <button
                        type="button"
                        style={{ display: `${!changed ? "none" : "flex"}` }}
                        className="cancel"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </section>
        </div>
    );
}
