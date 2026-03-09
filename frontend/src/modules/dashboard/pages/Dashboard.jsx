import Logo from "../../core/components/Logo";
import "../css/dashboard.css";
import searchImg from "../../core/assets/search.svg";
import { NavLink, Outlet } from "react-router";
import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels"
import { useState } from "react";

function Dashboard() {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [groupId, setGroupId] = useState("dashboard-group-id")
	const {defaultLayout, onLayoutChanged} = useDefaultLayout({
		id: { groupId },
		storage: localStorage
	})

	const handleResize = (size) => {
		setIsCollapsed(size.inPixels <= 100)
	}

	return (
		<Group defaultLayout={defaultLayout} onLayoutChanged={onLayoutChanged} autoSave="enooc" className={`dashboard ${isCollapsed && "collapsed"}`}>
			<Panel onResize={handleResize} groupResizeBehavior="preserve-pixel-size" collapsible collapsedSize="3rem" minSize="15rem" defaultSize="15rem" maxSize="25rem" className="aside">
				<Logo route="/dashboard" />
				<ul>
					<NavLink title="Inicio" className="link" to="/dashboard" end>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
						</svg>
						<p>Inicio</p>
					</NavLink>
					<NavLink className="link" to="/dashboard/bookings">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm560-80v-560H200v560h560Zm-400-80h60v-160q26-7 43-28.5t17-48.5v-163h-40v151h-30v-151h-40v151h-30v-151h-40v163q0 27 17 48.5t43 28.5v160Zm240 0h60v-400q-50 0-85 35t-35 85v120h60v160Zm-400 80v-560 560Z" />
						</svg>
						<p>Reservas</p>
					</NavLink>
					<NavLink className="link" to="/dashboard/orders">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
						</svg>
						<p>Pedidos</p>
					</NavLink>
					<NavLink className="link" to="/dashboard/restaurant">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<path d="M480-400 40-640l440-240 440 240-440 240Zm0 160L63-467l84-46 333 182 333-182 84 46-417 227Zm0 160L63-307l84-46 333 182 333-182 84 46L480-80Zm0-411 273-149-273-149-273 149 273 149Zm0-149Z" />
						</svg>
						<p>Restaurante</p>
					</NavLink>
					<NavLink className="link" to="/dashboard/menu">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<path d="M560-564v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-600q-38 0-73 9.5T560-564Zm0 220v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-380q-38 0-73 9t-67 27Zm0-110v-68q33-14 67.5-21t72.5-7q26 0 51 4t49 10v64q-24-9-48.5-13.5T700-490q-38 0-73 9.5T560-454ZM260-320q47 0 91.5 10.5T440-278v-394q-41-24-87-36t-93-12q-36 0-71.5 7T120-692v396q35-12 69.5-18t70.5-6Zm260 42q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 118q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 102 12t96 36q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59ZM280-494Z" />
						</svg>
						<p>Carta</p>
					</NavLink>
					<NavLink className="link" to="/dashboard/staff">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="24px"
							viewBox="0 -960 960 960"
							width="24px"
						>
							<path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47Zm466 0q-47 47-113 47-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113q0 66-47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-240Zm0-400Z" />
						</svg>
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
							<img src={searchImg} alt="" />
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
