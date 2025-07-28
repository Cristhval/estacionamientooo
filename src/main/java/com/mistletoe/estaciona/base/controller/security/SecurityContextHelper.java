package com.mistletoe.estaciona.base.controller.security;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import com.vaadin.flow.server.VaadinSession;

public class SecurityContextHelper {
    
    private static final String SECURITY_CONTEXT_KEY = "SPRING_SECURITY_CONTEXT";
    
    public static void restoreSecurityContext() {
        try {
            VaadinSession session = VaadinSession.getCurrent();
            if (session != null) {
                SecurityContext context = (SecurityContext) session.getAttribute(SECURITY_CONTEXT_KEY);
                if (context != null) {
                    SecurityContextHolder.setContext(context);
                    System.out.println("Contexto de seguridad restaurado desde VaadinSession");
                    System.out.println("Authentication restaurada: " + context.getAuthentication());
                } else {
                    System.out.println("No hay contexto de seguridad en VaadinSession");
                }
            }
        } catch (Exception e) {
            System.out.println("Error restaurando contexto de seguridad: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public static void saveSecurityContext() {
        try {
            VaadinSession session = VaadinSession.getCurrent();
            if (session != null) {
                SecurityContext context = SecurityContextHolder.getContext();
                if (context != null && context.getAuthentication() != null) {
                    session.setAttribute(SECURITY_CONTEXT_KEY, context);
                    System.out.println("Contexto de seguridad guardado en VaadinSession");
                }
            }
        } catch (Exception e) {
            System.out.println("Error guardando contexto de seguridad: " + e.getMessage());
            e.printStackTrace();
        }
    }
}