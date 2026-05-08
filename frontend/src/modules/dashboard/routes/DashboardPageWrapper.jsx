import { Navigate, useParams } from "react-router";
import { useStore } from "../../../../node_modules/@nanostores/react/index";
import { $dashboardStore } from "../contexts/dashboardStore";
import DashboardPage from "../pages/DashboardPage";

export default function DashboardPageWrapper() {
    const { slug, tab } = useParams();
    const { dashboard } = useStore($dashboardStore);

    // Comprueba que no acabe por /
    if (location.pathname !== "/" && location.pathname.endsWith("/")) {
        return <Navigate to={location.pathname.slice(0, -1)} replace />;
    }

    // Buscamos la página en el store para sacar el título real
    const page = dashboard?.pages?.find((p) => p.slug === (slug || ""));

    if (!page) {
        return <Navigate to="/dashboard" replace />;
    }

    if (tab && !page?.tabs?.some((t) => t.path === tab)) {
        return <Navigate to={`/dashboard/${slug}`} replace />;
    }

    return (
        <DashboardPage
            key={slug}
            pageId={slug && `/${slug}`}
            title={page?.title || "Cargando..."}
        />
    );
}
