import { useState, useEffect } from "react";
import { getAdminDashboard } from "./services/api";
import { Route, Routes } from "react-router";
import Login from "../auth/pages/Login";

function App() {
    const [adminDashboard, setAdminDashboard] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                await new Promise((r) => setTimeout(r, 1000));
                const adminDashboard = await getAdminDashboard();
                setAdminDashboard(adminDashboard);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    return (
        <>
            <main>
                <Routes>
                    <Route element={<Login/>} path="/"></Route>
                </Routes>
            </main>
        </>
    );
}

export default App;
