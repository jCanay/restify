import { BookMarked, GripVertical } from "lucide-react";
import "./css/booking-last.css";
import BookingLastCard from "./BookingLastCard";
import { useEffect, useState } from "react";
import { useBookings } from "@/modules/dashboard/hooks/useBooking";
import { $userStore, getUserDefaultRestaurant } from "@/modules/dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";

function BookingLast() {
	const { getAllBookingsByRestaurantId, loading, error } = useBookings();
	const { user } = useStore($userStore);
	const [bookings, setBookings] = useState([]);

	useEffect(() => {
		const loadBookings = async () => {
			try {
				const response = await getAllBookingsByRestaurantId(getUserDefaultRestaurant()?.id, { page: 0, size: 100, sort: "createdAt,desc" });
				setBookings(response?.content);
				console.log(response);

			} catch (err) {
				console.error(err);
			}
		};

		loadBookings();
	}, [getAllBookingsByRestaurantId]);

	return (
		<div className="booking-last">
			<section className="header">
				<div className="drag-handle">
					<GripVertical />
				</div>
				<h3>Últimas reservas</h3>
			</section>
			<section className="body">
				{bookings.length > 0 ? (
					bookings.map((e, i) => {
						const isCurrentUser = e.user?.username === user?.username;
						const displayName = e.account?.name
							? `${e.account.name} ${e.account.surname}`
							: isCurrentUser
								? `${e.user.username} (Tú)`
								: e.user.username;

						return <BookingLastCard
							key={i}
							name={displayName}
							createdAt={e.createdAt}
							bookingDateTime={e.bookingDate}
							status={e.status}
						/>;
					})
				) : (
					<div className="empty">
						<BookMarked size={42} strokeWidth={1.5} />
						<h4>No hay reservas</h4>
						<p>Todavía no se han creado reservas</p>
					</div>
				)}
			</section>
		</div>
	);
}

export default BookingLast;
