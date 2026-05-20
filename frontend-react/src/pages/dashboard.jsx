// src/pages/dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cistella, setCistella] = useState([]);
  const [cistellaOberta, setCistellaOberta] = useState(false);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId") || "USER_ID_AQUI";

  useEffect(() => {
    loadProducts();
    // Cargar desde localStorage si existe, o del backend
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length > 0) {
      setCistella(savedCart);
    } else {
      loadCart();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/products");
      if (resp.ok) {
        const data = await resp.json();
        setProductos(data);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  // Sincronizar con localStorage cada vez que cambie la cistella
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cistella));
  }, [cistella]);

  const loadCart = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cistella/" + userId);
      if (response.ok) {
        const data = await response.json();
        // data es { success: true, userId, cistella: [] } según el controller mock
        if (data.cistella) setCistella(data.cistella);
      }
    } catch (error) {
      console.error("Error cargando la cistella:", error);
    }
  };

  const addToCart = async (producto) => {
    setLoading(true);
    try {
      // Mock de envío al backend (opcional si usamos localStorage)
      await fetch("http://localhost:3000/api/cistella/afegir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productoId: producto.id, quantitat: 1 })
      });

      setCistella((current) => [...current, producto]);
    } catch (error) {
      console.error("Error al agregar a la cistella:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId, index) => {
    try {
      await fetch("http://localhost:3000/api/cistella/eliminar/" + itemId, { method: "DELETE" });
      const updated = cistella.filter((_, i) => i !== index);
      setCistella(updated);
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  const emptyCart = async () => {
    try {
      await fetch("http://localhost:3000/api/cistella/buidar/" + userId, { method: "DELETE" });
      setCistella([]);
    } catch (error) {
      console.error("Error vaciando la cistella:", error);
    }
  };

  const total = cistella.reduce((sum, p) => sum + p.precio, 0);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="backdrop-blur-md bg-white/70 sticky top-0 z-40 shadow-sm border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-3xl font-extrabold text-gray-900 cursor-pointer" onClick={() => navigate("/")}>MartiShop</h1>
          <div className="flex items-center space-x-6">
            <nav className="space-x-6 text-gray-700 font-medium">
              <a href="/login" className="hover:text-blue-600">Login</a>
              <a href="/register" className="hover:text-blue-600">Registro</a>
            </nav>
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
      {cistellaOberta && (
        <div className="fixed right-6 top-24 w-80 bg-white shadow-2xl rounded-2xl p-6 z-50 border border-gray-100">
          <h3 className="text-xl font-bold mb-4">Tu Cistella</h3>
          {cistella.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Está vacía</p>
          ) : (
            <>
              <ul className="space-y-3 max-h-60 overflow-auto pr-2">
                {cistella.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg">
                    <span className="truncate mr-2 font-medium">{item.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600">{item.precio}€</span>
                      <button
                        onClick={() => removeFromCart(item.id || index, index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">{total.toFixed(2)}€</span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition"
              >
                Pagar pedido
              </button>
              <button
                onClick={emptyCart}
                className="mt-2 w-full text-red-500 text-sm hover:underline"
              >
                Vaciar todo
              </button>
            </>
          )}
          <button
            onClick={() => setCistellaOberta(false)}
            className="mt-4 w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 text-gray-600 text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      )}

      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-5xl font-extrabold mb-4">MartiShop</h2>
          <p className="text-xl">La tenda líder de botes de futbol</p>
        </div>
      </section>
      <main className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productos.map((producto) => (
            <div key={producto._id || producto.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="bg-gray-100 rounded-xl h-56 mb-5 flex items-center justify-center">
                <img src={producto.image || producto.imagen} alt={producto.name || producto.nombre} className="object-contain h-full" />
              </div>
              <h3 className="text-xl font-semibold">{producto.name || producto.nombre}</h3>
              <p className="text-3xl font-bold text-blue-600 mt-3">{producto.price || producto.precio}€</p>
              <button
                onClick={() => addToCart({
                  id: producto._id || producto.id,
                  nombre: producto.name || producto.nombre,
                  precio: producto.price || producto.precio,
                  imagen: producto.image || producto.imagen
                })}
                disabled={loading}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Agregando..." : "Añadir a la cistella"}
              </button>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-white border-t mt-20">
        <div className="text-center py-6 text-gray-600 text-sm">© {new Date().getFullYear()} MartiShop</div>
      </footer>
    </div>
  );
}
