import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { CuentaService } from 'Frontend/generated/endpoints';

export default function HomeView() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload(); // Fuerza recarga completa
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }, []);

  useEffect(() => {
    CuentaService.logout(); // Limpia el SecurityContext del backend
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-gray-900" style={{
      backgroundImage: "url('/images/parking.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>

      {/* Contenedor del contenido */}
      <div className="text-center max-w-2xl p-1 bg-white rounded-2xl shadow-xl">

        {/* Título */}
        <h1 className="text-4xl font-bold mb-4 text-blue-900">
          Visibilidad de Estacionamientos en la Ciudad de Loja
        </h1>

        {/* Descripción */}
        <p className="text-lg mb-6 text-gray-600">
          Monitorea en tiempo real la disponibilidad de los estacionamientos públicos y privados en la ciudad de Loja. Encuentra espacios libres, administra tus reservas y contribuye a una movilidad más eficiente.
        </p>

        {/* Botones de navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Iniciar Sesión
          </button>
          


          <button
            onClick={() => navigate('/cliente/registro')}
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
