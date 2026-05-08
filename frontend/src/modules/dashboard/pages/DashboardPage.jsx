import { useStore } from "@nanostores/react";
import { Grid2x2Plus, LayoutGrid, SquarePen } from "lucide-react";
import { useMemo } from "react";
import { NavLink, useLocation, useParams } from "react-router";
import DashboardWidgetGrid from "../components/Dashboard/DashboardWidgetGrid";
import { $dashboardStore } from "../contexts/dashboardStore";
import "../css/dashboard-page.css";

function DashboardPage({ title }) {
    const { dashboard } = useStore($dashboardStore);
    const { slug, tab } = useParams();

    const pageData = useMemo(() => {
        return dashboard?.pages.filter((p) => p.slug == (slug ? slug : ""))[0];
    }, [dashboard]);

    const widgets = useMemo(() => pageData?.widgets || [], [pageData]);
    const tabs = useMemo(() => pageData?.tabs || [], [pageData]);

    return (
        <div className="dashboard-page">
            <h2>{title}</h2>
            <section className="tabs">
                <NavLink
                    to={`/dashboard${slug ? `/${slug}` : ""}`}
                    end
                    className="link"
                    title="Vista de Widgets"
                >
                    <LayoutGrid />
                </NavLink>
                {tabs.map(
                    (tab, i) =>
                        tab.name && (
                            <NavLink
                                to={`/dashboard${slug ? `/${slug}` : ""}/${tab.path}`}
                                className="link"
                                key={i}
                            >
                                {tab.name}
                            </NavLink>
                        ),
                )}
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
                {tab ? (
                    <div>{tab}</div>
                ) : (
                    <DashboardWidgetGrid
                        widgets={widgets}
                        pageId={slug ? `${slug}` : "home"}
                    />
                )}
            </section>
        </div>
    );
}

export default DashboardPage;
