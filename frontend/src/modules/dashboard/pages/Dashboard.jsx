import Logo from "../../core/components/Logo";
import "../css/dashboard.css";
import { NavLink, Outlet } from "react-router";
import {
	Group,
	Panel,
	Separator,
	useDefaultLayout,
} from "react-resizable-panels";
import { useEffect, useRef, useState } from "react";
import {
	Bike,
	BookMarked,
	BookOpenText,
	CreditCard,
	House,
	LogOut,
	PanelLeftClose,
	PanelLeftOpen,
	Search,
	Settings,
	User,
	Users,
	Utensils,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { Toaster } from "sonner";
import { useStore } from "@nanostores/react";
import { $userStore, getUserDefaultRestaurant } from "../contexts/userStore";
import { useAuth } from "../../auth/hooks/useAuth";
import { showToast } from "../components/NotificationToast";
import DashboardLinks from "../components/DashboardLinks";
import { useDashboard } from "../hooks/useDashboard";

function Dashboard() {
	const userPfp = "https://i.pravatar.cc/100?u=0";
	const sidebarRef = useRef(null);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [groupId, setGroupId] = useState("dashboard-group-id");
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: { groupId },
		storage: localStorage,
	});
	const { user, account, restaurants } = useStore($userStore) || {};
	const { loadDashboard, getUsers, loading, error } = useDashboard();
	const { logout } = useAuth();

	const roles = {
		ROLE_ADMIN: "Administrador",
		ROLE_USER: "Usuario",
		ROLE_RIDER: "Repartidor",
	};

	useEffect(() => {
		const loadData = () => {
			loadDashboard(getUserDefaultRestaurant()?.id);
			getUsers();
		};

		loadData();
	}, [loadDashboard, getUsers]);

	const notificationsRef = useRef(null);
	useEffect(() => {
		if (!notificationsRef.current) return;

		const updateOffsetsManual2 = () => {
			const toasts = notificationsRef.current.querySelectorAll(
				"li[data-sonner-toast]",
			);
			let accumulatedOffset = 0;

			toasts.forEach((toast) => {
				// 1. Forzamos que el Toast nos diga cuánto mide realmente con el nuevo ancho
				const height = toast.getBoundingClientRect().height;

				// 2. Sobreescribimos la variable de Sonner directamente en el DOM
				toast.style.setProperty("--offset", `${accumulatedOffset}px`);
				toast.style.setProperty("--initial-height", `${height}px`);

				// 3. Acumulamos para el siguiente Toast en la pila
				accumulatedOffset += height + 16;
			});
		};

		const updateOffsetsManual = () => {
			if (!notificationsRef.current) return;
			const toasts = notificationsRef.current.querySelectorAll(
				"li[data-sonner-toast]",
			);
			let accumulatedOffset = 0;
			const gap = 16;

			toasts.forEach((toast, index) => {
				// 1. Guardamos el índice para el escalonado estático (10px, 20px...)
				toast.style.setProperty("--index", index);

				// 2. Medimos la altura real que tiene el toast en este preciso ancho
				const height = toast.getBoundingClientRect().height;

				// 3. Tus variables para el modo expandido
				toast.style.setProperty("--offset", `${accumulatedOffset}px`);
				toast.style.setProperty("--initial-height", `${height}px`);

				accumulatedOffset += height + gap;
			});
		};

		const observer = new ResizeObserver(() => {
			// Ejecutamos el recálculo manual en cada píxel de movimiento
			updateOffsetsManual();
			// Intentamos también el evento estándar por si acaso
			window.dispatchEvent(new Event("resize"));
		});

		observer.observe(notificationsRef.current);

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		showToast({
			duration: Infinity,
			title: "Perfil actualizado",
			description: "El perfil se ha actualizado correctamente.",
			variant: "success",
		});

		showToast({
			duration: Infinity,
			title: "Error al actualizar el perfil",
			description: "No se han podido actualizar los cambios.",
			variant: "error",
		});

		showToast({
			duration: Infinity,
			title: "Actualización",
			description: "Hay una nueva versión disponible.",
			showAction: true,
			variant: "info",
			actionText: "Actualizar",
		});
	}, []);

	const toggleSidebar = () => {
		const sidebar = sidebarRef.current;
		if (sidebar) {
			if (isCollapsed) {
				sidebar.expand();
			} else {
				sidebar.collapse();
			}
		}
	};

	const handleResize = (size) => {
		setIsCollapsed(size.inPixels <= 100);
	};

	const handleLogout = () => {
		logout();
	};

	return (
		<Group
			defaultLayout={defaultLayout}
			onLayoutChanged={onLayoutChanged}
			autoSave="enooc"
			className={`dashboard ${isCollapsed && "collapsed"}`}
		>
			<Panel
				panelRef={sidebarRef}
				style={{ overflow: "visible" }}
				onResize={handleResize}
				groupResizeBehavior="preserve-pixel-size"
				collapsible
				collapsedSize="3rem"
				minSize="15rem"
				defaultSize="15rem"
				maxSize="25rem"
				className="aside"
			>
				<Logo route="/dashboard" />
				<button onClick={toggleSidebar} className="panel-left-close">
					{isCollapsed ? (
						<PanelLeftOpen size={24} strokeWidth={2} />
					) : (
						<PanelLeftClose size={24} strokeWidth={2} />
					)}
				</button>
				<ul>
					<DashboardLinks />
				</ul>
				<div ref={notificationsRef} className="notifications">
					<Toaster visibleToasts={5} position="bottom-left" />
				</div>
				<hr />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="user-btn">
							<img src={userPfp} alt="" />
							<div className="info">
								<h4>
									{account?.name || account?.surname
										? `${account?.name || ""} ${account?.surname || ""}`
										: `${user?.username}`}
								</h4>
								<small>{roles[user?.role?.name]}</small>
							</div>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="user-content"
						side="right"
						align="end"
						sideOffset={16}
					>
						<div className="profile">
							<img src={userPfp} alt="" />
							<div className="info">
								<h4>{user?.username}</h4>
								<p>{user?.email}</p>
							</div>
						</div>
						<DropdownMenuSeparator />
						<ul>
							<DropdownMenuItem className="menu-item">
								<User size={18} />
								<span>Perfil</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="menu-item">
								<CreditCard size={18} />
								<span>Facturación</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="menu-item">
								<Settings size={18} />
								<span>Configuración</span>
							</DropdownMenuItem>
						</ul>
						<DropdownMenuSeparator />
						<ul>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="menu-item logout"
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
			</Panel>
			{/* <Separator className="separator" /> */}
			<Panel className="main">
				<div className="topbar">
					<search>
						<button>
							<Search />
						</button>
						<input
							type="text"
							name=""
							id=""
							placeholder="Busca algo"
						/>
					</search>
					<select name="" id="">
						{restaurants.map((restaurant, index) => (
							<option key={index} value={restaurant.id}>
								{restaurant.name}
							</option>
						))}
					</select>
				</div>
				<Outlet />
			</Panel>
		</Group>
	);
}

export default Dashboard;
