import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart } from "recharts";

function Chart({ data, config }) {
	const chartData = data || [
		{ month: "January", desktop: 186, mobile: 80 },
		{ month: "February", desktop: 305, mobile: 200 },
		{ month: "March", desktop: 237, mobile: 120 },
		{ month: "April", desktop: 73, mobile: 190 },
		{ month: "May", desktop: 209, mobile: 130 },
		{ month: "June", desktop: 214, mobile: 140 },
	];

	const chartConfig = config || {
		desktop: {
			label: "Desktop",
			color: "#2563eb",
		},
		mobile: {
			label: "Mobile",
			color: "#60a5fa",
		},
	};

	return (
		<div className="chart-wrapper">
			<ChartContainer config={chartConfig} className="w-full h-full">
				<BarChart accessibilityLayer data={chartData}>
					{Object.keys(chartConfig).map((c, i) => (
						<Bar key={i} dataKey={c} fill={chartConfig[c].color} radius={4} />
					))}

				</BarChart>
			</ChartContainer>
		</div>
	);
}

export default Chart;
