import { Route, Routes } from "react-router";
import Login from "../auth/pages/Login";
import Register from "../auth/pages/Register";
import "./css/app.css"

function App() {
    return (
        <>
            <main>
                <Routes>
                    <Route element={<Login/>} path="/login"></Route>
                    <Route element={<Register/>} path="/register"></Route>
                </Routes>
            </main>
        </>
    );
}

export default App;
