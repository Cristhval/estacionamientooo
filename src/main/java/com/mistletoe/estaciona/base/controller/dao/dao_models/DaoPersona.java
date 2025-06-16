package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Persona;
import com.mistletoe.estaciona.base.models.RolEnum;

import java.util.Date;


public class DaoPersona extends AdapterDao<Persona>{
    private Persona obj;

    public DaoPersona() {
        super(Persona.class);

    }

    public Persona getObj() {
        if (obj == null)
            this.obj = new Persona();
        return this.obj;
    }

    public void setObj(Persona obj) {
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

    public static void main(String[] args) {
        DaoPersona da = new DaoPersona();
        da.getObj().setId(da.listAll().getLength() + 1);
        da.getObj().setNombre("PEpe");
        da.getObj().setApellido("Perez");
        da.getObj().setCorreoElectronico("pepe2@gmail.com");
        da.getObj().setRol(RolEnum.CLIENTE);
        da.getObj().setUsuario("PEPE122");
        da.getObj().setClave("holaweeee");
        if (da.save())
            System.out.println("GUARDADO");
        else
            System.out.println("Hubo un error");
    }
}
