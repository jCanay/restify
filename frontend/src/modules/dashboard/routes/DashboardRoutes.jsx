import { Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import DashboardPage from "../pages/DashboardPage";
import BookingManager from "../widgets/BookingManager"

export const DashboardRoutes = (
    <Route element={<Dashboard />}>
        <Route path="dashboard/home" element={<DashboardPage widgets={[]} tabs={["Enoc"]} title="Inicio" />} />
        <Route path="dashboard/bookings" element={<DashboardPage widgets={[<BookingManager/>, <BookingManager/>, <BookingManager/>]} tabs={["Historial", "Estadísticas"]} title="Reservas" />} />
        <Route path="dashboard/orders" element={<DashboardPage widgets={[]} tabs={["Enoc"]} title="Pedidos" />} />
        <Route path="dashboard/restaurant" element={<DashboardPage widgets={[]} tabs={["Enoc"]} title="Restaurante" />} />
        <Route path="dashboard/menu" element={<DashboardPage widgets={[]} tabs={["Enoc"]} title="Carta" />} />
        <Route path="dashboard/staff" element={<DashboardPage widgets={[]} tabs={["Enoc"]} title="Plantilla" />} />
    </Route>
);