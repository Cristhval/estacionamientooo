package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPlaza;
import com.mistletoe.estaciona.base.models.Plaza;
import com.mistletoe.estaciona.base.models.EstadoEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoParqueadero;
import com.mistletoe.estaciona.base.models.Parqueadero;

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

    public void createPlaza(@NotEmpty String codigo, @NotNull Integer plazasTotales,
                            @NotNull Integer plazasDisponibles, @NotNull Integer idParqueadero,
                            @NotEmpty String estado) throws Exception {
        if (codigo.trim().isEmpty() || plazasTotales == null || plazasTotales <= 0 ||
            plazasDisponibles == null || plazasDisponibles < 0 ||
            idParqueadero == null || idParqueadero <= 0 ||
            estado.trim().isEmpty()) {
            throw new Exception("Datos de la plaza incompletos o invalidos.");
        }
        this.daoPlaza.getObj().setCodigo(codigo);
        this.daoPlaza.getObj().setPlazasTotales(plazasTotales);
        this.daoPlaza.getObj().setPlazasDisponibles(plazasDisponibles);
        this.daoPlaza.getObj().setidParqueadero(idParqueadero);
        this.daoPlaza.getObj().setEstado(EstadoEnum.valueOf(estado.toUpperCase()));
        if (!this.daoPlaza.save()) {
            throw new Exception("No se pudo guardar los datos de la plaza");
        }
    }

    public void updatePlaza(@NotNull Integer id, @NotEmpty String codigo, @NotNull Integer plazasTotales,
                            @NotNull Integer plazasDisponibles, @NotNull Integer idParqueadero,
                            @NotEmpty String estado) throws Exception {
        if (id == null || id <= 0 || codigo.trim().isEmpty() || plazasTotales == null || plazasTotales <= 0 ||
            plazasDisponibles == null || plazasDisponibles < 0 ||
            idParqueadero == null || idParqueadero <= 0 ||
            estado.trim().isEmpty()) {
            throw new Exception("Datos de la plaza incompletos o invalidos para actualizar.");
        }

        Plaza plazaToUpdate = null;
        int posToUpdate = -1;
        List<Plaza> allPlazas = Arrays.asList(this.daoPlaza.listAll().toArray());
        for (int i = 0; i < allPlazas.size(); i++) {
            Plaza p = allPlazas.get(i);
            if (p != null && p.getId() != null && p.getId().equals(id)) {
                plazaToUpdate = p;
                posToUpdate = i;
                break;
            }
        }

        if (plazaToUpdate == null || posToUpdate == -1) {
            throw new Exception("Plaza con ID " + id + " no encontrada para actualizar.");
        }

        this.daoPlaza.setObj(plazaToUpdate);
        this.daoPlaza.getObj().setCodigo(codigo);
        this.daoPlaza.getObj().setPlazasTotales(plazasTotales);
        this.daoPlaza.getObj().setPlazasDisponibles(plazasDisponibles);
        this.daoPlaza.getObj().setidParqueadero(idParqueadero);
        this.daoPlaza.getObj().setEstado(EstadoEnum.valueOf(estado.toUpperCase()));
        if (!this.daoPlaza.update(posToUpdate)) {
            throw new Exception("No se pudo modificar los datos de la plaza");
        }
    }

    public List<Plaza> list(Pageable pageable) {
        return Arrays.asList(this.daoPlaza.listAll().toArray());
    }

    public List<Plaza> listAll() {
        return Arrays.asList(this.daoPlaza.listAll().toArray());
    }

    public Plaza getPlazaById(@NotNull Integer id) {
        if (id == null || id <= 0) {
            return null;
        }
        List<Plaza> list = listAll();
        for (Plaza p : list) {
            if (p != null && p.getId() != null && p.getId().equals(id)) {
                return p;
            }
        }
        return null;
    }

    public List<String> listEstadoPlaza() {
        return Arrays.stream(EstadoEnum.values())
                .map(Enum::toString)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<HashMap<String, String>> listParqueaderoCombo() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoParqueadero daoParqueadero = new DaoParqueadero();
        if (!daoParqueadero.listAll().isEmpty()) {
            Parqueadero[] arreglo = daoParqueadero.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
    
    public List<HashMap<String, String>> listPlazaConNombres() throws Exception {
        List<HashMap<String, String>> lista = new ArrayList<>();
        if (!daoPlaza.listAll().isEmpty()) {
            Plaza[] plazas = daoPlaza.listAll().toArray();
            DaoParqueadero daoParqueadero = new DaoParqueadero();
            List<Parqueadero> allParqueaderos = Arrays.asList(daoParqueadero.listAll().toArray());

            for (Plaza plaza : plazas) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", plaza.getId() != null ? plaza.getId().toString() : "");
                aux.put("codigo", plaza.getCodigo() != null ? plaza.getCodigo() : "");
                aux.put("plazasTotales", plaza.getPlazasTotales() != null ? plaza.getPlazasTotales().toString() : "");
                aux.put("plazasDisponibles", plaza.getPlazasDisponibles() != null ? plaza.getPlazasDisponibles().toString() : "");
                aux.put("estado", plaza.getEstado() != null ? plaza.getEstado().toString() : "");
                aux.put("idParqueadero", plaza.getidParqueadero() != null ? plaza.getidParqueadero().toString() : ""); 

                String nombreParqueadero = "Desconocido";
                if (plaza.getidParqueadero() != null && plaza.getidParqueadero() > 0 && plaza.getidParqueadero() <= allParqueaderos.size()) { 
                    Parqueadero parqueaderoEncontrado = allParqueaderos.get(plaza.getidParqueadero() - 1); 
                    if (parqueaderoEncontrado != null && parqueaderoEncontrado.getNombre() != null) {
                        nombreParqueadero = parqueaderoEncontrado.getNombre();
                    }
                }
                aux.put("nombreParqueadero", nombreParqueadero);

                lista.add(aux);
            }
        }
        return lista;
    }
}