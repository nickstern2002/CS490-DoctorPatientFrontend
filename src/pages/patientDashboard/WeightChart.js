// WeightChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function WeightChart({ weightData }) {
    // weightData is expected to be an array of objects with `date` and `weight`
    const data = {
        labels: weightData.map(item => item.date),
        datasets: [
            {
                label: 'Weight Over Time',
                data: weightData.map(item => item.weight),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Weight Over Time'
            }
        }
    };

    return <Line data={data} options={options} />;
}

export default WeightChart;
