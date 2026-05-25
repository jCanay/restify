import { GripVertical } from "lucide-react";
import "./css/widget.css";

function Widget({ children, className, title, layout }) {
	return (
		<div className={`widget `}>
			<header>
				<GripVertical className="drag-handle" />
				<h3>{title}</h3>
			</header>
			<main className={`body ${className}`}>{children}</main>
		</div>
	);
}

export default Widget;
