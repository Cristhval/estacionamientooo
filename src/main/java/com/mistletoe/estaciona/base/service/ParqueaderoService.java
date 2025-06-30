package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoParqueadero;
import com.mistletoe.estaciona.base.models.Parqueadero;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class ParqueaderoService {
    private DaoParqueadero daoParqueadero;
    private Parqueadero parqueadero;

    public ParqueaderoService() {
        this.daoParqueadero = new DaoParqueadero();
    }

    public Parqueadero getParqueadero() {
        if (this.parqueadero == null) {
            this.parqueadero = new Parqueadero();
        }
        return parqueadero;
    }

    public void setParqueadero(Parqueadero parqueadero) {
        this.parqueadero = parqueadero;
    }

    public void createParqueadero(@NotEmpty String nombre, @NotEmpty String direccion) throws Exception {
        if (nombre.trim().isEmpty() || direccion.trim().isEmpty()) {
            throw new Exception("Datos del parqueadero incompletos o invalidos.");
        }
        this.daoParqueadero.getObj().setNombre(nombre);
        this.daoParqueadero.getObj().setDireccion(direccion);
        if (!this.daoParqueadero.save()) {
            throw new Exception("No se pudo guardar los datos del parqueadero");
        }
    }

    public void updateParqueadero(@NotNull Integer id, @NotEmpty String nombre, @NotEmpty String direccion)
            throws Exception {
        if (id == null || id <= 0 || nombre.trim().isEmpty() || direccion.trim().isEmpty()) {
            throw new Exception("Datos del parqueadero incompletos o invalidos para actualizar.");
        }

        Parqueadero parqueaderoToUpdate = null;
        int posToUpdate = -1;
        List<Parqueadero> allParqueaderos = Arrays.asList(this.daoParqueadero.listAll().toArray());
        for (int i = 0; i < allParqueaderos.size(); i++) {
            Parqueadero p = allParqueaderos.get(i);
            if (p != null && p.getId() != null && p.getId().equals(id)) {
                parqueaderoToUpdate = p;
                posToUpdate = i;
                break;
            }
        }

        if (parqueaderoToUpdate == null || posToUpdate == -1) {
            throw new Exception("Parqueadero con ID " + id + " no encontrado para actualizar.");
        }

        this.daoParqueadero.setObj(parqueaderoToUpdate);
        this.daoParqueadero.getObj().setNombre(nombre);
        this.daoParqueadero.getObj().setDireccion(direccion);
        if (!this.daoParqueadero.update(posToUpdate)) {
            throw new Exception("No se pudo modificar los datos del parqueadero");
        }
    }

    public List<Parqueadero> list(Pageable pageable) {
        return Arrays.asList(this.daoParqueadero.listAll().toArray());
    }

    public List<Parqueadero> listAll() {
        return Arrays.asList(this.daoParqueadero.listAll().toArray());
    }

    public Parqueadero getParqueaderoById(@NotNull Integer id) {
        if (id == null || id <= 0) {
            return null;
        }
        List<Parqueadero> list = listAll();
        for (Parqueadero p : list) {
            if (p != null && p.getId() != null && p.getId().equals(id)) {
                return p;
            }
        }
        return null;
    }
}