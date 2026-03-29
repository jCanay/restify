import { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import "../css/user-form.css";
import api from "../../core/api/axios";
import { useAuthContext } from "../contexts/AuthProvider";

function UserForm({ option }) {
	const { token, setToken, role, setRole } = useAuthContext();
	const navigate = useNavigate();

	const [user, setUser] = useState({
		name: "",
		surname: "",
		username: "",
		email: "",
		password: "",
		role: {
			name: option,
		},
	});

	useEffect(() => {
		setUser({ ...user, role: { name: option } });
	}, [option, user]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await api.post("/auth/register", user);
			setToken(response.data.token);
			setRole(response.data.role);

			if (response.data.token) {
				cookieStore.set("token", token);
				navigate("/setup");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleInput = (e) => {
		setUser({ ...user, [e.currentTarget.name]: e.currentTarget.value });
	};

	return (
		<form
			id="register-form"
			className="register-form"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				value={user.name}
				name="name"
				placeholder="Nombre"
				onChange={handleInput}
			/>
			<input
				type="text"
				value={user.surname}
				name="surname"
				placeholder="Apellidos"
				onChange={handleInput}
			/>
			<input
				type="text"
				value={user.username}
				name="username"
				placeholder="Usuario"
				onChange={handleInput}
			/>
			<input
				type="email"
				value={user.email}
				name="email"
				placeholder="Email"
				onChange={handleInput}
			/>
			<input
				type="password"
				value={user.password}
				name="password"
				placeholder="Contraseña"
				onChange={handleInput}
			/>
			{role == "ROLE_OWNER" && (
				<input type="text" name="dni" placeholder="DNI"></input>
			)}
			<input type="submit" value="Registrarse" />
			<p>
				¿Ya tienes una cuenta?
				<Link to="/login">Inicia sesión</Link>
			</p>
			<p>Role: {option}</p>
			<p>Token: {token}</p>
		</form>
	);
}

export default UserForm;
