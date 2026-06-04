import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
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

const data = {
	labels,
	datasets: [
		{
			label: 'Reservas',
			data: labels.map(() => Math.floor(Math.random() * (300 - 0) + 0)),
			backgroundColor: 'rgba(53, 162, 235, 0.5)',
		},
	],
};

export default function BarChart() {
	return <div className="grow min-h-0 w-full relative">
		{/* h-48 de Tailwind (12rem o 192px) o pon style={{ height: '190px' }} */}
		<Bar data={data} options={options} />
	</div>;
}