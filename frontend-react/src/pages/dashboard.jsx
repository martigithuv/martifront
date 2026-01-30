// src/pages/dashboard.jsx
import { useState, useEffect } from "react";

export default function Dashboard() {
  const productos = [
    { id: 1, nombre: "Botas Nike Mercurial", precio: 129.99, imagen: "/bota1.jpg" },
    { id: 2, nombre: "Adidas Predator Elite", precio: 159.99, imagen: "/botas2.jpg" },
    { id: 3, nombre: "Puma Ultra Speed", precio: 110.0, imagen: "/botas3.png" },
  ];

  const [cistella, setCistella] = useState([]);
  const [cistellaOberta, setCistellaOberta] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = "USER_ID_AQUI"; // Reemplazar con el ID real del usuario autenticado

  useEffect(() => {
    cargarCistella();
  }, []);

  const cargarCistella = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cistella/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCistella(data);
      }
    } catch (error) {
      console.error('Error carregant la cistella:', error);
    }
  };

  const afegirACistella = async (producto) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/cistella/afegir', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          userId: userId,
          productoId: producto.id,
          quantitat: 1
        })
      });

      if (response.ok) {
        setCistella([...cistella, producto]);
      } else {
        console.error('Error afegint producte');
      }
    } catch (error) {
      console.error('Error afegint a cistella:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducte = async (itemId, index) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cistella/eliminar/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const novaCistella = cistella.filter((_, i) => i !== index);
        setCistella(novaCistella);
      }
    } catch (error) {
      console.error('Error eliminant producte:', error);
    }
  };

  const buidarCistella = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cistella/buidar/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCistella([]);
      }
    } catch (error) {
      console.error('Error buidant cistella:', error);
    }
  };

  const total = cistella.reduce((sum, p) => sum + p.precio, 0);

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* HEADER */}
      <header className="backdrop-blur-md bg-white/70 sticky top-0 z-40 shadow-sm border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          
          <h1 className="text-3xl font-extrabold text-gray-900">
            MartiShop
          </h1>

          <div className="flex items-center space-x-6">
            <nav className="space-x-6 text-gray-700 font-medium">
              <a href="/login" className="hover:text-blue-600">Login</a>
              <a href="/register" className="hover:text-blue-600">Registro</a>
            </nav>

            {/* CISTELLA PLEGADA */}
            <button
              onClick={() => setCistellaOberta(!cistellaOberta)}
              className="relative text-2xl"
            >
              🛒
              {cistella.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cistella.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CISTELLA DESPLEGADA */}
      {cistellaOberta && (
        <div className="absolute right-6 top-24 w-80 bg-white shadow-xl rounded-2xl p-6 z-50 border">
          <h3 className="text-xl font-bold mb-4">Cistella</h3>

          {cistella.length === 0 ? (
            <p className="text-gray-500">La cistella està buida</p>
          ) : (
            <>
              <ul className="space-y-3">
                {cistella.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span>{item.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.precio}€</span>
                      <button
                        onClick={() => eliminarProducte(item._id, index)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>

              <button
                onClick={buidarCistella}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Buidar cistella
              </button>
            </>
          )}

          <button
            onClick={() => setCistellaOberta(false)}
            className="mt-4 w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
          >
            Tancar
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-5xl font-extrabold mb-4">MartiShop</h2>
          <p className="text-xl">La tenda líder de botes de futbol</p>
        </div>
      </section>

      {/* PRODUCTOS */}
      <main className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Productos Destacados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="bg-gray-100 rounded-xl h-56 mb-5 flex items-center justify-center">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="object-contain h-full"
                />
              </div>

              <h3 className="text-xl font-semibold">{producto.nombre}</h3>
              <p className="text-3xl font-bold text-blue-600 mt-3">
                {producto.precio}€
              </p>

              <button
                onClick={() => afegirACistella(producto)}
                disabled={loading}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Afegint...' : 'Afegir a la cistella'}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-20">
        <div className="text-center py-6 text-gray-600 text-sm">
          © {new Date().getFullYear()} MartiShop
        </div>
      </footer>
    </div>
  );
}