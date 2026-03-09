import "../css/dashboard-page.css";
import {
    ResponsiveGridLayout,
    useContainerWidth,
    verticalCompactor,
} from "react-grid-layout";
import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { LayoutDashboard, Plus, SquarePen } from "lucide-react";

const remToPx = (rem) =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

const generateLayout = (components, cols) =>
    components.map((_, i) => {
        return { i: `${i}`, x: i % cols, y: Math.trunc(i / cols), w: 1, h: 1 };
    });

function DashboardPage({ title, tabs, currentPath, widgets }) {
    const { width, containerRef, mounted } = useContainerWidth();
    const gridBreakpoints = { lg: 1700, md: 1500, sm: 992, xs: 600, xxs: 0 };
    const gridCols = { lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 };
    const isRootPath = useLocation().pathname === `/dashboard${currentPath}`;

    const savedLayouts = useMemo(() => {
        const saved = localStorage.getItem(`dashboard-layout-${currentPath}`);
        return saved ? JSON.parse(saved) : null;
    }, [currentPath]);

    const layouts = useMemo(() => {
        if (savedLayouts) return savedLayouts;

        return {
            lg: generateLayout(widgets, gridCols.lg),
            md: generateLayout(widgets, gridCols.md),
            sm: generateLayout(widgets, gridCols.sm),
            xs: generateLayout(widgets, gridCols.xs),
        };
    }, [widgets, gridCols.lg, gridCols.md, gridCols.sm, gridCols.xs]);

    useEffect(() => {
        if (isRootPath) {
            const timer = setTimeout(() => {
                window.dispatchEvent(new Event("resize"));
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isRootPath]);

    const handleLayoutChange = (currentLayout, allLayouts) => {
        const layoutsString = JSON.stringify(allLayouts);

        localStorage.setItem(`dashboard-layout-${currentPath}`, layoutsString);
        // syncLayoutWithBackend(userId, currentPath, allLayouts);
    };

    return (
        <div className="dashboard-page">
            <h2>{title}</h2>
            <section className="tabs">
                <NavLink
                    to={`/dashboard${currentPath}`}
                    end
                    className="link"
                    title="Vista de Widgets"
                >
                    <LayoutDashboard strokeWidth={2} />
                </NavLink>
                {tabs.map((tab, i) => {
                    if (tab.name) {
                        return (
                            <NavLink to={tab.path} className="link" key={i}>
                                {tab.name}
                            </NavLink>
                        );
                    }
                })}
                {isRootPath && (
                    <>
                        <button className="link">
                            <Plus strokeWidth={2} />
                        </button>
                        <button className="link">
                            <SquarePen strokeWidth={2} />
                        </button>
                    </>
                )}
            </section>
            <section className="components">
                <Outlet />
                <div
                    className="grid-container"
                    ref={containerRef}
                    style={{ display: !isRootPath && "none" }}
                >
                    {mounted && width > 0 && (
                        <ResponsiveGridLayout
                            onLayoutChange={handleLayoutChange}
                            className="grid"
                            layouts={layouts}
                            width={width + remToPx(2) * 2}
                            breakpoints={gridBreakpoints}
                            cols={gridCols}
                            rowHeight={300}
                            margin={[remToPx(2), remToPx(2)]}
                            autoSize={true}
                            compactor={verticalCompactor}
                            
                            dragConfig={{
                                handle: ".drag-handle",
                            }}
                        >
                            {widgets.map((Component, index) => {
                                return <div key={`${index}`}>{Component}</div>;
                            })}
                        </ResponsiveGridLayout>
                    )}
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;
