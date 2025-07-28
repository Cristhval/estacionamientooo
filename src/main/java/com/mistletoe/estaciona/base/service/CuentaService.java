package com.mistletoe.estaciona.base.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoUsuario;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
@BrowserCallable
@PermitAll
//@AnonymousAllowed
public class CuentaService {
    private DaoUsuario du;

    public CuentaService() {
        du = new DaoUsuario();
        System.out.println("=== CuentaService creado ===");
    }
    @PermitAll
    public Authentication getAuthentication() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("=== getAuthentication() ===");
        System.out.println("Authentication object: " + auth);
        if (auth != null) {
            System.out.println("Principal: " + auth.getPrincipal());
            System.out.println("Name: " + auth.getName());
            System.out.println("Is authenticated: " + auth.isAuthenticated());
            System.out.println("Authorities: " + auth.getAuthorities());
        }
        return auth;
    }
    @PermitAll
    public Boolean isLogin() {
        System.out.println("=== isLogin() ===");
        Authentication auth = getAuthentication();
        boolean result = auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser");
        System.out.println("isLogin result: " + result);
        return result;
    }

    // Método para obtener información completa del usuario desde la base de datos
    @PermitAll
    public HashMap<String, Object> getUserInfo() {
        System.out.println("=== getUserInfo() ===");
        Authentication auth = getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            try {
                // Obtener datos frescos desde la base de datos
                String correo = auth.getName();
                System.out.println("Buscando usuario por correo: " + correo);
                HashMap<String, Object> userData = du.busquedaCorreo(correo);
                System.out.println("Datos obtenidos de BD: " + userData);

                if (userData != null) {
                    HashMap<String, Object> userInfo = new HashMap<>();
                    userInfo.put("name", correo);
                    userInfo.put("authorities", auth.getAuthorities());
                    userInfo.put("id", userData.get("id"));
                    userInfo.put("correo", userData.get("correoElectronico"));
                    userInfo.put("rol", userData.get("rol"));

                    System.out.println("UserInfo creado: " + userInfo);
                    return userInfo;
                }
            } catch (Exception e) {
                System.out.println("ERROR obteniendo datos del usuario: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Authentication no válida para getUserInfo");
        }
        return null;
    }

    // Método específico para obtener el ID del usuario
    @PermitAll
    public String getCurrentUserId() {
        System.out.println("=== getCurrentUserId() ===");
        Authentication auth = getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            try {
                String correo = auth.getName();
                System.out.println("Obteniendo ID para correo: " + correo);
                HashMap<String, Object> userData = du.busquedaCorreo(correo);
                System.out.println("Datos usuario para ID: " + userData);

                if (userData != null && userData.get("id") != null) {
                    String userId = userData.get("id").toString();
                    System.out.println("ID encontrado: " + userId);
                    return userId;
                } else {
                    System.out.println("userData es null o no tiene ID");
                }
            } catch (Exception e) {
                System.out.println("ERROR obteniendo ID del usuario: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Authentication no válida para getCurrentUserId");
            if (auth != null) {
                System.out.println("Auth name: " + auth.getName());
                System.out.println("Is authenticated: " + auth.isAuthenticated());
            }
        }
        return null;
    }

    // Método para obtener todos los datos del usuario actual
    @PermitAll
    public HashMap<String, Object> getCurrentUserData() {
        System.out.println("=== getCurrentUserData() ===");
        Authentication auth = getAuthentication();

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            try {
                String correo = auth.getName();
                System.out.println("Obteniendo datos completos para: " + correo);
                HashMap<String, Object> userData = du.busquedaCorreo(correo);
                System.out.println("Datos completos obtenidos: " + userData);
                return userData;
            } catch (Exception e) {
                System.out.println("ERROR obteniendo datos completos del usuario: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Authentication no válida para getCurrentUserData");
        }
        return null;
    }
    @PermitAll
    public HashMap<String, Object> login(String correo, String clave) throws Exception {
        System.out.println("=== login() ===");
        System.out.println("Intentando login con correo: " + correo);

        HashMap<String, Object> mapa = new HashMap<>();
        try {
            HashMap<String, Object> aux = du.login(correo, clave);
            System.out.println("Resultado du.login(): " + aux);

            if (aux != null) {
                System.out.println("Login exitoso, configurando autenticación...");

                // Configurar autenticación en Spring Security
                List<GrantedAuthority> authorities = getAuthorities(aux);
                System.out.println("Authorities creadas: " + authorities);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        aux.get("correoElectronico").toString(),
                        null,
                        authorities);

                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("Autenticación establecida en SecurityContext");

                ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder
                        .currentRequestAttributes();
                HttpSession session = attr.getRequest().getSession(true);
                session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                // Verificar que se estableció correctamente
                Authentication verificacion = SecurityContextHolder.getContext().getAuthentication();
                System.out.println("Verificación - Auth establecida: " + verificacion);
                System.out.println("Verificación - Principal: " + verificacion.getPrincipal());

                // Crear información del usuario para la respuesta
                HashMap<String, Object> userInfo = new HashMap<>();
                userInfo.put("name", aux.get("correoElectronico"));
                userInfo.put("id", aux.get("id"));
                userInfo.put("correo", aux.get("correoElectronico"));
                userInfo.put("rol", aux.get("rol"));
                userInfo.put("authorities", authorities);

                mapa.put("user", userInfo);
                mapa.put("roles", List.of("ROLE_" + aux.get("rol").toString()));
                mapa.put("message", "OK");
                mapa.put("estado", "true");

                System.out.println("Respuesta login creada: " + mapa);
            } else {
                System.out.println("Login falló - du.login() retornó null");
                mapa.put("user", new HashMap<>());
                mapa.put("roles", List.of());
                mapa.put("message", "Usuario o contraseña incorrectos");
                mapa.put("estado", "false");
            }

        } catch (Exception e) {
            System.out.println("EXCEPCIÓN en login: " + e.getMessage());
            e.printStackTrace();

            mapa.put("user", new HashMap<>());
            mapa.put("roles", List.of());
            mapa.put("message", e.getMessage());
            mapa.put("estado", "false");
            SecurityContextHolder.getContext().setAuthentication(null);
        }

        return mapa;
    }

    @PermitAll
    private static List<GrantedAuthority> getAuthorities(HashMap<String, Object> user) throws Exception {
        System.out.println("=== getAuthorities() ===");
        System.out.println("Usuario para authorities: " + user);

        List<GrantedAuthority> list = new ArrayList<>();
        String rol = "ROLE_" + user.get("rol").toString();
        list.add(new SimpleGrantedAuthority(rol));

        System.out.println("Authorities creadas: " + list);
        return list;
    }

    @PermitAll
    public HashMap<String, Object> logout() {
        System.out.println("=== logout() ===");
        SecurityContextHolder.getContext().setAuthentication(null);
        HashMap<String, Object> mapa = new HashMap<>();
        mapa.put("msg", "ok");
        System.out.println("Logout completado");
        return mapa;
    }
}