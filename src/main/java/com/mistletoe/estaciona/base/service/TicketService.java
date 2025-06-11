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
import jakarta.validation.constraints.NotNull;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@BrowserCallable
@AnonymousAllowed
@Transactional(propagation = Propagation.REQUIRES_NEW)

public class TicketService {
    private DaoTicket daoTicket;
    public TicketService(){
        daoTicket = new DaoTicket();
    }

    public void createTicket(@NotNull Date horaEntrada, @NotNull Double tarifa, Integer id_vehiculo,
                             Integer id_parqueadero) throws Exception {
        if(horaEntrada.toString().length() > 0 && tarifa.toString().length() > 0 &&
                id_vehiculo > 0 && id_parqueadero >0) {
            daoTicket.getObj().setHoraEntrada(horaEntrada);
            daoTicket.getObj().setTarifa(tarifa);
            daoTicket.getObj().setId_vehiculo(id_vehiculo);
            daoTicket.getObj().setId_parqueadero(id_parqueadero);

            if(!daoTicket.save())
                throw new  Exception("No se pudo guardar los datos del Ticket");
        }
    }

    public void updateTicket(Integer id, @NotNull Date horaEntrada,
                             @NotNull Date horaSalida, @NotNull Double tarifa,
                             Integer id_vehiculo, Integer id_parqueadero) throws Exception {
        if(horaEntrada.toString().length() > 0 && horaSalida.toString().length() > 0 &&
                tarifa.toString().length() > 0 && id_vehiculo > 0 && id_parqueadero >0) {
            daoTicket.setObj(daoTicket.listAll().get(id - 1));
            daoTicket.getObj().setHoraEntrada(horaEntrada);
            daoTicket.getObj().setHoraSalida(horaSalida);
            daoTicket.getObj().setTarifa(tarifa);
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
                aux.put("horaSalida",  arreglo[i].getHoraSalida() !=null? arreglo[i].getHoraSalida().toString():null);
                aux.put("tarifa", arreglo[i].getTarifa().toString());
                aux.put("totalPagar", arreglo[i].getTotalPagar() !=null?  arreglo[i].getTotalPagar().toString():null);
                aux.put("vehiculo", new DaoVehiculo().listAll().get(arreglo[i].getId_vehiculo() -1).getPlaca());
                aux.put("id_vehiculo", new DaoVehiculo().listAll().get(arreglo[i].getId_vehiculo()-1).getId().toString());
                aux.put("parqueadero", new DaoParqueadero().listAll().get(arreglo[i].getId_parqueadero() -1).getNombre());
                aux.put("id_parqueadero", new DaoParqueadero().listAll().get(arreglo[i].getId_parqueadero()-1).getId().toString());
                lista.add(aux);
            }
        }
        return lista;
    }

    private Integer calculoTiempo(@NotNull Integer id, @NotNull Date horaSalida){

        daoTicket.setObj(daoTicket.listAll().get(id));
        daoTicket.getObj().setHoraSalida(horaSalida);
        Date fechaTicket = daoTicket.getObj().getHoraEntrada();
        long resultado = horaSalida.getTime()-fechaTicket.getTime();
        Integer resultadofinal = Math.toIntExact(resultado / (1000 * 60 * 60));// milisegundo segundos minutos para tiempo en horas
        return resultadofinal;
    }

    public void calculoAPagar (@NotNull Integer id) throws Exception {
        System.out.println("aaaaa "+ new Date());
        System.out.println("Llego aqui? "+ id);
        daoTicket.setObj(daoTicket.listAll().get(id));
        daoTicket.getObj().setHoraSalida(new Date());
        Integer tiempoTotal = calculoTiempo(id,daoTicket.getObj().getHoraSalida());
        Double calculo = tiempoTotal * daoTicket.getObj().getTarifa();
        daoTicket.getObj().setTotalPagar(calculo);
        if(!daoTicket.update(id))
            throw new  Exception("No se pudo modificar los datos del Ticket");
    }

    public List<HashMap> order(String atributo, Integer type) throws Exception {
        System.out.println(atributo + "  " + type);
        if (atributo.equalsIgnoreCase("horaEntrada"))
            return Arrays.asList(daoTicket.orderHoraEntrada(type).toArray());
        else if (atributo.equalsIgnoreCase("horaSalida")) {
            return  Arrays.asList(daoTicket.orderHoraSalida(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("tarifa")) {
            return  Arrays.asList(daoTicket.orderTarifa(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("totalPagar")) {
            return  Arrays.asList(daoTicket.orderTotalPagar(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("vehiculo")) {
            return  Arrays.asList(daoTicket.orderVehiculo(type).toArray());
        }
        else if (atributo.equalsIgnoreCase("parqueadero")) {
            return  Arrays.asList(daoTicket.orderParqueadero(type).toArray());
        }
        else
            return Arrays.asList((HashMap) listTicket());
    }

    
}



//    public static void main(String[] args) {
//        TicketService ticketService = new TicketService();
//        ticketService.calculoTiempo(2);
//    }








