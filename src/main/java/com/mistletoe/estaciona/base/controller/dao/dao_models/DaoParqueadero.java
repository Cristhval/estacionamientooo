package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Parqueadero;

public class DaoParqueadero extends AdapterDao<Parqueadero>{
    private Parqueadero obj;

    public DaoParqueadero() {
        super(Parqueadero.class);
        //TODO Auto-generated constructor stub
    }

    public Parqueadero getObj() {
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
}
