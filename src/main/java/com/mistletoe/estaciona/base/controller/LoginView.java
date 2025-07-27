package com.mistletoe.estaciona.base.controller;

import java.util.HashMap;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoUsuario;
import com.vaadin.flow.component.Composite;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.login.LoginOverlay;
import com.vaadin.flow.router.Route;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

@Route("login")
public class LoginView extends Composite<LoginOverlay>{

    @Autowired
    private AuthenticationManager authenticationManager;

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
                //System.out.println("Si pasa el authori");
                DaoUsuario du = new DaoUsuario();
                //System.out.println("el retorno de login es el siguiente"+ du.login(event.getUsername(), event.getPassword()));

                HashMap<String, Object> mapa = du.login(event.getUsername(), event.getPassword());
                //System.out.println("el mapa es el siguiente" + mapa);

                if (mapa != null) {
                    System.out.println("INICIO SESION CORRECTAMENTE");
                    System.out.println("El rol es: " + mapa.get("rol"));

                    if(mapa.get("rol").toString().equals("ADMINISTRADOR") ){
                        System.out.println("si es addmin");
                        loginOverlay.setOpened(false);
                    }
                }
            } catch (Exception e) {
                // TODO: handle exception
                System.out.println("CREDENCIALES INCORRECTAS" + e);
            }
        });

        
    }
}
