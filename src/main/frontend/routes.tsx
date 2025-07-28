import { RouterConfigurationBuilder } from '@vaadin/hilla-file-router/runtime.js';
import Flow from 'Frontend/generated/flow/Flow';
import fileRoutes from 'Frontend/generated/file-routes';
import { useAuth } from 'Frontend/security/auth';
import { Navigate } from 'react-router';

// Componente para proteger rutas por rol
function RequireRole({ children, role }: { children: React.ReactNode; role: string }) {
  const { state, roles } = useAuth();

  // Si no hay usuario autenticado
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  // Si no tiene el rol requerido
  if (!roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Construimos rutas normales
export const { router, routes } = new RouterConfigurationBuilder()
  .withFileRoutes(fileRoutes)
  .withFallback(Flow)
  .protect('/login') // redirige si no está autenticado
  .build();

// Protegemos rutas específicas para ADMINISTRADOR
routes.forEach((route) => {
  if (['/AdminViews/Parqueadero-list', 
    '/AdminViews/persona-list',
    '/AdminViews/Plaza-list',
    '/AdminViews/Reserva-list',
    '/AdminViews/ticket-list',
    '/AdminViews/vehiculo-list'
    

    ].includes(route.path)) {
    const OriginalElement = route.element as JSX.Element;
    route.element = (
      <RequireRole role="ROLE_ADMINISTRADOR">
        {OriginalElement}
      </RequireRole>
    );
  }
});
