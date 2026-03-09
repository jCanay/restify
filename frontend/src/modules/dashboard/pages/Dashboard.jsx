import Logo from "../../core/components/Logo";
import "../css/dashboard.css";
import searchImg from "../../core/assets/search.svg";
import { NavLink, Outlet } from "react-router";
import {
    Group,
    Panel,
    Separator,
    useDefaultLayout,
} from "react-resizable-panels";
import { useRef, useState } from "react";
import {
    Bike,
    BookMarked,
    BookOpenText,
    House,
    PanelLeftClose,
    PanelLeftOpen,
    Search,
    Users,
    Utensils,
} from "lucide-react";

function Dashboard() {
    const sidebarRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [groupId, setGroupId] = useState("dashboard-group-id");
    const { defaultLayout, onLayoutChanged } = useDefaultLayout({
        id: { groupId },
        storage: localStorage,
    });

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
                    <NavLink
                        title="Inicio"
                        className="link"
                        to="/dashboard"
                        end
                    >
                        <House strokeWidth={2} />
                        <p>Inicio</p>
                    </NavLink>
                    <NavLink className="link" to="/dashboard/bookings">
                        <BookMarked strokeWidth={2} />
                        <p>Reservas</p>
                    </NavLink>
                    <NavLink className="link" to="/dashboard/orders">
                        <Bike strokeWidth={2} />
                        <p>Pedidos</p>
                    </NavLink>
                    <NavLink className="link" to="/dashboard/restaurant">
                        <Utensils strokeWidth={2} />
                        <p>Restaurante</p>
                    </NavLink>
                    <NavLink className="link" to="/dashboard/menu">
                        <BookOpenText strokeWidth={2} />
                        <p>Carta</p>
                    </NavLink>
                    <NavLink className="link" to="/dashboard/staff">
                        <Users strokeWidth={2} />
                        <p>Plantillas</p>
                    </NavLink>
                </ul>
                <hr />
                <button className="user">
                    <img src="https://i.pravatar.cc/100" alt="" />
                    <div className="info">
                        <h4>Enooc Dominguez Quiroga</h4>
                        <p>Administrador</p>
                    </div>
                </button>
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
                        <option value="">Restaurante 1</option>
                        <option value="">Restaurante 2</option>
                    </select>
                </div>
                <Outlet />
            </Panel>
        </Group>
    );
}

export default Dashboard;
