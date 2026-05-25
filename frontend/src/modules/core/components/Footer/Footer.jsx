import { NavLink } from "react-router";
import Logo from "../Logo";
import "./css/footer.css";

/**
 * @param {object} props
 * @param {"primary" | "light" | "dark"} [props.variant]
 * @param {boolean} [props.separated]
 * @param {string} [props.backdropColor]
 */
export function Footer({ variant, separated = false, backdropColor = "#000" }) {
	return (
		<div className="footer">
			<div className="svg-container">
				<svg
					className={`${backdropColor}`}
					viewBox="0 0 1440 60"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M0,60 C360,20 1080,20 1440,60 L1440,120 L0,120 Z" />
				</svg>
			</div>
			<div className="spacer" />
			<div className="wrapper">
				<footer className="container">
					{separated && <section className="logo">
						<Logo route="/" variant={variant} />
					</section>}
					<section className="content">
						{!separated && <ul>
							<Logo route="/" variant={variant} />
						</ul>}
						<ul>
							<h5>Navegación</h5>
							<NavLink to={"/"}>Inicio</NavLink>
							<NavLink to={"/"}>Gestiona tu restaurante</NavLink>
							<NavLink to={"/dashboard"}>Dashboard</NavLink>
						</ul>
						<ul>
							<h5>Sobre nosotros</h5>
							<NavLink to={"/"}>¿Quienes somos?</NavLink>
							<NavLink to={"/"}>FAQ</NavLink>
							<NavLink to={"/"}>Contacto</NavLink>
						</ul>
						<ul>
							<h5>Legal</h5>
							<NavLink to={"/"}>Términos y condiciones</NavLink>
							<NavLink to={"/"}>Política de privacidad</NavLink>
							<NavLink to={"/"}>Uso de Cookies</NavLink>
						</ul>
					</section>
					<section className="rights">
						<span>© 2026 Restify™</span>
						<span>Todos los derechos reservados</span>
					</section>
				</footer>
			</div>
		</div>
	);
}