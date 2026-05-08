import { useEffect, useMemo } from "react";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import { WIDGET_REGISTRY } from "../WidgetRegistry";
import { useParams } from "react-router";
import "./css/dashboard-widget-grid.css";

const remToPx = (rem) =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

const getResponsiveLayouts = (widgets) => {
    const layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };

    if (!widgets || widgets.length === 0) return layouts;

    widgets.forEach((widget) => {
        const identifier = widget.name;
        if (widget.layouts) {
            Object.keys(widget.layouts).forEach((breakpoint) => {
                if (layouts[breakpoint]) {
                    layouts[breakpoint].push({
                        i: identifier,
                        ...widget.layouts[breakpoint],
                    });
                }
            });
        }
    });

    return layouts;
};

export default function DashboardWidgetGrid({ widgets, pageId }) {
    const { width, containerRef, mounted } = useContainerWidth();
    const gridCols = { lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 };
    const gridBreakpoints = { lg: 1700, md: 1500, sm: 992, xs: 600, xxs: 0 };

    const layouts = useMemo(() => {
        const saved = localStorage.getItem(`dashboard-layout-${pageId}`);

        if (saved) {
            const parsed = JSON.parse(saved);

            const firstBreakpoint = Object.keys(parsed)[0];

            if (parsed[firstBreakpoint]?.length === widgets.length) {
                return parsed;
            }
        }

        if (widgets.length > 0) {
            return getResponsiveLayouts(widgets);
        }

        return { lg: [], md: [], sm: [], xs: [], xxs: [] };
    }, [widgets, pageId]);

    const handleLayoutChange = (currentLayout, allLayouts) => {
        const layoutsString = JSON.stringify(allLayouts);

        localStorage.setItem(`dashboard-layout-${pageId}`, layoutsString);
        console.log("Layout successfully persisted:", allLayouts);
        // syncLayoutWithBackend(userId, currentPath, allLayouts);
    };

    return (
        <div
            className="dashboard-widget-grid"
            ref={containerRef}
            // style={{ display: isRootPath && "none" }}
        >
            {mounted && width > 0 && widgets.length > 0 && (
                <ResponsiveGridLayout
                    key={pageId}
                    onLayoutChange={handleLayoutChange}
                    className="grid"
                    layouts={layouts}
                    width={width + remToPx(2) * 2}
                    breakpoints={gridBreakpoints}
                    cols={gridCols}
                    rowHeight={300}
                    margin={[remToPx(2), remToPx(2)]}
                    dragConfig={{
                        handle: ".drag-handle",
                    }}
                >
                    {widgets.map((widget, index) => {
                        const SelectedWidget = WIDGET_REGISTRY[widget.type];
                        return (
                            <div key={widget.type}>
                                {SelectedWidget && (
                                    <SelectedWidget {...{ pageId }} />
                                )}
                            </div>
                        );
                    })}
                </ResponsiveGridLayout>
            )}
        </div>
    );
}
