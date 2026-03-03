import { Route, Routes } from "react-router";
import Login from "../auth/pages/Login";
import Register from "../auth/pages/Register";
import Homepage from "./pages/Homepage"
import "./css/app.css"

function App() {
	return (
		<Routes>
			<Route element={<Login />} path="/login"></Route>
			<Route element={<Homepage />} path="/"></Route>
			<Route element={<Register />} path="/register"></Route>
		</Routes>
	);
}

export default App;
