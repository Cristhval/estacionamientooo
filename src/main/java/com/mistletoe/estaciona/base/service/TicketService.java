package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoParqueadero;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoTicket;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoVehiculo;
import com.mistletoe.estaciona.base.controller.data_struct.list.LinkedList;
import com.mistletoe.estaciona.base.models.EstadoTicketEnum;
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

    public void createTicket( @NotNull Double tarifa, Integer id_vehiculo,
                             Integer id_parqueadero, @NotEmpty String estadoTicket) throws Exception {
        if(tarifa.toString().length() > 0 && id_vehiculo > 0 && id_parqueadero >0 &&
                estadoTicket.trim().length() > 0) {
            System.out.println(estadoTicket);
            daoTicket.getObj().setHoraEntrada(new Date());
            daoTicket.getObj().setTarifa(tarifa);
            daoTicket.getObj().setId_vehiculo(id_vehiculo);
            daoTicket.getObj().setId_parqueadero(id_parqueadero);
            daoTicket.getObj().setEstadoTicket(EstadoTicketEnum.valueOf(estadoTicket));
            if(!daoTicket.save())
                throw new  Exception("No se pudo guardar los datos del Ticket");
        }
    }

    public void updateTicket(Integer id, @NotNull Double tarifa,
                             Integer id_vehiculo, Integer id_parqueadero, @NotEmpty String estadoTicket) throws Exception {
        System.out.println(id);
        System.out.println(estadoTicket);
        if(tarifa.toString().length() > 0 && id_vehiculo > 0 && id_parqueadero >0 &&
                estadoTicket.trim().length() > 0) {
            daoTicket.setObj(daoTicket.listAll().get(id));
            daoTicket.getObj().setTarifa(tarifa);
            daoTicket.getObj().setId_vehiculo(id_vehiculo);
            daoTicket.getObj().setId_parqueadero(id_parqueadero);
            daoTicket.getObj().setEstadoTicket(EstadoTicketEnum.valueOf(estadoTicket));
            if(!daoTicket.update(id ))
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
                aux.put("estadoTicket", String.valueOf(arreglo[i].getEstadoTicket()));
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
        if (daoTicket.getObj().getEstadoTicket() == EstadoTicketEnum.PENDIENTE){
            daoTicket.getObj().setHoraSalida(new Date());
            Integer tiempoTotal = calculoTiempo(id,daoTicket.getObj().getHoraSalida());
            Double calculo = tiempoTotal * daoTicket.getObj().getTarifa();
            if (calculo == 0){
                calculo = daoTicket.getObj().getTarifa();
            }
            daoTicket.getObj().setTotalPagar(calculo);
            daoTicket.getObj().setEstadoTicket(EstadoTicketEnum.PAGADO);
            if(!daoTicket.update(id))
                throw new  Exception("No se pudo modificar los datos del Ticket");
        }
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
        else if (atributo.equalsIgnoreCase("estadoTicket")) {
            return  Arrays.asList(daoTicket.orderEstado(type).toArray());
        }
        else
            return Arrays.asList((HashMap) listTicket());
    }


    public List<String> listEstadoTicket() {
        List<String> lista = new ArrayList<>();
        for(EstadoTicketEnum r: EstadoTicketEnum.values()) {
            lista.add(r.toString());
        }
        return lista;
    }

    public List<HashMap> search(String attribute, String text, Integer type) throws Exception {
        System.out.println("LLEGO AQUI??? " + attribute + "  " + text + "  " + type);
        LinkedList<HashMap<String, String>> lista = daoTicket.search(attribute, text, type);
        System.out.println("ENcontro algo? " + lista);
        if(!lista.isEmpty())
            return Arrays.asList(lista.toArray());
        else
            return new ArrayList<>();
    }


//    public static void main(String[] args) throws Exception {
//        TicketService ticketService = new TicketService();
//        ticketService.search("estadoTicket", "pagado", 1);
//    }


}










