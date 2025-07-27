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


export const isLogin = CuentaService.isLogin;
export const AuthProvider = auth.AuthProvider;
