package com.mistletoe.estaciona.base.models;

public class EspacioParqueadero {
    private Integer id;
    private String codigo;
    private EstadoEnum estado;
    private Integer idPlaza;

    public EspacioParqueadero(Integer id, String codigo, EstadoEnum estado, Integer idPlaza) {
        this.id = id;
        this.codigo = codigo;
        this.estado = estado;
        this.idPlaza = idPlaza;
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

    public EstadoEnum getEstado() {
        return estado;
    }

    public void setEstado(EstadoEnum estado) {
        this.estado = estado;
    }

    public Integer getIdPlaza() {
        return idPlaza;
    }

    public void setIdPlaza(Integer idPlaza) {
        this.idPlaza = idPlaza;
    }
}
