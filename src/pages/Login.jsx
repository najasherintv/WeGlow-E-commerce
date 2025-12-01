import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectPath = location.state?.from || "/";

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
        username: email,
        password: password,
      });

      const { tokens, user } = res.data;

      
      localStorage.setItem("weglowUser", JSON.stringify(user));
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      
      window.dispatchEvent(new Event("userLogin"));

      
      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed. Try again.");
    }
  };

 
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: "420197014682-prglasjfur37g1a5mjc7a66i64cm3694.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large", width: 300 } 
    );

    window.google.accounts.id.prompt(); 
  }, []);

  const handleGoogleResponse = async (response) => {
    const googleToken = response.credential;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/google-login/",
        { token: googleToken }
      );

      const { tokens, user } = res.data;

      
      localStorage.setItem("weglowUser", JSON.stringify(user));
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);

      window.dispatchEvent(new Event("userLogin"));

      if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/b4/26/75/b42675db8286b1493e3dea5434305337.jpg')",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-md shadow-lg p-10 rounded-xl w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-pink-300 p-3 w-full rounded bg-pink-50/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-pink-300 p-3 w-full rounded bg-pink-50/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />

        <button
          type="submit"
          className="bg-pink-500 text-white w-full p-2 rounded hover:bg-pink-600 transition-colors"
        >
          Login
        </button>

        {/* Google Sign-In */}
        <div id="googleBtn" className="mt-4 flex justify-center"></div>

        <p className="text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
