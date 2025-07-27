package com.mistletoe.estaciona.base.service;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoUsuario;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class CuentaService {
    private DaoUsuario du;
    private SecurityContext context;

    public CuentaService(){
        du = new DaoUsuario();
        context = SecurityContextHolder.getContext();
    }
    //el inge hizo un metodo para los roles (nosotros no)


    public Authentication getAuthentication(){
        return context.getAuthentication();
    }


    public Boolean isLogin(){
        if(getAuthentication() != null){
            return getAuthentication().isAuthenticated();
        }
        return false;
    }


    public HashMap<String, Object> login(String correo, String clave) throws Exception{
        HashMap<String, Object> mapa = new HashMap<>();
        try{
            HashMap<String, Object> aux = du.login(correo, clave);
            if(aux != null){
                context.setAuthentication(
                    new UsernamePasswordAuthenticationToken(aux.get("correoElectronico").toString(),
                    aux.get("id").toString(),
                    getAuthorities(aux)));

                mapa.put("user", context.getAuthentication());
                mapa.put("roles", List.of("ROLE_" + aux.get("rol").toString()));
                mapa.put("message", "OK");
                mapa.put("estado", "true");
            }


        }catch (Exception e){
            mapa.put("user", new HashMap<>());
            mapa.put("roles", List.of());
            mapa.put("message", e.getMessage());
            mapa.put("estado", "false");
            context.setAuthentication(null);
            System.out.println(e);
        }

        return mapa;

    }


    private static List<GrantedAuthority> getAuthorities(HashMap<String, Object> user) throws Exception{
        List<GrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority("ROLE_" +user.get("rol").toString()));
        return list;
    }


    public HashMap<String, Object> logout(){
        context.setAuthentication(null);
        HashMap<String, Object> mapa = new HashMap<>();
        mapa.put("msg", "ok");
        return mapa;
    }



}
