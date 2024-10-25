// src/components/WeatherCard.js
import React from "react";

const WeatherCard = ({ title, value }) => (
  <div className="bg-gradient-to-r from-[#a43820] to-[#a43820] shadow-lg rounded-lg p-6 text-center text-[#f1d3b2]">
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-xl">{value}</p>
  </div>
);

export default WeatherCard;
