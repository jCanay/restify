import "../css/dashboard-page.css";
import { ResponsiveGridLayout, useContainerWidth } from "react-grid-layout";
import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { Grid2x2Plus, LayoutGrid, SquarePen } from "lucide-react";
import { WIDGET_REGISTRY } from "../components/WidgetRegistry";
import { useDashboard } from "../hooks/useDashboard";

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

function DashboardPage({ title, currentPath }) {
	const { width, containerRef, mounted } = useContainerWidth();
	const { data, loading, error } = useDashboard(1);
	const isRootPath = useLocation().pathname === `/dashboard${currentPath}`;
	const gridBreakpoints = { lg: 1700, md: 1500, sm: 992, xs: 600, xxs: 0 };
	const gridCols = { lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 };
	const pageId = currentPath.replace("/", "");

	const pageData = useMemo(() => {
		return data?.dashboard?.[pageId];
	}, [data, pageId]);

	const widgets = useMemo(() => pageData?.widgets || [], [pageData]);
	const tabs = useMemo(() => pageData?.tabs || [], [pageData]);

	const layouts = useMemo(() => {
		const saved = localStorage.getItem(`dashboard-layout-${currentPath}`);

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
	}, [widgets, currentPath]);

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
		console.log("Layout successfully persisted:", allLayouts);
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
					<LayoutGrid />
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
							<Grid2x2Plus />
						</button>
						<button className="link">
							<SquarePen />
						</button>
					</>
				)}
			</section>
			<section className="components">
				<Outlet />
				<div
					ref={containerRef}
					style={{ display: !isRootPath && "none" }}
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
								const SelectedWidget =
									WIDGET_REGISTRY[widget.name];
								return (
									<div key={widget.name}>
										{SelectedWidget && (
											<SelectedWidget {...widget.props} />
										)}
									</div>
								);
							})}
						</ResponsiveGridLayout>
					)}
				</div>
			</section>
		</div>
	);
}

export default DashboardPage;
