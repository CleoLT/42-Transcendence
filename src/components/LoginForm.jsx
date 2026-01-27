import { useState } from "react";

export default function LoginForm({ center = false }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessageColor("text-green-600");
        setMessage(data.message || "Login successful");
      } else {
        setMessageColor("text-red-600");
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      setMessageColor("text-red-600");
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const formClass = center
    ? "flex flex-col gap-2 items-center text-center"
    : "flex flex-col gap-2 items-end text-right";

  return (
    <form onSubmit={handleSubmit} className={formClass}>
      <div className="flex flex-col gap-1 w-full sm:w-64">
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-2 py-1 rounded border border-black/40 text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-2 py-1 rounded border border-black/40 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-1 px-3 py-1 rounded bg-black text-white text-xs sm:text-sm disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Login"}
      </button>
      {message && (
        <div className={`mt-1 text-xs sm:text-sm ${messageColor}`}>
          {message}
        </div>
      )}
    </form>
  );
}

