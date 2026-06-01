import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar, Chart, Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend
);

const options = {
	responsive: true,
	maintainAspectRatio: false,

	plugins: {
		legend: {
			display: false,
		}
	},

	scales: {
		x: {
			ticks: {
				maxRotation: 0,
				minRotation: 0,
				color: '#64748b',
				callback: function (value) {
					const label = this.getLabelForValue(value);

					if (label === 'Miércoles') return 'X';
					return label ? label.charAt(0) : '';
				}
			},
			grid: {
				display: false
			}
		},
		y: {
			ticks: {
				color: '#64748b',
				stepSize: 100
			}
		}
	}
};

const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',];
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const data = {
	labels,
	datasets: [
		{
			fill: true,
			type: "line",
			label: 'Ganancias',
			data: labels.map(() => Math.floor(Math.random() * (300 - 0) + 0)),
			borderColor: '#00a63e',
			backgroundColor: '#00a63e20',
		},
		// {
		// 	label: 'Cantidad',
		// 	borderColor: '#e7000b',
		// 	data: labels.map(() => Math.floor(Math.random() * (300 - 0) + 0)),
		// 	backgroundColor: '#e7000b50',
		// },
	],
};

export default function LineChart() {
	return <div className="grow min-h-0 w-full relative">
		{/* h-48 de Tailwind (12rem o 192px) o pon style={{ height: '190px' }} */}
		<Chart type='bar' data={data} options={options} />
	</div>;
}