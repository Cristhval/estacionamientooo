package com.mistletoe.estaciona.base.controller;

import java.util.HashMap;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoUsuario;
import com.vaadin.flow.component.Composite;
import com.vaadin.flow.component.login.LoginOverlay;
import com.vaadin.flow.router.Route;

@Route("login")
public class LoginView extends Composite<LoginOverlay>{
    public LoginView(){
        //creacion del overlay de Login y su personalizacion
        LoginOverlay loginOverlay = getContent();
        loginOverlay.setTitle("Inicio Sesion");
        loginOverlay.setDescription("");
        loginOverlay.setOpened(true);


        // creacion de las funciones de escucha de los botones y opciones disponibles
        loginOverlay.addLoginListener(event -> {
            try {
                DaoUsuario du = new DaoUsuario();
                HashMap<String, Object> mapa = du.login(event.getUsername(), event.getPassword());
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
                System.out.println("CREDENCIALES INCORRECTAS");
            }
        });

        
    }
}
