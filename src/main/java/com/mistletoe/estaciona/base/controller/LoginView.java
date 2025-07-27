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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;

@Route("login")
public class LoginView extends Composite<LoginOverlay> implements BeforeEnterObserver{

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CuentaService cuentaService;


    @Override
    public void beforeEnter(BeforeEnterEvent event) {
        cuentaService.logout(); // Limpia el contexto cada vez que se accede a /login
    }


    public LoginView(){
        
        //creacion del overlay de Login y su personalizacion
        LoginOverlay loginOverlay = getContent();
        loginOverlay.setTitle("Inicio Sesion");
        loginOverlay.setDescription("");
        loginOverlay.setOpened(true);


        // creacion de las funciones de escucha de los botones y opciones disponibles
        loginOverlay.addLoginListener(event -> {
            try {
                //System.out.println("el usuario que ingresa en la autenticacion "+event.getUsername());
                //System.out.println("el password que ingresa en la autenticacion "+event.getPassword());
                Authentication auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(event.getUsername(), event.getPassword())
                );
                // Obtener roles del usuario autenticado
                boolean isAdmin = auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(role -> role.equals("ROLE_ADMINISTRADOR"));

                boolean isCliente = auth.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(role -> role.equals("ROLE_CLIENTE"));

                // Cerrar login
                loginOverlay.setOpened(false);

                // Redirigir según rol
                if (isAdmin) {
                    UI.getCurrent().navigate("AdminViews/persona-list");
                    
                } else if (isCliente) {
                    UI.getCurrent().navigate("cliente/cliente-parqueadero-list");
                    
                } else {
                    // Si no tiene rol esperado, enviar a una vista genérica
                    UI.getCurrent().navigate("HomeView");
                    
                }
            } catch (Exception e) {
                // TODO: handle exception
                loginOverlay.setError(true);
                System.out.println("CREDENCIALES INCORRECTAS" + e);
            }
        });

        
    }
}
