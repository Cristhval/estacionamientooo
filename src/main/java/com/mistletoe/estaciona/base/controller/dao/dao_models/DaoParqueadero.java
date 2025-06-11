package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Parqueadero;
import com.mistletoe.estaciona.base.models.Ticket;

public class DaoParqueadero extends AdapterDao<Parqueadero>{
    private Parqueadero obj;

    public DaoParqueadero() {
        super(Parqueadero.class);
        //TODO Auto-generated constructor stub
    }

    public Parqueadero getObj() {
        if (obj == null)
            this.obj = new Parqueadero();
        return this.obj;
    }

    public void setObj(Parqueadero obj) {
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
        DaoParqueadero da = new DaoParqueadero();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNombre("PARQUEADERO1");
        da.getObj().setDireccion("LOJa");
        if (da.save())
            System.out.println("GUARDADO");
        else
            System.out.println("Hubo un error");
    }
}
