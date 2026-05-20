import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

// REEMPLAZAR con tu clave pública de Stripe (pk_test_...)
const stripePromise = loadStripe("pk_test_placeholder");

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    email: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length === 0) {
      navigate("/cart");
      return;
    }
    setCart(savedCart);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // 1. Crear la sesión de checkout en el backend
        const response = await fetch("http://localhost:3000/api/checkout/create-session", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                // Si tienes un sistema de autenticación, incluye el token aquí
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                products: cart.map(item => ({
                    id_producte: item.id_real || item.id, // Asegúrate de enviar el ID real de MongoDB del producto
                    quantitat: 1
                })),
                shippingDetails: formData
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear la sesión");
        }

        // 2. Redirigir a Stripe Checkout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId
        });

        if (error) {
            console.error("Stripe Error:", error);
            alert(error.message);
        }

    } catch (error) {
        console.error("Checkout handle error:", error);
        alert(error.message);
    } finally {
        setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.precio, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Formulario de envío */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">Detalles de Envío</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input 
                type="text" name="nombre" required value={formData.nombre} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input 
                type="text" name="direccion" required value={formData.direccion} onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                <input 
                  type="text" name="ciudad" required value={formData.ciudad} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cód. Postal</label>
                <input 
                  type="text" name="codigoPostal" required value={formData.codigoPostal} onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg transition transform active:scale-95 disabled:bg-gray-400"
            >
              {loading ? "Procesando..." : "Confirmar Pedido y Pagar"}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200 h-fit">
          <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
          <div className="space-y-4 mb-8">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3">
                    <img src={item.imagen} alt={item.nombre} className="w-12 h-12 object-contain bg-gray-50 rounded" />
                    <span className="font-medium text-gray-800">{item.nombre}</span>
                </div>
                <span className="font-bold text-blue-600">{item.precio}€</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 pt-6 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-700">Total a pagar</span>
            <span className="text-3xl font-extrabold text-blue-600">{total.toFixed(2)}€</span>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            🔒 Pago seguro procesado por Stripe
          </div>
        </div>

      </div>
    </div>
  );
}
