import "./css/account-menu.css";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoginModal from "@/modules/auth/components/LoginModal/LoginModal";
import RegisterModal from "@/modules/auth/components/RegisterModal/RegisterModal";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { $userStore } from "@/modules/dashboard/contexts/userStore";
import { useStore } from "@nanostores/react";
import {
	CreditCard,
	LogOut,
	PieChart,
	ReceiptText,
	Settings,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function AccountMenu() {
	const { user, account } = useStore($userStore);
	const { logout, authenticated } = useAuth();
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const navigate = useNavigate();
	const userPfp = "https://i.pravatar.cc/100?u=24";
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
			icon: <PieChart size={18} />,
			className: "dashboard-btn",
			function: () => navigate("/dashboard/bookings"),
		},
		{
			text: "Perfil",
			access: ["*"],
			icon: <User size={18} />,
			className: "",
			function: () => { },
		},
		{
			text: "Pedidos",
			access: ["ROLE_ADMIN", "ROLE_RIDER", "ROLE_USER"],
			icon: <ReceiptText size={18} />,
			className: "",
			function: () => { navigate("/account/orders"); },
		},
		{
			text: "Facturación",
			access: ["ROLE_ADMIN", "ROLE_OWNER", "ROLE_RIDER"],
			icon: <CreditCard size={18} />,
			className: "",
			function: () => { },
		},
		{
			text: "Configuración",
			access: ["*"],
			icon: <Settings size={18} />,
			className: "",
			function: () => { },
		},
	];

	return (
		<div className="account-menu">
			{isUserLoggedIn ? (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="user-btn relative">
							<img src={userPfp} alt="" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						onCloseAutoFocus={(e) => e.preventDefault()}
						className="user-content "
						side="bottom"
						align="end"
						sideOffset={16}
					>
						<div className="profile ">
							<img src={userPfp} alt="" />
							<div className="info">
								<h4>{user?.username}</h4>
								<p>{user?.email}</p>
							</div>
						</div>
						<DropdownMenuSeparator />
						<ul>
							{ACCOUNT_OPTIONS.map((option, i) => {
								if (
									option.access[0] != "*" &&
									!option.access.includes(user?.role?.name)
								) {
									return;
								}

								return (
									<DropdownMenuItem
										key={i}
										onClick={option.function}
										className={`menu-item ${option.className}`}
									>
										{option.icon}
										<span>{option.text}</span>
									</DropdownMenuItem>
								);
							})}
						</ul>
						<DropdownMenuSeparator />
						<ul>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="menu-item logout-btn"
									>
										<LogOut size={18} />
										<span>Cerrar sesión</span>
									</DropdownMenuItem>
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
											¿Estás seguro de que quieres cerrar
											sesión?
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
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<>
					<Dialog open={loginOpen} onOpenChange={setLoginOpen}>
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
					<Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
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
				</>
			)}
		</div>
	);
}
