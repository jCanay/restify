import { Link, Navigate, useNavigate } from "react-router"
import "../css/navbar.css"
import logoIcon from "../assets/logo-icon.svg"
import logoText from "../assets/logo-text.svg"
import Logo from "./Logo"

function Navbar() {
	const navigate = useNavigate()

	return (
		<nav className="navbar">
			<div className="wrapper container">
				<Logo/>
				<ul>
					<Link className="link active" to="/">Inicio</Link>
					<Link className="link" to="/">Gestiona tu negocio</Link>
					<Link className="link" to="/">Sobre nosotros</Link>
					<Link className="link" to="/">Contacto</Link>
				</ul>
				<div className="auth">
					<button className="login-btn" onClick={() => navigate("/login")}>Iniciar sesión</button>
					<button className="register-btn" onClick={() => navigate("/register")}>Registrarse</button>
				</div>
			</div>
		</nav>
	)
}

export default Navbar