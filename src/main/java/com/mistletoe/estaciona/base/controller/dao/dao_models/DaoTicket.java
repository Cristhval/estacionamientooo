package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.controller.data_struct.Utiles;
import com.mistletoe.estaciona.base.controller.data_struct.list.LinkedList;
import com.mistletoe.estaciona.base.models.Ticket;
import org.hibernate.event.spi.SaveOrUpdateEvent;

import java.util.HashMap;

public class DaoTicket extends AdapterDao<Ticket>{
    private Ticket obj;

    public DaoTicket() {
        super(Ticket.class);
    }

    public Ticket getObj() {
        if (obj == null)
            this.obj = new Ticket();
        return this.obj;
    }

    public void setObj(Ticket obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength()+1);
            System.out.printf("----------aaaa" + obj.getHoraSalida());
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

    public LinkedList<HashMap<String, String>> all(LinkedList<Ticket> tickets) throws Exception {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        System.out.println("LLEgo al all ");
        if (!tickets.isEmpty()) {
            Ticket[] arreglo = tickets.toArray();
            System.out.println(arreglo.length);
            for (int i = 0; i < arreglo.length; i++) {
                System.out.println("contador " + i);
                System.out.println("aaaa " + arreglo[i].getId());
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    //"id":1,"horaEntrada":"Jun 10, 2025, 7:00:00 PM","horaSalida":"Jun 11, 2025, 7:00:00 PM","tarifa":0.45,"totalPagar":10.0,"id_vehiculo":1,"id_parqueadero":1,"estadoTicket":"PAGADO"
    private HashMap<String, String> toDict(Ticket arreglo) throws Exception {
        DaoParqueadero da = new DaoParqueadero();
        DaoVehiculo dv = new DaoVehiculo();
        System.out.println("Entre al dict "+ arreglo.getId().toString());
        System.out.println((arreglo.getId_parqueadero()));
        System.out.println((arreglo.getId_vehiculo()));
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("horaEntrada", arreglo.getHoraEntrada().toString());
        aux.put("horaSalida",  arreglo.getHoraSalida() !=null? arreglo.getHoraSalida().toString():"");
        aux.put("tarifa", arreglo.getTarifa().toString());
        aux.put("totalPagar", arreglo.getTotalPagar() !=null?  arreglo.getTotalPagar().toString():"");
        aux.put("vehiculo",dv.get(arreglo.getId_vehiculo()).getPlaca());
        aux.put("parqueadero",da.get(arreglo.getId_parqueadero()).getNombre());
        aux.put("estadoTicket", arreglo.getEstadoTicket().toString());




        return aux;
    }

    //ORDEN POR HORA DE ENTRADA
    private int partition(Ticket arr[], int begin, int end, Integer type) {

        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getHoraEntrada().toString().toLowerCase().compareTo(pivot.getHoraEntrada().toString().toLowerCase()) < 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getHoraEntrada().toString().toLowerCase().compareTo(pivot.getHoraEntrada().toString().toLowerCase()) > 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort(Ticket arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition(arr, begin, end, type);

            quickSort(arr, begin, partitionIndex - 1, type);
            quickSort(arr, partitionIndex + 1, end, type);
        }
    }

    public LinkedList<HashMap<String, String>> orderHoraEntrada(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }
//ORDEN POR HORA SALIDA

    public LinkedList<HashMap<String, String>> orderHoraSalida(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort2(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition2(Ticket arr[], int begin, int end, Integer type) {

        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getHoraSalida().toString().toLowerCase().compareTo(pivot.getHoraSalida().toString().toLowerCase()) < 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getHoraSalida().toString().toLowerCase().compareTo(pivot.getHoraSalida().toString().toLowerCase()) > 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort2(Ticket arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition2(arr, begin, end, type);

            quickSort2(arr, begin, partitionIndex - 1, type);
            quickSort2(arr, partitionIndex + 1, end, type);
        }
    }

    //ORDEN POR TARIFA
    public LinkedList<HashMap<String, String>> orderTarifa(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort3(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition3(Ticket arr[], int begin, int end, Integer type) {

        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getTarifa()< pivot.getTarifa()) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getTarifa()> pivot.getTarifa())  {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort3(Ticket arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition3(arr, begin, end, type);

            quickSort3(arr, begin, partitionIndex - 1, type);
            quickSort3(arr, partitionIndex + 1, end, type);
        }
    }
//ORDEN POR TOTAL A PAGAR

    public LinkedList<HashMap<String, String>> orderTotalPagar(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort4(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition4(Ticket arr[], int begin, int end, Integer type) {
        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getTotalPagar()< pivot.getTotalPagar()) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getTotalPagar()> pivot.getTotalPagar())  {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort4(Ticket arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition4(arr, begin, end, type);

            quickSort4(arr, begin, partitionIndex - 1, type);
            quickSort4(arr, partitionIndex + 1, end, type);
        }
    }

// ORDEN POR VEhiculo

    public LinkedList<HashMap<String, String>> orderVehiculo(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort5(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition5(Ticket arr[], int begin, int end, Integer type) throws Exception {

        DaoVehiculo daoVehiculo = new DaoVehiculo();
        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (daoVehiculo.get(arr[j].getId_vehiculo()).getPlaca().toLowerCase().compareTo(daoVehiculo.get(pivot.getId_vehiculo()).getPlaca().toLowerCase()) < 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else { //aux.put("genero",da.get(arreglo.getId_genero()).getNombre());
            for (int j = begin; j < end; j++) {
                if (daoVehiculo.get(arr[j].getId_vehiculo()).getPlaca().toLowerCase().compareTo(daoVehiculo.get(pivot.getId_vehiculo()).getPlaca().toLowerCase()) > 0)  {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort5(Ticket arr[], int begin, int end, Integer type) throws Exception {
        if (begin < end) {
            int partitionIndex = partition5(arr, begin, end, type);

            quickSort5(arr, begin, partitionIndex - 1, type);
            quickSort5(arr, partitionIndex + 1, end, type);
        }
    }


    // ORDEN POR PArqueadero


    public LinkedList<HashMap<String, String>> orderParqueadero(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort6(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition6(Ticket arr[], int begin, int end, Integer type) throws Exception {
        DaoParqueadero daoParqueadero = new DaoParqueadero();
        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (daoParqueadero.get(arr[j].getId_vehiculo()).getNombre().toLowerCase().compareTo(daoParqueadero.get(pivot.getId_vehiculo()).getNombre().toLowerCase()) < 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else { //aux.put("genero",da.get(arreglo.getId_genero()).getNombre());
            for (int j = begin; j < end; j++) {
                if (daoParqueadero.get(arr[j].getId_vehiculo()).getNombre().toLowerCase().compareTo(daoParqueadero.get(pivot.getId_vehiculo()).getNombre().toLowerCase()) > 0)  {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort6(Ticket arr[], int begin, int end, Integer type) throws Exception {
        if (begin < end) {
            int partitionIndex = partition6(arr, begin, end, type);

            quickSort6(arr, begin, partitionIndex - 1, type);
            quickSort6(arr, partitionIndex + 1, end, type);
        }
    }

    // ORDEN POR ESTADO-------------------------------------------------------------------------------------------

    public LinkedList<HashMap<String, String>> orderEstado(Integer type) throws Exception {
        LinkedList<Ticket> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Ticket arr[] = listAll().toArray();
            quickSort7(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition7(Ticket arr[], int begin, int end, Integer type) throws Exception {
        Ticket pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getEstadoTicket().toString().toLowerCase().compareTo(pivot.getEstadoTicket().toString().toLowerCase()) < 0) {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else { //aux.put("genero",da.get(arreglo.getId_genero()).getNombre());
            for (int j = begin; j < end; j++) {
                if (arr[j].getEstadoTicket().toString().toLowerCase().compareTo(pivot.getEstadoTicket().toString().toLowerCase()) > 0)  {
                    i++;
                    Ticket swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Ticket swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort7(Ticket arr[], int begin, int end, Integer type) throws Exception {
        if (begin < end) {
            int partitionIndex = partition7(arr, begin, end, type);

            quickSort7(arr, begin, partitionIndex - 1, type);
            quickSort7(arr, partitionIndex + 1, end, type);
        }
    }
    //busqueda


    public LinkedList<HashMap<String, String>> search(String attribute, String text, Integer type) throws Exception {
        System.out.println("Esta haciendo algo aqui? " + attribute + " " + text + " " + type );
        LinkedList<HashMap<String, String>> lista = all(listAll());
        System.out.println("que pasa? " + lista);
        LinkedList<HashMap<String, String>> resp = new LinkedList<>();

        if (!lista.isEmpty()) {
            HashMap<String, String>[] arr = lista.toArray();
            System.out.println(attribute+" "+text+" ** *** * * ** * * * *");
            switch (type) {
                case 1:
                    System.out.println(attribute+" "+text+" UNO");
                    for (HashMap m : arr) {
                        if (m.get(attribute).toString().toLowerCase().startsWith(text.toLowerCase())) {
                            resp.add(m);
                        }
                    }
                    break;
                case 2:
                    System.out.println(attribute+" "+text+" DOS");
                    for (HashMap m : arr) {
                        if (m.get(attribute).toString().toLowerCase().endsWith(text.toLowerCase())) {
                            resp.add(m);
                        }
                    }
                    break;
                default:
                    System.out.println(attribute+" "+text+" TRES");
                    for (HashMap m : arr) {
                        System.out.println("***** "+m.get(attribute)+"   "+attribute);
                        if (m.get(attribute).toString().toLowerCase().contains(text.toLowerCase())) {
                            resp.add(m);
                        }
//                        System.out.println("llego aqui?3 "+m.get(attribute));
                    }
                    break;
            }
        }
        return resp;
    }

}
