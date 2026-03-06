import { Routes, Route } from "react-router";
import { DashboardRoutes } from "../../dashboard/routes/DashboardRoutes";
import Homepage from "../pages/Homepage";
import Login from "../../auth/pages/Login";
import Register from "../../auth/pages/Register";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {DashboardRoutes}
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    );
}

export default AppRouter; 