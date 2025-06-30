package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Parqueadero;

public class DaoParqueadero extends AdapterDao<Parqueadero> {
    private Parqueadero obj;

    public DaoParqueadero() {
        super(Parqueadero.class);
    }

    public Parqueadero getObj() {
        if (obj == null)
            this.obj = new Parqueadero();
        return obj;
    }

    public void setObj(Parqueadero obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return false;
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            System.out.println("Error al actualizar objeto: " + e.getMessage());
            return false;
        }
    }
}