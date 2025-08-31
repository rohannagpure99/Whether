import { useState } from "react";
import "./App.css";

const weatherCodeMap = {
  0: "☀️ Clear sky",
  1: "🌤 Mainly clear",
  2: "⛅ Partly cloudy",
  3: "☁️ Overcast",
  45: "🌫 Fog",
  48: "🌫 Depositing rime fog",
  51: "🌦 Light drizzle",
  53: "🌦 Moderate drizzle",
  55: "🌧 Dense drizzle",
  61: "🌧 Light rain",
  63: "🌧 Moderate rain",
  65: "🌧 Heavy rain",
  71: "❄️ Light snow fall",
  73: "❄️ Moderate snow fall",
  75: "❄️ Heavy snow fall",
  77: "🌨 Snow grains",
  80: "🌦 Rain showers",
  81: "🌧 Moderate showers",
  82: "⛈ Heavy showers",
  85: "🌨 Snow showers",
  86: "❄️ Heavy snow showers",
  95: "⛈ Thunderstorm",
  96: "⛈ Thunderstorm with hail",
  99: "⛈ Severe thunderstorm with hail",
};

function getWeatherDescription(code) {
  return weatherCodeMap[code] || "❓ Unknown";
}

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      setError("");
      setWeather(null);

      // Geocoding API
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("❌ City not found. Try again!");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Weather API (current only)
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        country,
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        condition: getWeatherDescription(
          weatherData.current_weather.weathercode
        ),
      });
    } catch (err) {
      setError("⚠️ Something went wrong: " + err.message);
    }
  };

  return (
    <div className="weather-container">
      <h1>🌤️ Weather Now</h1>
      <input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <br />
      <button onClick={fetchWeather}>Check Weather</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>🌍 {weather.city}, {weather.country}</h2>
          <p>🌡 Temperature: {weather.temp}°C</p>
          <p>💨 Wind Speed: {weather.wind} km/h</p>
          <p>{weather.condition}</p>
        </div>
      )}
    </div>
  );
}
