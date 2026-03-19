import { Route } from "react-router";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const AuthRoutes = (
    <>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </>
);
