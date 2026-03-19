import { Routes, Route } from "react-router";
import { DashboardRoutes } from "../../dashboard/routes/DashboardRoutes";
import { AuthRoutes } from "../../auth/routes/AuthRoutes";
import { SetupRoutes } from "../../setup/routes/SetupRoutes";
import Homepage from "../pages/Homepage";

function AppRouter() {
    return (
        <Routes>
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/" element={<Homepage />} />
            {AuthRoutes}
            {DashboardRoutes}
            {SetupRoutes}
        </Routes>
    );
}

export default AppRouter;
