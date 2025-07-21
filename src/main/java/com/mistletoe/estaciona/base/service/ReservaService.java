package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPersona;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoReserva;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPlaza;
import com.mistletoe.estaciona.base.models.Persona;
import com.mistletoe.estaciona.base.models.Plaza;
import com.mistletoe.estaciona.base.models.Reserva;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotNull;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@BrowserCallable
@AnonymousAllowed
@Transactional(propagation = Propagation.REQUIRES_NEW)
public class ReservaService {

    private DaoReserva daoReserva;

    public ReservaService() {
        daoReserva = new DaoReserva();
    }

    public void createReserva(@NotNull Date fecha, @NotNull LocalDateTime horaEntrada,
            @NotNull LocalDateTime horaSalida, Integer idCliente, Integer idPlaza) throws Exception {
        if (fecha != null && horaEntrada != null && horaSalida != null && idCliente > 0 && idPlaza > 0) {
            daoReserva.getObj().setFecha(fecha);
            daoReserva.getObj().setHoraEntrada(java.util.Date.from(horaEntrada.atZone(java.time.ZoneId.systemDefault()).toInstant()));
            daoReserva.getObj().setHoraSalida(java.util.Date.from(horaSalida.atZone(java.time.ZoneId.systemDefault()).toInstant()));
            daoReserva.getObj().setIdCliente(idCliente);
            daoReserva.getObj().setIdPlaza(idPlaza);
            if (!daoReserva.save())
                throw new Exception("No se pudo guardar los datos de la Reserva");
        }
    }

    public void updateReserva(Integer id, @NotNull Date fecha, @NotNull LocalDateTime horaEntrada,
            @NotNull LocalDateTime horaSalida, Integer idCliente, Integer idPlaza) throws Exception {
        if (fecha != null && horaEntrada != null && horaSalida != null && idCliente > 0 && idPlaza > 0) {
            daoReserva.setObj(daoReserva.listAll().get(id - 1));
            daoReserva.getObj().setFecha(fecha);
            daoReserva.getObj().setHoraEntrada(java.util.Date.from(horaEntrada.atZone(java.time.ZoneId.systemDefault()).toInstant()));
            daoReserva.getObj().setHoraSalida(java.util.Date.from(horaSalida.atZone(java.time.ZoneId.systemDefault()).toInstant()));
            daoReserva.getObj().setIdCliente(idCliente);
            daoReserva.getObj().setIdPlaza(idPlaza);
            if (!daoReserva.update(id - 1))
                throw new Exception("No se pudo modificar los datos de la Reserva");
        }
    }

    public List<HashMap> listaAlbumClientes() {
        List<HashMap> lista = new ArrayList<>();
        DaoPersona daoPersona = new DaoPersona();
        if (!daoPersona.listAll().isEmpty()) {
            Persona[] arreglo = daoPersona.listAll().toArray();
            for (Persona persona : arreglo) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", persona.getId().toString());
                aux.put("label", persona.getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }

    //  AQUÍ EL MÉTODO QUE FALTABA PARA LAS PLAZAS
    public List<HashMap> listaAlbumPlazas() {
        List<HashMap> lista = new ArrayList<>();
        DaoPlaza daoPlaza = new DaoPlaza();
        if (!daoPlaza.listAll().isEmpty()) {
            Plaza[] arreglo = daoPlaza.listAll().toArray();
            for (Plaza plaza : arreglo) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", plaza.getId().toString());
                aux.put("label", plaza.getCodigo());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listReserva() {
        List<HashMap> lista = new ArrayList<>();
        if (!daoReserva.listAll().isEmpty()) {
            Reserva[] arreglo = daoReserva.listAll().toArray();
            for (Reserva reserva : arreglo) {
                try {
                    lista.add(daoReserva.toDict(reserva));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return lista;
    }
}
