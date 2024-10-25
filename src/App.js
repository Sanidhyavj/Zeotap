import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";
import WeatherChart from "./components/WeatherChart";

const App = () => {
  const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];
  const [weatherData, setWeatherData] = useState({});
  const [dailyWeatherData, setDailyWeatherData] = useState({});
  const [isTemperatureinKelvin, setTemperatureToKelvin] = useState(false);

  // State for temperature thresholds
  const [temperatureThreshold, setTemperatureThreshold] = useState(45); // Upper threshold default
  const [lowerTemperatureThreshold, setLowerTemperatureThreshold] = useState(5); // Lower threshold default

  // Input states for thresholds
  const [inputThreshold, setInputThreshold] = useState(45);
  const [inputLowerThreshold, setInputLowerThreshold] = useState(5);

  const apiKey = "1eef475934864b20176c69a201e9ffc6";

  const fetchWeatherData = async () => {
    const data = {};
    const dailyData = { ...dailyWeatherData };

    for (let city of cities) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        data[city] = response.data;

        const currentTemp = response.data.main.temp;
        const currentHumidity = response.data.main.humidity;
        const currentWindSpeed = response.data.wind.speed;

        // Alert for exceeding the upper threshold
        if (currentTemp > temperatureThreshold) {
          console.warn(
            `ALERT: Temperature in ${city} has exceeded ${temperatureThreshold}°C! Current Temperature: ${currentTemp}°C`
          );
        }

        // Alert for going below the lower threshold
        if (currentTemp < lowerTemperatureThreshold) {
          console.warn(
            `ALERT: Temperature in ${city} has dropped below ${lowerTemperatureThreshold}°C! Current Temperature: ${currentTemp}°C`
          );
        }

        if (!dailyData[city]) {
          dailyData[city] = []; // Initialize array if undefined
        }
        dailyData[city].push({
          temp: currentTemp,
          feels_like: response.data.main.feels_like,
          humidity: currentHumidity,
          wind_speed: currentWindSpeed,
          weather: response.data.weather[0].main,
          dt: response.data.dt,
        });
      } catch (error) {
        console.error(`Error fetching weather data for ${city}`, error);
      }
    }

    setWeatherData(data);
    setDailyWeatherData(dailyData);
  };

  const calculateCitySummary = (cityData) => {
    if (!cityData || cityData.length === 0) return {}; // Handle case where cityData is undefined or empty

    const temps = cityData.map((entry) => entry.temp);
    const humidities = cityData.map((entry) => entry.humidity);
    const windSpeeds = cityData.map((entry) => entry.wind_speed);

    const conditionCount = cityData.reduce((acc, entry) => {
      acc[entry.weather] = (acc[entry.weather] || 0) + 1;
      return acc;
    }, {});

    const dominantCondition = Object.keys(conditionCount).reduce((a, b) =>
      conditionCount[a] > conditionCount[b] ? a : b
    );

    return {
      averageTemp: (
        temps.reduce((sum, temp) => sum + temp, 0) / temps.length
      ).toFixed(2),
      maxTemp: Math.max(...temps).toFixed(2),
      minTemp: Math.min(...temps).toFixed(2),

      averageHumidity: (
        humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length
      ).toFixed(2),
      maxHumidity: Math.max(...humidities).toFixed(2),
      minHumidity: Math.min(...humidities).toFixed(2),

      averageWindSpeed: (
        windSpeeds.reduce((sum, wind) => sum + wind, 0) / windSpeeds.length
      ).toFixed(2),
      maxWindSpeed: Math.max(...windSpeeds).toFixed(2),
      minWindSpeed: Math.min(...windSpeeds).toFixed(2),

      dominantCondition: dominantCondition,
    };
  };

  // Handle form submission to update the thresholds
  const handleThresholdSubmit = (e) => {
    e.preventDefault();
    setTemperatureThreshold(inputThreshold); // Update the upper threshold
    setLowerTemperatureThreshold(inputLowerThreshold); // Update the lower threshold
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, [temperatureThreshold, lowerTemperatureThreshold]); // Re-run effect when thresholds change

  return (
    <Fragment>
      {/* Form for setting custom temperature thresholds */}
      <div className="absolute top-4 left-4">
        <form onSubmit={handleThresholdSubmit} className="mb-4">
          <label className="block text-[#f1d3b2] mb-2">
            Set Upper Temperature Threshold (°C):
          </label>
          <input
            type="number"
            value={inputThreshold}
            onChange={(e) => setInputThreshold(e.target.value)}
            className="px-4 py-2 rounded-lg text-black "
          />

          <label className="block text-[#f1d3b2] mb-2 mt-4">
            Set Lower Temperature Threshold (°C):
          </label>
          <input
            type="number"
            value={inputLowerThreshold}
            onChange={(e) => setInputLowerThreshold(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
          />

          <button
            type="submit"
            className="bg-black text-[#f1d3b2] font-semibold py-2 px-4 ml-2 mt-4 rounded-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
          >
            Set Thresholds
          </button>
        </form>
        <div>
          <p className="text-[#f1d3b2]">Current Upper Threshold: {temperatureThreshold}°C</p>
          <p className="text-[#f1d3b2]">Current Lower Threshold: {lowerTemperatureThreshold}°C</p>
        </div>
      </div>

      {/* Temperature unit switch */}
      <div className="absolute top-4 right-4">
        <button
          className="bg-black text-[#f1d3b2] font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
          onClick={
            isTemperatureinKelvin
              ? () => setTemperatureToKelvin(false)
              : () => setTemperatureToKelvin(true)
          }
        >
          {isTemperatureinKelvin ? "Kelvin" : "Degree"}
        </button>
      </div>

      {/* Main content */}
      <div className="bg-gradient-to-b from-[#46211a] to-[#46211a] min-h-screen p-8">
        <h1 className="text-4xl font-bold text-center text-[#f1d3b2] mb-10">
          Weather in Major Cities
        </h1>

        {/* Add spacing to avoid overlap */}
        <div className="mt-32"> {/* Adjusted margin-top to create space */} 
          {cities.map((city) => {
            const cityData = dailyWeatherData[city] || []; // Provide default empty array if data is undefined
            const citySummary = calculateCitySummary(cityData);

            return (
              <div key={city} className="mb-12">
                <h2 className="text-3xl font-semibold text-center text-[#f1d3b2] mb-6">
                  {city}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">
                  <WeatherCard
                    title="Main"
                    value={
                      weatherData[city]?.weather
                        ? weatherData[city].weather[0].main
                        : ""
                    }
                  />
                  <WeatherCard
                    title="Feels Like"
                    value={
                      weatherData[city]?.main
                        ? `${isTemperatureinKelvin
                          ? (weatherData[city].main.feels_like + 273).toFixed(2) + "K"
                          : weatherData[city].main.feels_like.toFixed(2) + "°C"}`
                        : ""
                    }
                  />
                  <WeatherCard
                    title="Temperature"
                    value={
                      weatherData[city]?.main
                        ? `${isTemperatureinKelvin
                          ? (weatherData[city].main.temp + 273).toFixed(2) + "K"
                          : weatherData[city].main.temp.toFixed(2) + "°C"}`
                        : ""
                    }
                  />
                  <WeatherCard
                    title="Humidity"
                    value={weatherData[city]?.main ? `${weatherData[city].main.humidity}%` : ""}
                  />
                  <WeatherCard
                    title="Wind Speed"
                    value={weatherData[city]?.wind ? `${weatherData[city].wind.speed} m/s` : ""}
                  />
                  <WeatherCard
                    title="Date/Time"
                    value={
                      weatherData[city]?.dt
                        ? new Date(weatherData[city].dt * 1000).toLocaleString()
                        : ""
                    }
                  />

                  {/* Daily aggregates for each city */}
                  <WeatherCard
                    title="Average Temp"
                    value={
                      citySummary.averageTemp
                        ? `${isTemperatureinKelvin
                          ? (parseFloat(citySummary.averageTemp) + 273).toFixed(2) + "K"
                          : citySummary.averageTemp + "°C"}`
                        : ""
                    }
                  />
                  <WeatherCard
                    title="Max Temp"
                    value={
                      citySummary.maxTemp
                        ? `${isTemperatureinKelvin
                          ? (parseFloat(citySummary.maxTemp) + 273).toFixed(2) + "K"
                          : citySummary.maxTemp + "°C"}`
                        : ""
                    }
                  />
                  <WeatherCard
                    title="Min Temp"
                    value={
                      citySummary.minTemp
                        ? `${isTemperatureinKelvin
                          ? (parseFloat(citySummary.minTemp) + 273).toFixed(2) + "K"
                          : citySummary.minTemp + "°C"}`
                        : ""
                    }
                  />
                  <WeatherCard
                    title="Average Humidity"
                    value={citySummary.averageHumidity ? `${citySummary.averageHumidity}%` : ""}
                  />
                  <WeatherCard
                    title="Max Humidity"
                    value={citySummary.maxHumidity ? `${citySummary.maxHumidity}%` : ""}
                  />
                  <WeatherCard
                    title="Min Humidity"
                    value={citySummary.minHumidity ? `${citySummary.minHumidity}%` : ""}
                  />
                  <WeatherCard
                    title="Average Wind Speed"
                    value={citySummary.averageWindSpeed ? `${citySummary.averageWindSpeed} m/s` : ""}
                  />
                  <WeatherCard
                    title="Max Wind Speed"
                    value={citySummary.maxWindSpeed ? `${citySummary.maxWindSpeed} m/s` : ""}
                  />
                  <WeatherCard
                    title="Min Wind Speed"
                    value={citySummary.minWindSpeed ? `${citySummary.minWindSpeed} m/s` : ""}
                  />
                  <WeatherCard
                    title="Dominant Condition"
                    value={citySummary.dominantCondition ? citySummary.dominantCondition : ""}
                  />
                </div>

                {/* Add weather chart for each city */}
                {/* <WeatherChart city={city} data={cityData} /> */}
              </div>
            );
          })}
        </div>
      </div>
    </Fragment>
  );
};

export default App;
