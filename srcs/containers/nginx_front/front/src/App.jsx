import { useState } from "react";

export default function App() {
  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginResult, setLoginResult] = useState(null);

  // Register state
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regResult, setRegResult] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://localhost:8080/api/users/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);
      setLoginResult(data);
    } catch (err) {
      console.error("Login failed:", err);
      setLoginResult({ error: "Request failed" });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          email: regEmail,
        }),
      });

      const data = await res.json();
      console.log("Register response:", data);
      setRegResult(data);
    } catch (err) {
      console.error("Register failed:", err);
      setRegResult({ error: "Request failed" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="flex gap-8">
        {/* LOGIN FORM */}
        <form
          onSubmit={handleLogin}
          className="bg-gray-800 p-6 rounded-lg w-80 space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">Login</h1>

          <input
            type="text"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
          >
            Send
          </button>

          {loginResult && (
            <pre className="text-xs bg-black p-2 rounded overflow-auto">
              {JSON.stringify(loginResult, null, 2)}
            </pre>
          )}
        </form>

        {/* REGISTER FORM */}
        <form
          onSubmit={handleRegister}
          className="bg-gray-800 p-6 rounded-lg w-80 space-y-4"
        >
          <h1 className="text-2xl font-bold text-center">Create Account</h1>

          <input
            type="text"
            placeholder="Username"
            value={regUsername}
            onChange={(e) => setRegUsername(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 p-2 rounded font-semibold"
          >
            Create
          </button>

          {regResult && (
            <pre className="text-xs bg-black p-2 rounded overflow-auto">
              {JSON.stringify(regResult, null, 2)}
            </pre>
          )}
        </form>
      </div>
    </div>
  );
}

