import { Route } from "react-router";
import Dashboard from "../pages/Dashboard";
import DashboardPage from "../pages/DashboardPage";
import CrudManager from "../widgets/CrudManager";
import BookingGeneralSummary from "../widgets/booking/BookingGeneralSummary";
import BookingHistory from "../widgets/booking/BookingHistory";
import BookingLast from "../widgets/booking/BookingLast";

export const DashboardRoutes = (
    <Route element={<Dashboard />}>
        <Route
            path="dashboard"
            element={<DashboardPage currentPath="" title="Inicio" />}
        />
        <Route
            path="dashboard/bookings"
            element={
                <DashboardPage
                    // widgets={[
                    //     <CrudManager name="reserva" pluralName="reservas" />,
                    //     <BookingGeneralSummary />,
                    //     <BookingLast />,
                    // ]}
                    currentPath="/bookings"
                    title="Reservas"
                />
            }
        >
            <Route path="history" element={<BookingHistory />}></Route>
            <Route path="stats" element={<BookingHistory />}></Route>
        </Route>
        <Route
            path="dashboard/orders"
            element={<DashboardPage currentPath="/orders" title="Pedidos" />}
        />
        <Route
            path="dashboard/restaurant"
            element={
                <DashboardPage currentPath="/restaurant" title="Restaurante" />
            }
        />
        <Route
            path="dashboard/menu"
            element={<DashboardPage currentPath="/menu" title="Carta" />}
        />
        <Route
            path="dashboard/staff"
            element={<DashboardPage currentPath="/staff" title="Plantilla" />}
        />
    </Route>
);
