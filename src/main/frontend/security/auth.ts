import { configureAuth } from '@vaadin/hilla-react-auth';
import { CuentaService } from "Frontend/generated/endpoints";

const auth = configureAuth(CuentaService.getAuthentication, {
  getRoles: (user) => user?.authorities?.map((v) => v.authority ?? '') ?? []
});

export const useAuth = () => {
  const { state, login, logout, hasAccess } = auth.useAuth();
  const roles = state.user
    ? state.user.authorities.map((v) => v.authority)
    : [];
  return { state, roles, login, logout, hasAccess };
};

// Función mejorada para obtener el ID del usuario con debugging
export const getCurrentUserId = async () => {
  try {
    console.log('=== getCurrentUserId Frontend ===');
    
    // Primero verificar la autenticación de Hilla
    console.log('1. Verificando autenticación Hilla...');
    const hillaAuth = await CuentaService.getAuthentication();
    console.log('Hilla Authentication:', hillaAuth);
    
    console.log('2. Verificando isLogin...');
    const loginStatus = await isLogin();
    console.log('Login status:', loginStatus);
    
    if (!loginStatus) {
      console.log('Usuario no está logueado según isLogin()');
      return null;
    }
    
    console.log('3. Obteniendo ID del usuario...');
    const userId = await CuentaService.getCurrentUserId();
    console.log('User ID obtenido:', userId);
    
    // También intentar obtener datos completos para debug
    console.log('4. Obteniendo datos completos del usuario...');
    const userData = await CuentaService.getCurrentUserData();
    console.log('User data completa:', userData);
    
    return userId;
  } catch (error) {
    console.error('Error obteniendo ID del usuario:', error);
    return null;
  }
};

export const getCurrentUserData = CuentaService.getCurrentUserData;
export const isLogin = CuentaService.isLogin;
export const AuthProvider = auth.AuthProvider;