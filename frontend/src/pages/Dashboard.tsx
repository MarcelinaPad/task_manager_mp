import { useEffect, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import "./Dashboard.css";

type Priority = "Low" | "Medium" | "High";

type TaskItem = {
  id: string;
  title: string;
  priority: Priority;
  isDone: boolean;
};

function apiBaseUrl(): string {
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (!url) throw new Error("Brak VITE_API_URL w frontend/.env");
  return url;
}

function errorText(err: unknown): { kind: "ok" | "err" | "warn"; text: string } {
  const e = err as AxiosError<any>;
  const status = e.response?.status;

  if (!status) return { kind: "err", text: "Brak odpowiedzi z API (backend nie działa / problem sieci)." };
  if (status === 400) return { kind: "warn", text: "400 Bad Request – dane nie przeszły walidacji." };
  if (status === 404) return { kind: "warn", text: "404 Not Found – nie znaleziono zasobu." };
  if (status >= 500) return { kind: "err", text: "Błąd serwera API (5xx)." };

  return { kind: "warn", text: `Błąd API: ${status}` };
}

function pillClass(p: Priority) {
  if (p === "Low") return "pill low";
  if (p === "Medium") return "pill medium";
  return "pill high";
}

export default function Dashboard() {
  const API = useMemo(() => apiBaseUrl(), []);

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("High");

  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "warn"; text: string } | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get<TaskItem[]>(`${API}/api/Tasks`);
      setTasks(res.data);
      setMsg({ kind: "ok", text: "Lista zadań została pobrana ✅" });
    } catch (err) {
      setMsg(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTask = async () => {
    // walidacja “po stronie UI”
    if (title.trim().length < 3) {
      setMsg({ kind: "warn", text: "Tytuł musi mieć min. 3 znaki." });
      return;
    }

    try {
      await axios.post(`${API}/api/Tasks`, { title, priority });
      setTitle("");
      setMsg({ kind: "ok", text: "Dodano zadanie ✅" });
      await loadTasks();
    } catch (err) {
      setMsg(errorText(err));
    }
  };

  const toggleDone = async (t: TaskItem) => {
    try {
      await axios.put(`${API}/api/Tasks/${t.id}`, {
        title: t.title,
        priority: t.priority,
        isDone: !t.isDone,
      });
      setMsg({ kind: "ok", text: "Zaktualizowano zadanie ✅" });
      await loadTasks();
    } catch (err) {
      setMsg(errorText(err));
    }
  };

  const removeTask = async (id: string) => {
    try {
      await axios.delete(`${API}/api/Tasks/${id}`);
      setMsg({ kind: "ok", text: "Usunięto zadanie ✅" });
      await loadTasks();
    } catch (err) {
      setMsg(errorText(err));
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="header">
          <div className="title">
            <h1 style={{ color: '#FFD54F' }}>☁️ Cloud App Dashboard CI/CD</h1>
            <p>Dodawaj zadania, ustawiaj priorytety i oznaczaj je jako wykonane.</p>
          </div>

          <div className="badge" title="Adres API z VITE_API_URL">
            <span>API</span>
            <code style={{ color: "rgba(255,255,255,0.9)" }}>{API}</code>
          </div>
        </div>

        <div className="card">
          <div className="formRow">
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wpisz nowe zadanie… (min. 3 znaki)"
            />

            <select
              className="select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <button className="button" onClick={addTask} disabled={loading}>
              Dodaj zadanie
            </button>
          </div>

          <div className="subRow">
            <span>
              {loading ? "Ładowanie..." : `Zadań: ${tasks.length}`}
            </span>
            <button className="iconBtn" onClick={loadTasks} disabled={loading} title="Odśwież listę">
              Odśwież
            </button>
          </div>

          {msg && <p className={`message ${msg.kind}`}>{msg.text}</p>}

          <div className="list">
            {tasks.map((t) => (
              <div key={t.id} className={`item ${t.isDone ? "done" : ""}`}>
                <input
                  className="check"
                  type="checkbox"
                  checked={t.isDone}
                  onChange={() => toggleDone(t)}
                  aria-label="Zmień status zadania"
                />

                <div className="itemTitle">
                  <div className="name">{t.title}</div>
                  <div className="meta">
                    <span className={pillClass(t.priority)}>{t.priority}</span>
                    <span>•</span>
                    <span>{t.isDone ? "DONE" : "TODO"}</span>
                  </div>
                </div>

                <div className="actions">
                  <button className="iconBtn" onClick={() => removeTask(t.id)} title="Usuń">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tasks.length === 0 && !loading && (
            <p className="message warn">Brak zadań. Dodaj pierwsze zadanie powyżej 🙂</p>
          )}
        </div>
      </div>
    </div>
  );
}