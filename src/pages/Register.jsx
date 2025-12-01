import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/accounts/register/", {
        username,
        email,
        password,
        role: "user",
      });

      
      localStorage.setItem("weglowUser", JSON.stringify(res.data.user));

      navigate("/");
      window.dispatchEvent(new Event("userLogin"));
    } catch (err) {
      console.error(err.response?.data);
      if (err.response?.data) {
     
        const messages = Object.values(err.response.data)
          .flat()
          .join(" ");
        setError(messages);
      } else {
        setError("Registration failed.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-md p-6 rounded-lg w-96 space-y-4"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full rounded"
          autoComplete="off"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
          autoComplete="off"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
          autoComplete="new-password"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >
          Register
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
