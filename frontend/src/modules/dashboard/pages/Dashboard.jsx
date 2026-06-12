import Logo from "../../core/components/Logo";
import "../css/dashboard.css";
import { Outlet } from "react-router";
import {
	Group,
	Panel,
	Separator,
	useDefaultLayout,
} from "react-resizable-panels";
import { useEffect, useRef, useState } from "react";
import {
	CreditCard,
	LogOut,
	PanelLeftClose,
	PanelLeftOpen,
	Search,
	Settings,
	User,
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
import DashboardLinks from "../components/Dashboard/DashboardLinks";
import { useDashboard } from "../hooks/useDashboard";
import { $dashboardStore } from "../contexts/dashboardStore";

function Dashboard() {
	const userPfp = "https://i.pravatar.cc/100?u=24";
	const sidebarRef = useRef(null);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [groupId, setGroupId] = useState("dashboard-group-id");
	const { defaultLayout, onLayoutChanged } = useDefaultLayout({
		id: { groupId },
		storage: localStorage,
	});
	const { user, account, restaurants } = useStore($userStore) || {};
	const { loadDashboard, getUsers, loading, error } = useDashboard();
	const { dashboard } = useStore($dashboardStore) || {};
	const { logout } = useAuth();

	const roles = {
		ROLE_ADMIN: "Administrador",
		ROLE_OWNER: "Dueño",
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

	const handleSearch = (e) => {
		const targetType = "BOOKING_TODAY";

		const widgetWithParentData = dashboard.pages
			.flatMap(view =>
				(view.widgets || []).map(widget => ({
					...widget,
					parentTitle: view.title,
					slug: view.slug
				}))
			)
			.find(widget => widget.type.toLowerCase().replaceAll("_", " ").includes(e.target.value.toLowerCase()));

		const matchedViews = dashboard.pages.filter(view =>
			view.widgets?.some(widget => widget.type.toLowerCase().replaceAll("_", " ").includes(e.target.value.toLowerCase()))
		);

		console.log(matchedViews);
	};

	return (
		<Group
			defaultLayout={defaultLayout}
			onLayoutChanged={onLayoutChanged}
			autoSave="enooc"
			className={`dashboard ${isCollapsed ? "collapsed" : ""}`}
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
				<div className="notifications">
					{/* Notificaciones */}
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
										className="menu-item logout-btn"
									>
										<LogOut size={18} />
										<span>Cerrar sesión</span>
									</DropdownMenuItem>
								</AlertDialogTrigger>
								<AlertDialogContent
									onCloseAutoFocus={(e) => e.preventDefault()}
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
					<search onChange={handleSearch}>
						<button>
							<Search size={22} />
						</button>
						<input
							type="text"
							name=""
							id=""
							placeholder="Busca algo"
						/>
					</search>
					<select name="" id="">
						{restaurants?.map((restaurant, index) => (
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
