import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Vaciar el carrito local tras un pago exitoso
    if (sessionId) {
      localStorage.removeItem("cart");
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Muchas gracias por tu compra. Tu pedido está siendo procesado y recibirás un correo de confirmación en breve.
        </p>
        <button 
          onClick={() => navigate("/")}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Volver a la Tienda
        </button>
      </div>
    </div>
  );
}
