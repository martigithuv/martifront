// src/pages/register.jsx
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPublicidad, setAceptaPublicidad] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!aceptaTerminos) {
      setError("Debes aceptar la política de privacidad.");
      return;
    }

    try {
      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password,
          aceptaTerminos,
          aceptaPublicidad
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Error registrando usuario");
      }

      setSuccess("Registro completado. Inicia sesión para continuar.");
    } catch (err) {
      setError(err.message || "Error registrando usuario");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      {/* Tarjeta principal */}
      <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-xl border border-gray-200">

        {/* Branding */}
        <div className="text-center mb-7">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            MartiShop
          </h1>
          <p className="text-gray-600 text-sm mt-2">Crear nueva cuenta</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3 text-sm text-gray-700">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                Acepto la política de privacidad.
              </span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={aceptaPublicidad}
                onChange={(e) => setAceptaPublicidad(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                Acepto recibir publicidad y comunicaciones comerciales.
              </span>
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600">{success}</p>
          )}

          {/* Botón */}
          <button 
            type="submit"
            className="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-md"
          >
            Crear cuenta
          </button>
        </form>

        {/* Enlace */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <span className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
            Iniciar sesión
          </span>
        </p>

      </div>
    </div>
  );
}
