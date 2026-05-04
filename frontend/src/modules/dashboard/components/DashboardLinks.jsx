import { useEffect } from "react";
import { useStore } from "../../../../node_modules/@nanostores/react/index";
import {
    Bike,
    BookMarked,
    BookOpenText,
    House,
    Users,
    Utensils,
} from "lucide-react";

import { $dashboardStore } from "../contexts/dashboardStore";
import { NavLink } from "react-router";

export default function DashboardLinks() {
    const { dashboard } = useStore($dashboardStore);

    const pages = {
        bookings: {
            icon: <BookMarked strokeWidth={2} />,
        },
        orders: {
            icon: <Bike strokeWidth={2} />,
        },
        restaurant: {
            icon: <Utensils strokeWidth={2} />,
        },
        menu: {
            icon: <BookOpenText strokeWidth={2} />,
        },
        staff: {
            icon: <Users strokeWidth={2} />,
        },
    };

    return dashboard?.pages?.map((page, index) => (
        <NavLink
            key={index}
            to={`/dashboard${page.slug && "/"}${page.slug}`}
            className="link"
            end
        >
            {pages[page.slug]?.icon || <House strokeWidth={2} />}
            <p>{page.title}</p>
        </NavLink>
    ));
}
