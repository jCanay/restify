import "../css/dashboard-page.css";
import {
	ResponsiveGridLayout,
	useContainerWidth,
} from "react-grid-layout";
import { useEffect, useMemo } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { Grid2x2, Grid2x2Plus, LayoutDashboard, LayoutGrid, SquarePen } from "lucide-react";

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
	}, [widgets, gridCols.lg, gridCols.md, gridCols.sm, gridCols.xs, savedLayouts]);

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
				<div ref={containerRef}
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
