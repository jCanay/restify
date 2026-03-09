import "../css/dashboard-page.css";
import { horizontalCompactor, ReactGridLayout, Responsive, ResponsiveGridLayout, useContainerWidth, verticalCompactor } from "react-grid-layout";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button"
import Chart from "../widgets/Chart";
import { NavLink, Outlet, useLocation } from "react-router";

const remToPx = (rem) =>
	rem * parseFloat(getComputedStyle(document.documentElement).fontSize)

const generateLayout = (components, cols) =>
	components.map((_, i) => {
		return { i: `${i}`, x: i % cols, y: Math.trunc(i / cols), w: 1, h: 1 }
	});

function DashboardPage({ title, tabs, currentPath, widgets }) {
	const { width, containerRef, mounted } = useContainerWidth()
	const gridBreakpoints = { lg: 1700, md: 1300, sm: 992, xs: 600, xxs: 0 }
	const gridCols = { lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }
	const isRootPath = useLocation().pathname === `/dashboard/${currentPath}`;

	const layouts = useMemo(() => {
		return {
			lg: generateLayout(widgets, gridCols.lg),
			md: generateLayout(widgets, gridCols.md),
			sm: generateLayout(widgets, gridCols.sm),
			xs: generateLayout(widgets, gridCols.xs),
		}
	}, [widgets, gridCols.lg, gridCols.md, gridCols.sm, gridCols.xs])

	useEffect(() => {
		if (isRootPath) {
			const timer = setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [isRootPath]);

	return (
		<div className="dashboard-page custom-scroll">
			<h2>{title}</h2>
			<section className="tabs">
				<NavLink to={`/dashboard/${currentPath}`} end className="link" title="Vista de Widgets">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#e3e3e3"
					>
						<path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z" />
					</svg>
				</NavLink>
				{tabs.map((tab, i) => {
					if (tab.name) {
						return <NavLink to={tab.path} className="link" key={i}>{tab.name}</NavLink>;
					}
				})}
				{isRootPath && (
					<>
						<button className="link">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-120v-320H120v-80h320v-320h80v320h320v80H520v320h-80Z" /></svg>
						</button>
						<button className="link">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24px"
								viewBox="0 -960 960 960"
								width="24px"
								fill="#e3e3e3"
							>
								<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z" />
							</svg>
						</button>

					</>
				)}

			</section>
			<section className="components">
				<Outlet />
				<div ref={containerRef} style={{ display: !isRootPath && "none" }}>
					{mounted && width > 0 && (
						<ResponsiveGridLayout
							className="grid"
							layouts={layouts}
							width={width + remToPx(2) * 2}
							breakpoints={gridBreakpoints}
							cols={gridCols}
							rowHeight={250}
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
	)
}

export default DashboardPage
