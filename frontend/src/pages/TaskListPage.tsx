import { useEffect, useState } from "react";
import axios from "axios";

type Forecast = {
  date: string;
  temperatureC: number;
  summary: string;
};

export default function TaskListPage() {
  const [items, setItems] = useState<Forecast[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL; // <-- brak hardcoded URL

    axios
      .get<Forecast[]>(`${baseUrl}/WeatherForecast`) // <-- GET
      .then((res) => setItems(res.data))
      .catch(() => setError("Błąd pobierania danych z API"));
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Lista danych</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {items.map((x) => (
          <li key={x.date}>
            {x.date} — {x.summary} — {x.temperatureC}°C
          </li>
        ))}
      </ul>
    </div>
  );
}