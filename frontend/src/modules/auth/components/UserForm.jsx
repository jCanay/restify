import { use, useState } from "react"
import { Link } from "react-router"
import "../css/user-form.css"
import api from "../../core/api/axios"

function UserForm({ role }) {
	const [token, setToken] = useState("")

	const [user, setUser] = useState({
		username: "",
		email: "",
		password: "",
		role: {
			name: role
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault()

		api
			.post("/auth/register", user)
			.then((response) => {
				setToken(response.data.token)
			})

		if (token) {
			cookieStore.set("token", token)
		}
	}

	const handleInput = (e) => {
		setUser({ ...user, [e.currentTarget.name]: e.currentTarget.value })
	}

	return (
		<form id="register-form" onSubmit={handleSubmit}>
			<input type="text" value={user.username} name="username" placeholder="Usuario" onChange={handleInput} />
			<input type="email" value={user.email} name="email" placeholder="Email" onChange={handleInput} />
			<input type="password" value={user.password} name="password" placeholder="Contraseña" onChange={handleInput} />
			{role == "owner"
				&& (
					<input type="text" name="dni" placeholder="DNI"></input>
				)}
			<input type="submit" value="Registrarse" />
			<p>
				¿Ya tienes una cuenta?
				<Link to="/login">Inicia sesión</Link>
			</p>
			<p>Role: {role}</p>
			<p>Token: {token}</p>
		</form>
	)
}

export default UserForm