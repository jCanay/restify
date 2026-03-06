import "../css/dashboard-page.css";
import { ReactGridLayout, useContainerWidth } from "react-grid-layout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Chart from "../widgets/Chart";

const remToPx = (rem) =>
    rem * parseFloat(getComputedStyle(document.documentElement).fontSize);

const generateLayout = (components) =>
    components.map((_, i) => {
        return { i: `${i}`, x: i % 3, y: Math.trunc(i / 3), w: 1, h: 1 };
    });

function DashboardPage({ title, tabs, widgets }) {
    const { width, containerRef, mounted } = useContainerWidth();
    const [layout, setLayout] = useState();

    useEffect(() => {
        setLayout(generateLayout(widgets));
    }, [widgets]);

    return (
        <div className="dashboard-page">
            <h2>{title}</h2>
            <section className="tabs">
                <button className="active" title="Vista de Widgets">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e3e3e3"
                    >
                        <path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z" />
                    </svg>
                </button>
                <button>
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
                {tabs.map((tab, i) => {
                    return <button key={i}>{tab}</button>;
                })}
            </section>
            <section className="components">
                <div ref={containerRef}>
                    {mounted && (
                        <ReactGridLayout
                            className="grid"
                            layout={layout}
                            width={width + remToPx(2) * 2}
                            gridConfig={{
                                cols: 3,
                                rowHeight: 250,
                                margin: [remToPx(2), remToPx(2)],
                            }}
                            dragConfig={{
                                handle: ".drag-handle",
                            }}
                        >
                            {widgets.map((Component, index) => {
                                return <div key={`${index}`}>{Component}</div>;
                            })}
                        </ReactGridLayout>
                    )}
                </div>
                <Button>Enoc</Button>
                <Chart
                ></Chart>
            </section>
        </div>
    );
}

export default DashboardPage;
