import { CheckCheck, Info, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import "./notification-toast.css";

/**
 * @param {object} [options]
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {"info" | "success" | "error"} [options.variant]
 * @param {boolean} [options.dismissible]
 * @param {boolean} [options.showCloseButton]
 * @param {import("react").ReactNode} [options.icon]
 * @param {Number} [options.duration]
 * @param {boolean} [options.showAction]
 * @param {string} [options.actionText]
 * @param {Function} [options.handleActionClick]
 */
export const showToast = ({ title, description, variant, dismissible, showCloseButton, icon, duration, showAction, actionText, handleActionClick } = {}) => {

	const variants = {
		info: {
			icon: <Info size={16} />
		},
		success: {
			icon: <CheckCheck size={16} />
		},
		error: {
			icon: <TriangleAlert size={16} />
		},
	};

	const buttonGroup = (
		<div className="notification-toast-btn">
			<button type="button" onClick={handleActionClick} className="toast-btn">{actionText || "[Button]"}</button>
		</div>
	);

	toast(
		title || "[title]",
		{
			className: `notification-toast ${variant ? variant : ""} ${description ? "desc" : ""}`,
			description: description,
			icon: variants[variant]?.icon || icon,
			dismissible,
			closeButton: showCloseButton,
			duration,
			action: showAction && buttonGroup,
		});
};