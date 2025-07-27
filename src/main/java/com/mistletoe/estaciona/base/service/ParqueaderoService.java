package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoParqueadero;
import com.mistletoe.estaciona.base.models.Parqueadero;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class ParqueaderoService {
    private DaoParqueadero dao;

    public ParqueaderoService() {
        this.dao = new DaoParqueadero();
    }

    public void create(@NotEmpty String nombre, @NotEmpty String direccion) throws Exception {
        if (nombre.trim().isEmpty() || direccion.trim().isEmpty()) {
            throw new Exception("Datos incompletos o inválidos");
        }

        dao.getObj().setNombre(nombre);
        dao.getObj().setDireccion(direccion);

        if (!dao.save()) {
            throw new Exception("No se pudo crear el parqueadero");
        }

        
    }

    public void update(@NotNull Integer id, @NotEmpty String nombre, @NotEmpty String direccion) throws Exception {
        List<Parqueadero> lista = Arrays.asList(dao.listAll().toArray());
        Parqueadero existente = null;
        int pos = -1;

        for (int i = 0; i < lista.size(); i++) {
            if (lista.get(i).getId().equals(id)) {
                existente = lista.get(i);
                pos = i;
                break;
            }
        }

        if (existente == null || pos == -1) {
            throw new Exception("Parqueadero con ID " + id + " no encontrado");
        }

        dao.setObj(existente);
        dao.getObj().setNombre(nombre);
        dao.getObj().setDireccion(direccion);

        if (!dao.update(pos)) {
            throw new Exception("Error al actualizar parqueadero");
        }
    }

    public void delete(@NotNull Integer id) throws Exception {
        dao.delete_by_id(id);
    }

    public List<Parqueadero> listAll() {
        return Arrays.asList(dao.listAll().toArray());
    }

    public Parqueadero getById(@NotNull Integer id) {
        try {
            return dao.get(id);
        } catch (Exception e) {
            return null;
        }
    }
}
