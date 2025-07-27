package com.mistletoe.estaciona.base.models;

import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.Date;

public class Reserva {
    private Integer id;
    private Date fecha;
    private Date horaEntrada;
    private Date horaSalida;
    private Integer idCliente;
    private Integer idPlaza;
//    @DefaultValue(value = false)
    private Boolean eliminado;

    public Reserva() {
    }

    public Reserva(Integer id, Date fecha, Date horaEntrada, Date horaSalida, Integer idCliente, Integer idPlaza, Boolean eliminado) {
        this.id = id;
        this.fecha = fecha;
        this.horaEntrada = horaEntrada;
        this.horaSalida = horaSalida;
        this.idCliente = idCliente;
        this.idPlaza = idPlaza;
        this.eliminado = eliminado;
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

    public Integer getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdPlaza() {
        return idPlaza;
    }

    public void setIdPlaza(Integer idPlaza) {
        this.idPlaza = idPlaza;
    }

    public Boolean getEliminado() {
        return eliminado;
    }

    public void setEliminado(Boolean eliminado) {
        this.eliminado = eliminado;
    }
}