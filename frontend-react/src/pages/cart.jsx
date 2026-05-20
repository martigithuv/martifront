import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "USER_ID_AQUI";

  useEffect(() => {
    // Para simplificar, obtenemos el carrito de localStorage o del API
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.precio, 0);

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6 text-lg">Tu carrito está vacío</p>
            <button 
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img src={item.imagen} alt={item.nombre} className="h-16 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.nombre}</h3>
                      <p className="text-blue-600 font-bold">{item.precio}€</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-bold">Total</span>
                <span className="text-3xl font-extrabold text-blue-600">{total.toFixed(2)}€</span>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => navigate("/")}
                  className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Seguir comprando
                </button>
                <button 
                  onClick={() => navigate("/checkout")}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
