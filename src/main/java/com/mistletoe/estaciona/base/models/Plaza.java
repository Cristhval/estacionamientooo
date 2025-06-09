package com.mistletoe.estaciona.base.models;

public class Plaza {
    private Integer id;
    private String codigo;
    private Integer plazasTotales;
    private Integer plazasDisponibles;
    private Integer idPaqueadero;

    public Plaza(Integer id, String codigo, Integer plazasTotales, Integer plazasDisponibles, Integer idPaqueadero) {
        this.id = id;
        this.codigo = codigo;
        this.plazasTotales = plazasTotales;
        this.plazasDisponibles = plazasDisponibles;
        this.idPaqueadero = idPaqueadero;
    }

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

    public Integer getIdPaqueadero() {
        return idPaqueadero;
    }

    public void setIdPaqueadero(Integer idPaqueadero) {
        this.idPaqueadero = idPaqueadero;
    }
}
