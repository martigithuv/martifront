import { useNavigate } from "react-router-dom";

export default function CheckoutCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          !
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pago Cancelado</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          El proceso de pago ha sido cancelado. No se ha realizado ningún cargo en tu tarjeta. 
          Puedes volver a intentarlo cuando quieras.
        </p>
        <div className="space-y-4">
            <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
            >
                Reintentar Pago
            </button>
            <button 
                onClick={() => navigate("/")}
                className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition"
            >
                Volver a la Tienda
            </button>
        </div>
      </div>
    </div>
  );
}
