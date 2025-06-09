package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Plaza;

public class DaoPlaza extends AdapterDao<Plaza>{
    private Plaza obj;

    public DaoPlaza() {
        super(Plaza.class);
        //TODO Auto-generated constructor stub
    }

    public Plaza getObj() {
        return this.obj;
    }

    public void setObj(Plaza obj) {
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
