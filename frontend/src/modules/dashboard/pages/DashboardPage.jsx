import { useStore } from "@nanostores/react";
import { Grid2x2Plus, LayoutGrid, SquarePen } from "lucide-react";
import { useMemo } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import DashboardWidgetGrid from "../components/Dashboard/DashboardWidgetGrid";
import { $dashboardStore } from "../contexts/dashboardStore";
import "../css/dashboard-page.css";
import ProductsPage from "./menu/ProductsPage";
import RestaurantDashboardPage from "./restaurant/RestaurantDashboardPage";

function DashboardPage({ title }) {
    const { dashboard } = useStore($dashboardStore);
    const { slug, tab } = useParams();

    const pageData = useMemo(() => {
        return dashboard?.pages.filter((p) => p.slug == (slug ? slug : ""))[0];
    }, [dashboard, slug]);

    const widgets = useMemo(() => pageData?.widgets || [], [pageData]);
    const tabs = useMemo(() => pageData?.tabs || [], [pageData]);

    const TAB_OPTIONS = {
        bookings: {
            history: <div>Historial de Reservas</div>,
            stats: <div>Estadísticas de Reservas</div>,
        },
        orders: {
            history: <div>Historial de Pedidos</div>,
            stats: <div>Estadísticas de Pedidos</div>,
        },
        restaurant: {
            default: <RestaurantDashboardPage />,
        },
        menu: {
            default: <ProductsPage />,
            stats: <div>Estadísticas de Menú</div>,
        },
    };

    return (
        <div className="dashboard-page">
            <h2>{title}</h2>
            <section className="tabs">
                {/* <NavLink
					to={`/dashboard${slug ? `/${slug}` : ""}`}
					end
					className="link"
					title="Vista de Widgets"
				>
					<LayoutGrid />
				</NavLink> */}
                {tabs?.map((tab, i) => (
                    <NavLink
                        to={`/dashboard${slug ? `/${slug}` : ""}${tab?.path ? `/${tab.path}` : ""}`}
                        className="link"
                        key={i}
                        end
                    >
                        {tab?.name ? tab.name : <LayoutGrid />}
                    </NavLink>
                ))}
                {useLocation().pathname === "/dashboard" && (
                    <>
                        <button className="link">
                            <Grid2x2Plus />
                        </button>
                        <button className="link">
                            <SquarePen />
                        </button>
                    </>
                )}
            </section>
            <section className="components">
                {!tab && !tabs[0]?.name ? (
                    <DashboardWidgetGrid
                        widgets={widgets}
                        pageId={slug ? `${slug}` : "home"}
                    />
                ) : (
                    TAB_OPTIONS?.[slug]?.[tab] || TAB_OPTIONS[slug]?.default
                )}
            </section>
        </div>
    );
}

export default DashboardPage;
