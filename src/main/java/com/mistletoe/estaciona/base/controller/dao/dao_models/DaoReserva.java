package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.models.Reserva;
import com.mistletoe.estaciona.base.controller.data_struct.list.LinkedList;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPersona;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;

public class DaoReserva extends AdapterDao<Reserva> {
    private Reserva obj;

    public DaoReserva() {
        super(Reserva.class);
    }

    public Reserva getObj() {
        if (obj == null) this.obj = new Reserva();
        return this.obj;
    }

    public void setObj(Reserva obj) {
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

    public Boolean updateReserva(Reserva obj, Integer id) {
        try {
            this.update_by_id(obj, id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

     public Boolean delete(Integer id) {
        try {
            for (Reserva nn: listAll().toArray()) {
                if (id.equals(nn.getId())) {
                    nn.setEliminado(true);
                    updateReserva(nn, id);
                    break;
                }
            }
            //for (int i = 1; i < listAll().getLength() + 1; i++) {
                //System.out.println(listAll().get(i));
            //}
            //System.out.println(listAll().get(id)+"iddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
            //this.listAll().get(id).setEliminado(true);//eliminado logico
            //System.out.println(listAll().get(id).getId() + " eliminado");

            //delete_by_id(id);elimina en json
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public LinkedList<HashMap<String, String>> all(LinkedList<Reserva> reservas) throws Exception {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!reservas.isEmpty()) {
            Reserva[] arreglo = reservas.toArray();
            for (Reserva reserva : arreglo) {
                lista.add(toDict(reserva));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Reserva reserva) throws Exception {
        DaoPersona daoPersona = new DaoPersona();
        SimpleDateFormat sdfFecha = new SimpleDateFormat("yyyy-MM-dd", new Locale("es", "EC"));
        SimpleDateFormat sdfHora = new SimpleDateFormat("HH:mm");

        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", reserva.getId().toString());
        aux.put("fecha", sdfFecha.format(reserva.getFecha()));
        aux.put("horaEntrada", sdfHora.format(reserva.getHoraEntrada()));
        aux.put("horaSalida", sdfHora.format(reserva.getHoraSalida()));
        aux.put("cliente", daoPersona.get(reserva.getIdCliente()).getNombre());
        aux.put("id_cliente", reserva.getIdCliente().toString());
        aux.put("plaza", reserva.getIdPlaza() != null ? reserva.getIdPlaza().toString() : "");
        aux.put("id_plaza", reserva.getIdPlaza() != null ? reserva.getIdPlaza().toString() : "");
        return aux;
    }
}