import { Navigate, useParams } from "react-router";
import DashboardPage from "../pages/DashboardPage";
import { $dashboardStore } from "../contexts/dashboardStore";
import { useStore } from "../../../../node_modules/@nanostores/react/index";
import { useEffect } from "react";

export default function DashboardPageWrapper() {
	const { slug } = useParams();
	const { dashboard } = useStore($dashboardStore);
	useEffect(() => { });

	// Buscamos la página en el store para sacar el título real
	const page = dashboard?.pages?.find((p) => p.slug === (slug || ""));

	// Si ya terminó de cargar y NO existe la página con ese slug
	if (!page) {
		return <Navigate to="/dashboard" />;
	}

	return (
		<DashboardPage
			currentPath={slug && `/${slug}`}
			title={page?.title || "Cargando..."}
		/>
	);
}
