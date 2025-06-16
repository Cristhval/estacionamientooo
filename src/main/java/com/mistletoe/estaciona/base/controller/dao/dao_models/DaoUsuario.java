package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;

import com.mistletoe.estaciona.base.models.Usuario;

public class DaoUsuario extends AdapterDao<Usuario>{
    private Usuario obj;

    public DaoUsuario() {
        super(Usuario.class);

    }

    public Usuario getObj() {
        return this.obj;
    }

    public void setObj(Usuario obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength()+1);
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
