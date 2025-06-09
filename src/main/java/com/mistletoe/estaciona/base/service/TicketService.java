package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoParqueadero;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoTicket;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoVehiculo;
import com.mistletoe.estaciona.base.models.Parqueadero;
import com.mistletoe.estaciona.base.models.Ticket;
import com.mistletoe.estaciona.base.models.Vehiculo;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@BrowserCallable
@AnonymousAllowed
@Transactional(propagation = Propagation.REQUIRES_NEW)

public class TicketService {
    private DaoTicket daoTicket;
    public TicketService(){
        daoTicket = new DaoTicket();
    }

    public void createTicket(@NotEmpty Date horaEntrada, @NotEmpty Date  horaSalida,
                             @NotEmpty Double tarifa, @NotEmpty Double totalPagar,
                             Integer id_vehiculo, Integer id_parqueadero) throws Exception {
        if(horaEntrada.toString().length() > 0 && horaSalida.toString().length() > 0 &&
                tarifa.toString().length() > 0 && id_vehiculo > 0 && id_parqueadero >0) {
            daoTicket.getObj().setHoraEntrada(horaEntrada);
            daoTicket.getObj().setHoraSalida(horaSalida);
            daoTicket.getObj().setTarifa(tarifa);
            daoTicket.getObj().setTotalPagar(totalPagar);
            daoTicket.getObj().setId_vehiculo(id_vehiculo);
            daoTicket.getObj().setId_parqueadero(id_parqueadero);

            if(!daoTicket.save())
                throw new  Exception("No se pudo guardar los datos del Ticket");
        }
    }

    public void updateTicket(Integer id, @NotEmpty Date horaEntrada,
                             @NotEmpty Date horaSalida, @NotEmpty Double tarifa,
                             @NotEmpty Double totalPagar, Integer id_vehiculo,
                             Integer id_parqueadero) throws Exception {
        if(horaEntrada.toString().length() > 0 && horaSalida.toString().length() > 0 &&
                tarifa.toString().length() > 0 && id_vehiculo > 0 && id_parqueadero >0) {
            daoTicket.setObj(daoTicket.listAll().get(id - 1));
            daoTicket.getObj().setHoraEntrada(horaEntrada);
            daoTicket.getObj().setHoraSalida(horaSalida);
            daoTicket.getObj().setTarifa(tarifa);
            daoTicket.getObj().setTotalPagar(totalPagar);
            daoTicket.getObj().setId_vehiculo(id_vehiculo);
            daoTicket.getObj().setId_parqueadero(id_parqueadero);
            if(!daoTicket.update(id - 1))
                throw new  Exception("No se pudo modificar los datos del Ticket");
        }
    }

    public List<HashMap> listaAlbumVehiculo() {
        List<HashMap> lista = new ArrayList<>();
        DaoVehiculo daoVehiculo = new DaoVehiculo();
        if(!daoVehiculo.listAll().isEmpty()) {
            Vehiculo[] arreglo = daoVehiculo.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString(i));
                aux.put("label", arreglo[i].getPlaca());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listaAlbumParqueadero() {
        List<HashMap> lista = new ArrayList<>();
        DaoParqueadero daoParqueadero = new DaoParqueadero();
        if(!daoParqueadero.listAll().isEmpty()) {
            Parqueadero[] arreglo = daoParqueadero.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString(i));
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }




    public List<HashMap> listTicket(){
        List<HashMap> lista = new ArrayList<>();
        if(!daoTicket.listAll().isEmpty()) {
            Ticket[] arreglo = daoTicket.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {

                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("horaEntrada", arreglo[i].getHoraEntrada().toString());
                aux.put("horaSalida", arreglo[i].getHoraSalida().toString());
                aux.put("tarifa", arreglo[i].getTarifa().toString());
                aux.put("totalPagar", arreglo[i].getTotalPagar().toString());
                aux.put("vehiculo", new DaoVehiculo().listAll().get(arreglo[i].getId_vehiculo() -1).getPlaca());
                aux.put("id_vehiculo", new DaoVehiculo().listAll().get(arreglo[i].getId_vehiculo()-1).getId().toString());
                aux.put("parqueadero", new DaoParqueadero().listAll().get(arreglo[i].getId_parqueadero() -1).getNombre());
                aux.put("id_parqueadero", new DaoParqueadero().listAll().get(arreglo[i].getId_parqueadero()-1).getId().toString());
                lista.add(aux);
            }
        }
        return lista;
    }
}






