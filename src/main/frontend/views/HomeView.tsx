import { useNavigate } from 'react-router';

export default function HomeView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-r from-blue-200 to-blue-400 text-gray-900">
      {/* Contenedor del contenido */}
      <div className="text-center max-w-2xl p-8 bg-white rounded-2xl shadow-xl">
        
        {/* Título */}
        <h1 className="text-4xl font-bold mb-4 text-blue-700">
          Visibilidad de Estacionamientos en la Ciudad de Loja
        </h1>

        {/* Descripción */}
        <p className="text-lg mb-6 text-gray-600">
          Monitorea en tiempo real la disponibilidad de los estacionamientos públicos y privados en la ciudad de Loja. Encuentra espacios libres, administra tus reservas y contribuye a una movilidad más eficiente.
        </p>

        {/* Imagen simulando mapa */}
        <div className="w-full mb-6">
          <img
            src="/images/parking.png"
            alt="Mapa de estacionamientos Loja"
            className="rounded-lg shadow-md w-full object-cover"
          />
        </div>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate('/AdminViews')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Ver Estacionamientos
          </button>
          <button
            onClick={() => navigate('/registro')}
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
