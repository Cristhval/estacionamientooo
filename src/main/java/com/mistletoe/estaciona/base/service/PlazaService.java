package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPlaza;
import com.mistletoe.estaciona.base.models.Plaza;
import com.mistletoe.estaciona.base.models.EstadoEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class PlazaService {
    private DaoPlaza daoPlaza;
    private Plaza plaza;

    public PlazaService() {
        this.daoPlaza = new DaoPlaza();
    }

    public Plaza getPlaza() {
        if (this.plaza == null) {
            this.plaza = new Plaza();
        }
        return plaza;
    }

    public void setPlaza(Plaza plaza) {
        this.plaza = plaza;
    }

    public void createPlaza(@NotEmpty String codigo, @NotEmpty Integer plazasTotales,
                            @NotEmpty Integer plazasDisponibles, @NotEmpty Integer idParqueadero,
                            @NotEmpty String estado) throws Exception {
        this.daoPlaza.getObj().setCodigo(codigo);
        this.daoPlaza.getObj().setPlazasTotales(plazasTotales);
        this.daoPlaza.getObj().setPlazasDisponibles(plazasDisponibles);
        this.daoPlaza.getObj().setIdPaqueadero(idParqueadero);
        this.daoPlaza.getObj().setEstado(EstadoEnum.valueOf(estado));
        if (!this.daoPlaza.save()) {
            throw new Exception("No se pudo guardar los datos de la plaza");
        }
    }

    public void updatePlaza(@NotEmpty Integer id, @NotEmpty String codigo, @NotEmpty Integer plazasTotales,
                            @NotEmpty Integer plazasDisponibles, @NotEmpty Integer idParqueadero,
                            @NotEmpty String estado) throws Exception {
        this.daoPlaza.setObj(this.daoPlaza.listAll().get(id - 1));
        this.daoPlaza.getObj().setCodigo(codigo);
        this.daoPlaza.getObj().setPlazasTotales(plazasTotales);
        this.daoPlaza.getObj().setPlazasDisponibles(plazasDisponibles);
        this.daoPlaza.getObj().setIdPaqueadero(idParqueadero);
        this.daoPlaza.getObj().setEstado(EstadoEnum.valueOf(estado));
        if (!this.daoPlaza.update(id - 1)) {
            throw new Exception("No se pudo modificar los datos de la plaza");
        }
    }

    public List<Plaza> list(Pageable pageable) {
        return Arrays.asList(this.daoPlaza.listAll().toArray());
    }

    public List<Plaza> listAll() {
        return Arrays.asList(this.daoPlaza.listAll().toArray());
    }

    public Plaza getPlazaById(Integer id) {
        List<Plaza> list = listAll();
        for (int i = 0; i < list.size(); i++) {
            try {
                if (list.get(i) != null && list.get(i).getId().equals(id)) {
                    return list.get(i);
                }
            } catch (IndexOutOfBoundsException e) {
                // Manejo de excepción si el índice está fuera de los límites
            }
        }
        return null;
    }

    public List<String> listEstadoPlaza() {
        return Arrays.stream(EstadoEnum.values())
                .map(Enum::toString)
                .collect(java.util.stream.Collectors.toList());
    }
}