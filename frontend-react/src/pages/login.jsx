import React, { useState } from "react";
import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const [loginRole, setLoginRole] = useState(roleParam === "admin" ? "admin" : "client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, role: loginRole })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el login");
      }

      if (data?.user?.role && data.user.role !== loginRole) {
        throw new Error("Rol incorrecto para esta cuenta");
      }

      // Guardar los tokens en la pestaña de Application (Local Storage)
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Para compatibilidad con el servicio de cistella que usa "token"
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Tarjeta principal */}
      <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-xl border border-gray-200">

        {/* Branding */}
        <div className="text-center mb-7">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            MartiShop
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Accede a tu cuenta
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>
            <span className="block text-sm font-medium text-gray-700">
              Tipo de usuario
            </span>
            <div className="mt-2 flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="loginRole"
                  value="client"
                  checked={loginRole === "client"}
                  onChange={() => setLoginRole("client")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                Cliente
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  name="loginRole"
                  value="admin"
                  checked={loginRole === "admin"}
                  onChange={() => setLoginRole("admin")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                Admin
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu.email@ejemplo.com"
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="mt-1 w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-md"
          >
            Entrar
          </button>
        </form>

        {/* Enlace */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <Link to={`/register?role=${loginRole}`} className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
