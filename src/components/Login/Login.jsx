import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarsBackground } from "../animate-ui/components/backgrounds/stars";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/admin");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Something went wrong");
    }
  }

  return (
    <>
        <StarsBackground
      starColor="#FFF"
      className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
    />
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-[#111827] backdrop-blur-md border border-[rgba(201,168,76,0.2)] rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-white text-2xl font-semibold mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#111827] border border-[rgba(201,168,76,0.2)] rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#111827] border border-[rgba(201,168,76,0.2)] rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none"
          />
          <button
            type="submit"
            className="bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.35)] text-white rounded-xl py-3 font-medium hover:bg-[rgba(201,168,76,0.28)] transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
    </>
  );
}