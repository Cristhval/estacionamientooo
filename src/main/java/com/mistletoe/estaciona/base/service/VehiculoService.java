package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPersona;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoVehiculo;
import com.mistletoe.estaciona.base.models.*;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;


@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class VehiculoService {
    private DaoVehiculo dv;
    public VehiculoService(){
        dv = new DaoVehiculo();
    }

    public void createVehiculo(@NotEmpty String placa, @NotEmpty String marca, @NotEmpty String modelo,
                               @NotEmpty String color, Integer id_persona) throws Exception {
        if(placa.trim().length() > 0 && marca.trim().length() > 0 && modelo.trim().length() > 0
                && color.trim().length() > 0 && id_persona >0) {
            dv.getObj().setPlaca(placa);
            dv.getObj().setMarca(marca);
            dv.getObj().setModelo(modelo);
            dv.getObj().setColor(color);
            dv.getObj().setId_Persona(id_persona);
            if(!dv.save())
                throw new  Exception("No se pudo guardar los datos del vehiculo");
        }
    }

    public void updateVehiculo(Integer id, @NotEmpty String placa,@NotEmpty String marca,@NotEmpty String modelo,
                       @NotEmpty String color, Integer id_persona) throws Exception {
        if(placa.trim().length() > 0 && marca.trim().length() > 0 && modelo.trim().length() > 0 &&
                color.trim().length() > 0 &&  id_persona > 0) {
            dv.setObj(dv.listAll().get(id - 1));
            dv.getObj().setPlaca(placa);
            dv.getObj().setMarca(marca);
            dv.getObj().setModelo(modelo);
            dv.getObj().setColor(color);
            dv.getObj().setId_Persona(id_persona);
            if(!dv.update(id - 1))
                throw new  Exception("No se pudo modificar los datos del vehiculo");
        }
    }

    public List<HashMap> listaAlbumPersona() {
        List<HashMap> lista = new ArrayList<>();
        DaoPersona daoPersona = new DaoPersona();
        if(!daoPersona.listAll().isEmpty()) {
            Persona[] arreglo = daoPersona.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString(i));
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }



    public List<HashMap> listVehiculo(){
        List<HashMap> lista = new ArrayList<>();
        if(!dv.listAll().isEmpty()) {
            Vehiculo [] arreglo = dv.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {

                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("placa", arreglo[i].getPlaca());
                aux.put("marca", arreglo[i].getMarca());
                aux.put("modelo", arreglo[i].getModelo());
                aux.put("color", arreglo[i].getColor());
                aux.put("persona", new DaoPersona().listAll().get(arreglo[i].getId_persona() -1).getNombre());
                aux.put("id_persona", new DaoPersona().listAll().get(arreglo[i].getId_persona()-1).getId().toString());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> order(String atributo, Integer type) throws Exception {
        System.out.println(atributo + "  " + type);
        if (atributo.equalsIgnoreCase("placa"))
            return Arrays.asList(dv.orderPlaca(type).toArray());
        else if (atributo.equalsIgnoreCase("marca")) {
            return  Arrays.asList(dv.orderMarca(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("modelo")) {
            return  Arrays.asList(dv.orderModelo(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("color")) {
            return  Arrays.asList(dv.orderColor(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("persona")) {
            return  Arrays.asList(dv.orderPersona(type).toArray());
        }
        else
            return Arrays.asList((HashMap) listVehiculo());
    }
}






