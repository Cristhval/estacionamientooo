package com.mistletoe.estaciona.base.models;

import java.time.LocalDateTime;
import java.util.Date;

public class Ticket {
    private Integer id;
    private Date horaEntrada;
    private Date horaSalida;
    private Double tarifa;
    private Double totalPagar;
    private Integer id_vehiculo;
    private Integer id_parqueadero;
    private EstadoTicketEnum estadoTicket;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(Date horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public Date getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(Date horaSalida) {
        this.horaSalida = horaSalida;
    }

    public Double getTarifa() {
        return tarifa;
    }

    public void setTarifa(Double tarifa) {
        this.tarifa = tarifa;
    }

    public Double getTotalPagar() {
        return totalPagar;
    }

    public void setTotalPagar(Double totalPagar) {
        this.totalPagar = totalPagar;
    }

    public Integer getId_vehiculo() {
        return id_vehiculo;
    }

    public void setId_vehiculo(Integer id_vehiculo) {
        this.id_vehiculo = id_vehiculo;
    }

    public Integer getId_parqueadero() {
        return id_parqueadero;
    }

    public void setId_parqueadero(Integer id_parqueadero) {
        this.id_parqueadero = id_parqueadero;
    }

    public EstadoTicketEnum getEstadoTicket() {
        return estadoTicket;
    }

    public void setEstadoTicket(EstadoTicketEnum estadoTicket) {
        this.estadoTicket = estadoTicket;
    }
}
