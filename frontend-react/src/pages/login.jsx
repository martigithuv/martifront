import React from "react";

const LoginPage = () => {
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

        {/* Formulario */}
        <form className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="tu.email@ejemplo.com"
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
          <span className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
