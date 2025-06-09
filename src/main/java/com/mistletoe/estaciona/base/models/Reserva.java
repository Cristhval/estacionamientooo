package com.mistletoe.estaciona.base.models;

import java.time.LocalDateTime;
import java.util.Date;

public class Reserva {
    private Integer id;
    private Date fecha;
    private LocalDateTime horaEntrada;
    private LocalDateTime horaSalida;
    private Integer idCliente;
    private Integer idEspacioParqueadero;

    public Reserva(Integer id, Date fecha, LocalDateTime horaEntrada, LocalDateTime horaSalida, Integer idCliente, Integer idEspacioParqueadero) {
        this.id = id;
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.idCliente = idCliente;
        this.idEspacioParqueadero = idEspacioParqueadero;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public LocalDateTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalDateTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalDateTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalDateTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdEspacioParqueadero() {
        return idEspacioParqueadero;
    }

    public void setIdEspacioParqueadero(Integer idEspacioParqueadero) {
        this.idEspacioParqueadero = idEspacioParqueadero;
    }
}
