package com.mistletoe.estaciona.base.models;

public class Vehiculo {
    private Integer id;
    private String placa;
    private String marca;
    private String modelo;
    private String color;
    private Integer id_persona;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }


    public Integer getId_persona() {
        return id_persona;
    }

    public void setId_Persona(Integer id_Persona) {
        this.id_persona = id_Persona;
    }
}
