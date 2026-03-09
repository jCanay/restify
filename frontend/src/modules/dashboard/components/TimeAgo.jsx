import { useState, useEffect, useMemo } from "react";

/**
 * Component to handle Spring Boot JSON dates
 * @param {string} timestamp - The ISO date string from Java (e.g., "2026-03-09T12:00:00")
 */
function TimeAgo({ timestamp }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        let interval;

        // Calculate how many milliseconds until the next full minute
        const msUntilNextMinute = 60000 - (new Date().getTime() % 60000);

        // Sync the first update exactly at the turn of the minute
        const timeout = setTimeout(() => {
            setNow(new Date());

            // Now that we are synced, update every 60 seconds
            interval = setInterval(() => {
                setNow(new Date());
            }, 60000);
        }, msUntilNextMinute);

        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, []);

    const formattedTime = useMemo(() => {
        if (!timestamp) return "---";
        const bookingDate = new Date(timestamp);

        const diffInMs = now.getTime() - bookingDate.getTime();
        const minutes = Math.max(0, Math.floor(diffInMs / 60000));

        const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
        let result = "";

        if (minutes < 1) {
            // English: While it's under 1 minute, we can show "Just now"
            result = "ahora mismo";
        } else if (minutes < 60) {
            result = rtf.format(-minutes, "minute");
        } else if (minutes < 1440) {
            result = rtf.format(-Math.floor(minutes / 60), "hour");
        } else {
            result = rtf.format(-Math.floor(minutes / 1440), "day");
        }

        return result.charAt(0).toUpperCase() + result.slice(1);
    }, [timestamp, now]);

    return <span>{formattedTime}</span>;
}

export default TimeAgo;
