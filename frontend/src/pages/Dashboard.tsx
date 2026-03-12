import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

type TaskItem = {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  isDone: boolean;
};

function getApiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (!url) throw new Error("Brak VITE_API_URL w frontend/.env");
  return url;
}

function formatApiError(err: unknown): string {
  const e = err as AxiosError<any>;
  const status = e.response?.status;

  // brak odpowiedzi (np. backend nie działa)
  if (!status) return "Brak odpowiedzi z serwera (network error / backend nie działa).";

  if (status === 400) {
    const data = e.response?.data;
    const validation = data?.errors;

    // typowy format błędów walidacji z ASP.NET
    if (validation) {
      const messages = Object.values(validation).flat().join(" | ");
      return `400 Bad Request: ${messages}`;
    }

    return `400 Bad Request: ${data?.detail ?? "Niepoprawne dane wejściowe"}`;
  }

  if (status === 404) return "404 Not Found: Nie znaleziono zasobu (np. zły ID).";
  if (status === 500) return "500 Server Error: Błąd po stronie API.";

  return `${status}: ${e.response?.statusText ?? "Błąd API"}`;
}

export default function Dashboard() {
  const API = getApiBaseUrl();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskItem["priority"]>("Medium");

  const loadTasks = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.get<TaskItem[]>(`${API}/api/Tasks`);
      setTasks(res.data);
      setMessage("✅ 200 OK: Pobrano listę zadań.");
    } catch (err) {
      setMessage("❌ " + formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTask = async () => {
    setMessage("");

    // walidacja po stronie klienta (dodatkowo)
    if (title.trim().length < 3) {
      setMessage("⚠️ Walidacja klienta: tytuł musi mieć min. 3 znaki.");
      return;
    }

    try {
      // ✅ nie trzymamy "res", jeśli go nie używamy (TS6133 znika)
      await axios.post(`${API}/api/Tasks`, { title, priority });

      setMessage("✅ 201 Created: Dodano zadanie.");
      setTitle("");
      await loadTasks();
    } catch (err) {
      setMessage("❌ " + formatApiError(err));
    }
  };

  const toggleDone = async (t: TaskItem) => {
    setMessage("");

    try {
      await axios.put(`${API}/api/Tasks/${t.id}`, {
        title: t.title,
        priority: t.priority,
        isDone: !t.isDone,
      });

      setMessage("✅ 204 No Content: Zaktualizowano zadanie (PUT).");
      await loadTasks();
    } catch (err) {
      setMessage("❌ " + formatApiError(err));
    }
  };

  const deleteTask = async (id: string) => {
    setMessage("");

    try {
      await axios.delete(`${API}/api/Tasks/${id}`);

      setMessage("✅ 204 No Content: Usunięto zadanie (DELETE).");
      await loadTasks();
    } catch (err) {
      setMessage("❌ " + formatApiError(err));
    }
  };

  const test404 = async () => {
    setMessage("");
    try {
      await axios.get(`${API}/api/Tasks/00000000-0000-0000-0000-000000000000`);
    } catch (err) {
      setMessage("🧪 Test 404: " + formatApiError(err));
    }
  };

  const test400 = async () => {
    setMessage("");
    try {
      // celowo błędne dane (powinno dać 400)
      await axios.post(`${API}/api/Tasks`, { title: "a", priority: "SUPER" });
    } catch (err) {
      setMessage("🧪 Test 400: " + formatApiError(err));
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Dashboard (walidacja i błędy)</h1>

      <p>
        <b>API:</b> {API}
      </p>

      {message && <p>{message}</p>}

      <hr />

      <h2>Dodaj zadanie (POST)</h2>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tytuł (min 3 znaki)"
          style={{ padding: 8, minWidth: 260 }}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskItem["priority"])}
          style={{ padding: 8 }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={createTask} style={{ padding: "8px 12px" }}>
          Dodaj
        </button>

        <button onClick={loadTasks} style={{ padding: "8px 12px" }}>
          Odśwież (GET)
        </button>

        <button onClick={test404} style={{ padding: "8px 12px" }}>
          Test 404
        </button>

        <button onClick={test400} style={{ padding: "8px 12px" }}>
          Test 400
        </button>
      </div>

      <hr />

      <h2>Lista zadań (GET)</h2>
      {loading && <p>Ładowanie...</p>}

      <ul>
        {tasks.map((t) => (
          <li key={t.id} style={{ marginBottom: 8 }}>
            <b>{t.title}</b> ({t.priority}) — {t.isDone ? "DONE" : "TODO"}{" "}
            <button onClick={() => toggleDone(t)} style={{ marginLeft: 8 }}>
              Toggle (PUT)
            </button>
            <button onClick={() => deleteTask(t.id)} style={{ marginLeft: 8 }}>
              Usuń (DELETE)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}