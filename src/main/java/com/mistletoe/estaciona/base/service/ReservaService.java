package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoReserva;
import com.mistletoe.estaciona.base.models.Reserva;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable; 

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class ReservaService {
    private DaoReserva daoReserva;
    private Reserva reserva;

    public ReservaService() {
        this.daoReserva = new DaoReserva();
    }

    public Reserva getReserva() {
        if (this.reserva == null) {
            this.reserva = new Reserva(null, null, null, null, null, null); 
        }
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public void createReserva(
            @NotEmpty Date fecha,
            @NotEmpty LocalDateTime horaEntrada,
            @NotEmpty LocalDateTime horaSalida,
            @NotEmpty Integer idCliente,
            @NotEmpty Integer idEspacioParqueadero) throws Exception {
        
        
        this.daoReserva.setObj(new Reserva(
            null, 
            fecha,
            horaEntrada,
            horaSalida,
            idCliente,
            idEspacioParqueadero
        ));

        if (!this.daoReserva.save()) {
            throw new Exception("No se pudo guardar los datos de la reserva");
        }
    }

    public void updateReserva(
            @NotEmpty Integer id,
            @NotEmpty Date fecha,
            @NotEmpty LocalDateTime horaEntrada,
            @NotEmpty LocalDateTime horaSalida,
            @NotEmpty Integer idCliente,
            @NotEmpty Integer idEspacioParqueadero) throws Exception {
        
        // Obtener reserva existente para actualizar
        Reserva reservaToUpdate = this.daoReserva.listAll().get(id - 1);
        if (reservaToUpdate == null) {
            throw new Exception("Reserva no encontrada para actualizar");
        }
        
        reservaToUpdate.setFecha(fecha);
        reservaToUpdate.setHoraEntrada(horaEntrada);
        reservaToUpdate.setHoraSalida(horaSalida);
        reservaToUpdate.setIdCliente(idCliente);
        reservaToUpdate.setIdEspacioParqueadero(idEspacioParqueadero);

        this.daoReserva.setObj(reservaToUpdate);
        
        if (!this.daoReserva.update(id - 1)) {
            throw new Exception("No se pudo modificar los datos de la reserva");
        }
    }

    public List<Reserva> list(Pageable pageable) {
        return Arrays.asList(this.daoReserva.listAll().toArray());
    }

    public List<Reserva> listAll() {
        return Arrays.asList(this.daoReserva.listAll().toArray());
    }

    public Reserva getReservaById(Integer id) {
        List<Reserva> list = listAll();
        for (int i = 0; i < list.size(); i++) {
            try {
                if (list.get(i) != null && list.get(i).getId().equals(id)) {
                    return list.get(i);
                }
            } catch (IndexOutOfBoundsException e) {
                
            }
        }
        return null;
    }
}