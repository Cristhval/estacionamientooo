package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPersona;
import com.mistletoe.estaciona.base.models.Persona;
import com.mistletoe.estaciona.base.models.RolEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class PersonaService {
    private DaoPersona da;
    public PersonaService() {
        da = new DaoPersona();
    }

    public void createPersona(@NotEmpty String nombre, @NotEmpty String apellido,
                              @NotEmpty String correoElectronico, @NotEmpty String rol, String clave, String usuario) throws Exception{
        da.getObj().setNombre(nombre);
        da.getObj().setApellido(apellido);
        da.getObj().setCorreoElectronico(correoElectronico);
        da.getObj().setRol(RolEnum.valueOf(rol));

        // cambio isaac
        ///////////////////////////////////////////////////////////////////////////////
        /// 
        
        da.getObj().setUsuario(usuario);
        da.getObj().setClave(clave);

        /// 
        /// ///////////////////////////////////////////////////////////////////////////////


        if(!da.save())
            throw new  Exception("No se pudo guardar los datos de persona");
    }

    public void updatePersona( Integer id, @NotEmpty String nombre,
                               @NotEmpty String apellido,@NotEmpty String correoElectronico,
                               @NotEmpty String rol,
                               String clave,
                               String usuario) throws Exception{
        da.setObj(da.listAll().get(id-1));
        da.getObj().setNombre(nombre);
        da.getObj().setApellido(apellido);
        da.getObj().setCorreoElectronico(correoElectronico);
        da.getObj().setRol(RolEnum.valueOf(rol));

        // cambio isaac
        ///////////////////////////////////////////////////////////////////////////////
        /// 
        
        da.getObj().setUsuario(usuario);
        da.getObj().setClave(clave);

        /// 
        /// ///////////////////////////////////////////////////////////////////////////////

        if(!da.update(id - 1))
            throw new  Exception("No se pudo modificar los datos de la persona");
    }
    public List<Persona> list(Pageable pageable) {
        return Arrays.asList(da.listAll().toArray());
    }
    public List<Persona> listAll() {

        return (List<Persona>)Arrays.asList(da.listAll().toArray());
    }

    public List<String> listRolPersona() {
        List<String> lista = new ArrayList<>();
        for(RolEnum r: RolEnum.values()) {
            lista.add(r.toString());
        }
        return lista;
    }

}
