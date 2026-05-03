import { Navigate, Outlet } from "react-router";

export function ProtectedRoute({
	isAllowed,
	navigateTo = "/",
	children
}) {
	if (!isAllowed) {
		return <Navigate to={navigateTo} replace />;
	}

	return children ? children : <Outlet />;
}