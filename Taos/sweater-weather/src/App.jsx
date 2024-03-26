import { useEffect, useState } from "react";
import "./App.css";

function useWeather(url) {
  const [data, setTemp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const result = await response.json();
        setTemp(result);
        setLoading(false);
        console.log(result.current.temperature_2m);
      } catch (error) {
        console.log("error fetching weather", error);
        setLoading(false);
      }
    };
    fetchWeather();
  }, [url]); // Removed 'data' from the dependency array

  return { data, loading };
}

const sweater = "src/assets/sweater.png";
const tshirt = "src/assets/tshirt.png";

const wearSweater = (data) => {
  if (data.current.temperature_2m >= 75) {
    console.log("its a beautiful day");
    return (
      <div className="wearSweater-details">
        <img className="clothing-img" src={tshirt} alt="a tshirt" />
        <h2>It is a beautiful day! T-shirt is good.</h2>
      </div>
    );
  } else {
    console.log("weather could be better");
    return (
      <div className="wearSweater-details">
        <img className="clothing-img" src={sweater} alt="a sweater" />
        <h2>
          Its a little chilly today. <br />A sweater is recommended.
        </h2>
      </div>
    );
  }
};

function App() {
  const { data, loading } = useWeather(
    "https://api.open-meteo.com/v1/forecast?latitude=38.3566&longitude=-121.9877&current=temperature_2m,is_day,precipitation,wind_speed_10m&hourly=&daily=&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles&forecast_days=1"
  );
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <h1>Do I need a sweater?</h1>
      <div className="main-container">
        <div className="recommendClothes">{wearSweater(data)}</div>
        <div className="details-container">
          <div className="details-column">
            <h3>Date:</h3>
            <p>{JSON.stringify(data.daily.time).replace(/["\])}[{(]/g, "")}</p>
          </div>
          <div className="details-column">
            <h3>Current Temp:</h3>
            <p>{JSON.stringify(data.current.temperature_2m)} &deg;F</p>
          </div>
          <div className="details-column">
            <h3>Current Precipitation:</h3>
            <p>{JSON.stringify(data.current.precipitation)}&quot;</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
