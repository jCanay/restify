import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
	Bike,
	BookMarked,
	BookOpenText,
	House,
	Users,
	Utensils,
} from "lucide-react";

import { $dashboardStore } from "../../contexts/dashboardStore";
import { NavLink } from "react-router";

export default function DashboardLinks() {
	const { dashboard } = useStore($dashboardStore);
	const sortedPages = dashboard?.pages?.sort(
		(p1, p2) => p1.sortOrder - p2.sortOrder,
	);

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

	return sortedPages?.map((page, index) => (
		<NavLink
			key={index}
			to={(page.slug == "staff" || !page.slug) ? `${window.location.href}` : `/dashboard${page.slug && "/"}${page.slug}`}
			className="link"
			end={!page.slug}
			aria-disabled={page.slug == "staff" || !page.slug}
		>
			{pages[page.slug]?.icon || <House strokeWidth={2} />}
			<p>{page.title}</p>
		</NavLink>
	));
}
