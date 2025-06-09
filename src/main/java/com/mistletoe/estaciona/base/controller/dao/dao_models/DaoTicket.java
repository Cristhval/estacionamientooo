package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;

import com.mistletoe.estaciona.base.models.Persona;
import com.mistletoe.estaciona.base.models.RolEnum;
import com.mistletoe.estaciona.base.models.Ticket;

import java.time.LocalDateTime;
import java.util.Date;

public class DaoTicket extends AdapterDao<Ticket>{
    private Ticket obj;

    public DaoTicket() {
        super(Ticket.class);
        //TODO Auto-generated constructor stub
    }

    public Ticket getObj() {
        if (obj == null)
            this.obj = new Ticket();
        return this.obj;
    }

    public void setObj(Ticket obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength()+1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            //TODO
            return false;
            // TODO: handle exception
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            //TODO
            return false;
            // TODO: handle exception
        }
    }

    public static void main(String[] args) {
        DaoTicket da = new DaoTicket();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setTotalPagar(11.7);
        da.getObj().setTarifa(40.0);
        da.getObj().setHoraEntrada(new Date());
        da.getObj().setHoraSalida(new Date());
        da.getObj().setId_parqueadero(1);
        da.getObj().setId_vehiculo(1);
        if (da.save())
            System.out.println("GUARDADO");
        else
            System.out.println("Hubo un error");
    }
}
