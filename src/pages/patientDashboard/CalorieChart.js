// CalorieChart.js
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
    Legend,
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

function CalorieChart({ calorieData }) {
    const data = {
        labels: calorieData.map(item => item.date),
        datasets: [
            {
                label: 'Daily Caloric Intake',
                data: calorieData.map(item => item.calories),
                fill: false,
                borderColor: 'rgb(255, 99, 132)',  // Customize as you like
                tension: 0.1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Caloric Intake Over Time',
            },
        },
    };

    return <Line data={data} options={options} />;
}

export default CalorieChart;
