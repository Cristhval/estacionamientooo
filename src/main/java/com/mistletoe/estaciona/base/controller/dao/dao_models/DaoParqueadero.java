package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Parqueadero;

import java.util.Arrays;
import java.util.List;

public class DaoParqueadero extends AdapterDao<Parqueadero> {
    private Parqueadero obj;

    public DaoParqueadero() {
        super(Parqueadero.class);
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
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
