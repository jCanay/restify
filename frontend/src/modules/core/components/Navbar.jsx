import { Link } from "react-router";
import "../css/navbar.css";
import Logo from "./Logo";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RegisterModal from "../../auth/components/RegisterModal/RegisterModal";
import LoginModal from "../../auth/components/LoginModal/LoginModal";

function Navbar() {
	return (
		<nav className="navbar">
			<div className="wrapper container">
				<Logo route={"/"} />
				<ul>
					<Link className="link active" to="/">
						Inicio
					</Link>
					<Link className="link" to="/">
						Gestiona tu negocio
					</Link>
					<Link className="link" to="/">
						Sobre nosotros
					</Link>
					<Link className="link" to="/">
						Contacto
					</Link>
				</ul>
				<div className="auth">
					<Dialog>
						<DialogTrigger asChild>
							<button
								className="login-btn"
							>
								Iniciar sesión
							</button>
						</DialogTrigger>
						<LoginModal />
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<button
								className="register-btn"
							>
								Registrarse
							</button>
						</DialogTrigger>
						<RegisterModal />
					</Dialog>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
