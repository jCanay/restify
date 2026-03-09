import { Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import DashboardPage from "../pages/DashboardPage";
import CrudManager from "../widgets/CrudManager"
import BookingGeneralSummary from "../widgets/booking/BookingGeneralSummary";
import BookingHistory from "../widgets/booking/BookingHistory";

export const DashboardRoutes = (
	<Route element={<Dashboard />}>
		<Route path="dashboard" element={<DashboardPage widgets={[]} tabs={["Enoc"]} title="Inicio" />} />
		<Route
			path="dashboard/bookings"
			element={
				<DashboardPage
					widgets={[
						<CrudManager name="reserva" pluralName="reservas" />,
						<BookingGeneralSummary />
					]}
					tabs={[
						{
							name: "Historial",
							path: "history"
						},
						{
							name: "Estadísticas",
							path: "stats"
						}
					]}
					currentPath="bookings"
					title="Reservas" />
			}
		>
			<Route path="history" element={<BookingHistory />}></Route>
			<Route path="stats" element={<BookingHistory />}></Route>
		</Route>
		<Route path="dashboard/orders" element={<DashboardPage currentPath="orders" widgets={[<CrudManager name="pedido" pluralName="pedidos" />]} tabs={["Enoc"]} title="Pedidos" />} />
		<Route path="dashboard/restaurant" element={<DashboardPage currentPath="restaurant" widgets={[<CrudManager name="restaurante" pluralName="restaurantes" />]} tabs={["Enoc"]} title="Restaurante" />} />
		<Route path="dashboard/menu" element={<DashboardPage currentPath="menu" widgets={[<CrudManager name="carta" pluralName="cartas" />]} tabs={["Enoc"]} title="Carta" />} />
		<Route path="dashboard/staff" element={<DashboardPage currentPath="staff" widgets={[<CrudManager name="empleado" pluralName="empleados" />]} tabs={["Enoc"]} title="Plantilla" />} />
	</Route>
);