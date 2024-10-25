// src/components/WeatherChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import 'chart.js/auto';

const WeatherChart = ({ city, data }) => {
  const chartData = {
    labels: data.map(item => new Date(item.dt * 1000).toLocaleDateString()),
    datasets: [
      {
        label: 'Average Temperature (°C)',
        data: data.map(item => item.averageTemp),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'Max Temperature (°C)',
        data: data.map(item => item.maxTemp),
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
      },
      {
        label: 'Min Temperature (°C)',
        data: data.map(item => item.minTemp),
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="weather-chart">
      <h2 className="text-xl font-bold text-center mb-4">Weather Trends for {city}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default WeatherChart;
