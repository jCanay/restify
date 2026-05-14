import TimeAgo from "react-timeago";

const RelativeTime = ({ timestamp }) => {
    if (!timestamp) return <span>---</span>;

    const date = new Date(timestamp);

    const formatter = (value, unit, suffix) => {
        if (unit === "second") return "Ahora mismo";

        const units = {
            minute: "minuto",
            hour: "hora",
            day: "día",
            week: "semana",
            month: "mes",
            year: "año",
        };

        const unitName = units[unit] || unit;
        const plural = value !== 1 ? (unitName === "mes" ? "es" : "s") : "";

        if (suffix === "ago") {
            return `Hace ${value} ${unitName}${plural}`;
        } else {
            return `Dentro de ${value} ${unitName}${plural}`;
        }
    };

    return (
        <TimeAgo
            date={date}
            formatter={formatter}
            live
            title={date.toLocaleString()}
        />
    );
};

export default RelativeTime;
