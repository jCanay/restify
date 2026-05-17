import { Link, useNavigate } from "react-router";
import "../css/navbar.css";
import Logo from "./Logo";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RegisterModal from "../../auth/components/RegisterModal/RegisterModal";
import LoginModal from "../../auth/components/LoginModal/LoginModal";
import { useStore } from "@nanostores/react";
import { $userStore, userExists } from "@/modules/dashboard/contexts/userStore";
import { useEffect, useState } from "react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreditCard, LogOut, PieChart, ReceiptText, Settings, User } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AccountMenu from "./AccountMenu/AccountMenu";

function Navbar() {
	const { user, account } = useStore($userStore);
	const { logout } = useAuth();
	const navigate = useNavigate();
	const userPfp = "https://i.pravatar.cc/100?u=24";
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

	useEffect(() => {
		const checkUserAuthStatus = () => {
			setIsUserLoggedIn(userExists());
		};

		checkUserAuthStatus();
	}, []);

	const handleLogout = () => {
		logout();
		setIsUserLoggedIn(false);
	};

	const accountOptions = [
		{
			text: "Ir al dashboard",
			access: ["ROLE_ADMIN", "ROLE_OWNER"],
			icon: <PieChart size={18} />,
			className: "dashboard-btn",
			function: () => navigate("/dashboard")
		},
		{
			text: "Perfil",
			access: ["*"],
			icon: <User size={18} />,
			className: "",
			function: () => { }
		},
		{
			text: "Pedidos",
			access: ["ROLE_ADMIN", "ROLE_RIDER", "ROLE_USER"],
			icon: <ReceiptText size={18} />,
			className: "",
			function: () => { }
		},
		{
			text: "Facturación",
			access: ["ROLE_ADMIN", "ROLE_OWNER", "ROLE_RIDER"],
			icon: <CreditCard size={18} />,
			className: "",
			function: () => { }
		},
		{
			text: "Configuración",
			access: ["*"],
			icon: <Settings size={18} />,
			className: "",
			function: () => { }
		},
	];

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
				<AccountMenu />
			</div>
		</nav>
	);
}

export default Navbar;
