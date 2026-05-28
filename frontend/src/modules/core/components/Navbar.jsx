import { useNavigate } from "react-router";
import "../css/navbar.css";
import Logo from "./Logo";
import { $userStore, userExists } from "@/modules/dashboard/contexts/userStore";
import { useEffect, useState } from "react";
import AccountMenu from "./AccountMenu/AccountMenu";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import LoginModal from "@/modules/auth/components/LoginModal/LoginModal";
import RegisterModal from "@/modules/auth/components/RegisterModal/RegisterModal";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useStore } from "@nanostores/react";
import {
	CreditCard,
	LogOut,
	Menu,
	PieChart,
	ReceiptText,
	Settings,
	User,
} from "lucide-react";

function Navbar() {
	const userPfp = "https://i.pravatar.cc/100?u=24";
	const { user, account } = useStore($userStore);
	const { logout, authenticated } = useAuth();
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const navigate = useNavigate();
	const [loginOpen, setLoginOpen] = useState(false);
	const [registerOpen, setRegisterOpen] = useState(false);

	useEffect(() => {
		const checkAuthStatus = () => {
			setIsUserLoggedIn(authenticated);
		};

		checkAuthStatus();
	}, [authenticated]);

	const handleLogout = () => {
		logout();
		setIsUserLoggedIn(false);
	};

	const ACCOUNT_OPTIONS = [
		{
			text: "Ir al dashboard",
			access: ["ROLE_ADMIN", "ROLE_OWNER"],
			icon: <PieChart size={24} />,
			className: "dashboard-btn",
			function: () => navigate("/dashboard"),
		},
		{
			text: "Perfil",
			access: ["*"],
			icon: <User size={24} />,
			className: "",
			function: () => { },
		},
		{
			text: "Pedidos",
			access: ["ROLE_ADMIN", "ROLE_RIDER", "ROLE_USER"],
			icon: <ReceiptText size={24} />,
			className: "",
			function: () => { },
		},
		{
			text: "Facturación",
			access: ["ROLE_ADMIN", "ROLE_OWNER", "ROLE_RIDER"],
			icon: <CreditCard size={24} />,
			className: "",
			function: () => { },
		},
		{
			text: "Configuración",
			access: ["*"],
			icon: <Settings size={24} />,
			className: "",
			function: () => { },
		},
	];

	useEffect(() => {
		const checkUserAuthStatus = () => {
			setIsUserLoggedIn(userExists());
		};

		checkUserAuthStatus();
	}, []);

	return (
		<nav className="navbar">
			<div className="wrapper container">
				<Logo route={"/"} />
				{/* <ul>
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
                </ul> */}
				<AccountMenu />
				<Drawer direction="right">
					<DrawerTrigger asChild>
						<button className="menu-toggle">
							<Menu size={28} />
						</button>
					</DrawerTrigger>
					{isUserLoggedIn ? (
						<DrawerContent className="menu-drawer">
							<div className="profile ">
								<img src={userPfp} alt="" />
								<div className="info">
									<h4>{user?.username}</h4>
									<p>{user?.email}</p>
								</div>
							</div>
							<hr />
							<ul>
								{ACCOUNT_OPTIONS.map((option, i) => {
									if (
										option.access[0] != "*" &&
										!option.access.includes(
											user?.role?.name,
										)
									) {
										return;
									}

									return (
										<li
											key={i}
											onClick={option.function}
											className={`${option.className}`}
										>
											{option.icon}
											<span>{option.text}</span>
										</li>
									);
								})}
							</ul>
							<hr />
							<ul>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<li
											onSelect={(e) => e.preventDefault()}
											className="menu-item logout-btn"
										>
											<LogOut size={24} />
											<span>Cerrar sesión</span>
										</li>
									</AlertDialogTrigger>
									<AlertDialogContent
										className="logout-dialog"
										size="sm"
									>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Cerrar sesión
											</AlertDialogTitle>
											<AlertDialogDescription>
												¿Estás seguro de que quieres
												cerrar sesión?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>
												No
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleLogout}
											>
												Sí
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</ul>
						</DrawerContent>
					) : (
						<DrawerContent className="menu-drawer">
							<Dialog
								open={loginOpen}
								onOpenChange={setLoginOpen}
							>
								<DialogTrigger asChild>
									<button className="login-btn">
										Iniciar sesión
									</button>
								</DialogTrigger>
								<LoginModal
									open={loginOpen}
									setOpen={setLoginOpen}
									onLogged={setIsUserLoggedIn}
								/>
							</Dialog>
							<Dialog
								open={registerOpen}
								onOpenChange={setRegisterOpen}
							>
								<DialogTrigger asChild>
									<button className="register-btn">
										Registrarse
									</button>
								</DialogTrigger>
								<RegisterModal
									open={registerOpen}
									setOpen={setRegisterOpen}
									onRegistered={setIsUserLoggedIn}
								/>
							</Dialog>
						</DrawerContent>
					)}
				</Drawer>
			</div>
		</nav>
	);
}

export default Navbar;
