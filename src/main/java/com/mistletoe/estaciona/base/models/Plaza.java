package com.mistletoe.estaciona.base.models;

public class Plaza {
    private Integer id;
    private String codigo;
    private Integer plazasTotales;
    private Integer plazasDisponibles;
    private Integer idParqueadero;
    private EstadoEnum estado;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Integer getPlazasTotales() {
        return plazasTotales;
    }

    public void setPlazasTotales(Integer plazasTotales) {
        this.plazasTotales = plazasTotales;
    }

    public Integer getPlazasDisponibles() {
        return plazasDisponibles;
    }

    public void setPlazasDisponibles(Integer plazasDisponibles) {
        this.plazasDisponibles = plazasDisponibles;
    }

    public Integer getidParqueadero() {
        return idParqueadero;
    }

    public void setidParqueadero(Integer idParqueadero) {
        this.idParqueadero = idParqueadero;
    }

    public EstadoEnum getEstado() {
        return estado;
    }

    public void setEstado(EstadoEnum estado) {
        this.estado = estado;
    }
}
