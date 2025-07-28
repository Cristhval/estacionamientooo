package com.mistletoe.estaciona.base.controller;

import java.util.HashMap;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoUsuario;
import com.mistletoe.estaciona.base.service.CuentaService;
import com.vaadin.flow.component.Composite;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.login.LoginOverlay;
import com.vaadin.flow.router.BeforeEnterEvent;
import com.vaadin.flow.router.BeforeEnterObserver;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@Route("login")
@AnonymousAllowed
public class LoginView extends Composite<LoginOverlay> implements BeforeEnterObserver{

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CuentaService cuentaService;

    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        System.out.println("=== beforeEnter LoginView ===");
        cuentaService.logout(); // Limpia el contexto cada vez que se accede a /login
    }

    public LoginView(){
        System.out.println("=== Creando LoginView ===");
        
        //creacion del overlay de Login y su personalizacion
        LoginOverlay loginOverlay = getContent();
        loginOverlay.setTitle("Inicio Sesion");
        loginOverlay.setDescription("");
        loginOverlay.setOpened(true);

        // creacion de las funciones de escucha de los botones y opciones disponibles
        loginOverlay.addLoginListener(event -> {
            System.out.println("=== Intento de login ===");
            System.out.println("Usuario: " + event.getUsername());
            System.out.println("Password: [OCULTO]");
            
            try {
                // Primero autenticar con Spring Security
                System.out.println("1. Autenticando con AuthenticationManager...");
                Authentication auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(event.getUsername(), event.getPassword())
                );
                System.out.println("AuthenticationManager exitoso: " + auth);
                System.out.println("Principal: " + auth.getPrincipal());
                System.out.println("Authorities: " + auth.getAuthorities());
                
                // Establecer la autenticación en el contexto de Spring Security
                SecurityContextHolder.getContext().setAuthentication(auth);
                System.out.println("Authentication establecida en SecurityContext");
                
                // Ahora también llamar al CuentaService para mantener sincronización
                System.out.println("2. Llamando a CuentaService.login()...");
                HashMap<String, Object> loginResult = cuentaService.login(event.getUsername(), event.getPassword());
                System.out.println("CuentaService.login() resultado: " + loginResult);
                
                if ("true".equals(loginResult.get("estado"))) {
                    System.out.println("3. Login exitoso, obteniendo roles...");
                    
                    // Obtener roles del usuario autenticado
                    boolean isAdmin = auth.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .anyMatch(role -> role.equals("ROLE_ADMINISTRADOR"));

                    boolean isCliente = auth.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .anyMatch(role -> role.equals("ROLE_CLIENTE"));

                    System.out.println("Es admin: " + isAdmin);
                    System.out.println("Es cliente: " + isCliente);

                    // Cerrar login
                    loginOverlay.setOpened(false);

                    // Verificar que la autenticación persiste antes de navegar
                    Authentication finalAuth = SecurityContextHolder.getContext().getAuthentication();
                    System.out.println("Authentication final antes de navegar: " + finalAuth);
                    
                    // Probar getCurrentUserId antes de navegar
                    System.out.println("4. Probando getCurrentUserId()...");
                    String userId = cuentaService.getCurrentUserId();
                    System.out.println("CurrentUserId: " + userId);

                    // IMPORTANTE: Forzar que la sesión se guarde antes de navegar
                    try {
                        if (com.vaadin.flow.server.VaadinSession.getCurrent() != null) {
                            com.vaadin.flow.server.VaadinSession.getCurrent().setAttribute("SPRING_SECURITY_CONTEXT", 
                                SecurityContextHolder.getContext());
                            System.out.println("Contexto guardado en VaadinSession");
                        }
                    } catch (Exception e) {
                        System.out.println("Error guardando contexto en VaadinSession: " + e.getMessage());
                    }

                    // Redirigir según rol
                    if (isAdmin) {
                        System.out.println("Navegando a admin...");
                        UI.getCurrent().navigate("AdminViews/persona-list");
                    } else if (isCliente) {
                        System.out.println("Navegando a cliente...");
                        UI.getCurrent().navigate("cliente/cliente-parqueadero-list");
                    } else {
                        System.out.println("Navegando a home...");
                        UI.getCurrent().navigate("HomeView");
                    }
                } else {
                    System.out.println("CuentaService login falló: " + loginResult.get("message"));
                    loginOverlay.setError(true);
                }
                
            } catch (Exception e) {
                System.out.println("EXCEPCIÓN en login: " + e.getMessage());
                e.printStackTrace();
                loginOverlay.setError(true);
            }
        });
    }
}