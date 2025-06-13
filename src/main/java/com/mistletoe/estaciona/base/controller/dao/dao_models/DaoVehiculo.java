package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;

import com.mistletoe.estaciona.base.controller.data_struct.Utiles;
import com.mistletoe.estaciona.base.controller.data_struct.list.LinkedList;
import com.mistletoe.estaciona.base.models.RolEnum;
import com.mistletoe.estaciona.base.models.Vehiculo;

import java.util.HashMap;

public class DaoVehiculo extends AdapterDao<Vehiculo>{
    private Vehiculo obj;

    public DaoVehiculo() {
        super(Vehiculo.class);

    }

    public Vehiculo getObj() {
        if (obj == null)
            this.obj = new Vehiculo();
        return this.obj;
    }

    public void setObj(Vehiculo obj) {
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

    public LinkedList<HashMap<String, String>> all(LinkedList<Vehiculo> vehiculos) throws Exception {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!vehiculos.isEmpty()) {
            Vehiculo[] arreglo = vehiculos.toArray();
            for (int i = 0; i < arreglo.length; i++) {

                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    private HashMap<String, String> toDict(Vehiculo arreglo) throws Exception {
        DaoPersona da = new DaoPersona();
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("placa", arreglo.getPlaca());
        aux.put("marca", arreglo.getMarca());
        aux.put("modelo", arreglo.getModelo());
        aux.put("color", arreglo.getColor());
        aux.put("persona",da.get(arreglo.getId_persona()).getNombre());


        return aux;
    }

//ORDEN POR PLACA
    private int partition(Vehiculo arr[], int begin, int end, Integer type) {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();

        Vehiculo pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getPlaca().toLowerCase().compareTo(pivot.getPlaca().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getPlaca().toLowerCase().compareTo(pivot.getPlaca().toLowerCase()) > 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Vehiculo swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort(Vehiculo arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition(arr, begin, end, type);

            quickSort(arr, begin, partitionIndex - 1, type);
            quickSort(arr, partitionIndex + 1, end, type);
        }
    }

    public LinkedList<HashMap<String, String>> orderPlaca(Integer type) throws Exception {
        LinkedList<Vehiculo> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Vehiculo arr[] = listAll().toArray();
            quickSort(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }
//ORDEN POR MARCA

    public LinkedList<HashMap<String, String>> orderMarca(Integer type) throws Exception {
        LinkedList<Vehiculo> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Vehiculo arr[] = listAll().toArray();
            quickSort2(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition2(Vehiculo arr[], int begin, int end, Integer type) {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();

        Vehiculo pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getMarca().toLowerCase().compareTo(pivot.getMarca().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getMarca().toLowerCase().compareTo(pivot.getMarca().toLowerCase()) > 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Vehiculo swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort2(Vehiculo arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition2(arr, begin, end, type);

            quickSort2(arr, begin, partitionIndex - 1, type);
            quickSort2(arr, partitionIndex + 1, end, type);
        }
    }

//ORDEN POR MODELO
    public LinkedList<HashMap<String, String>> orderModelo(Integer type) throws Exception {
        LinkedList<Vehiculo> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Vehiculo arr[] = listAll().toArray();
            quickSort3(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition3(Vehiculo arr[], int begin, int end, Integer type) {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();

        Vehiculo pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getModelo().toLowerCase().compareTo(pivot.getModelo().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getMarca().toLowerCase().compareTo(pivot.getMarca().toLowerCase()) > 0)  {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Vehiculo swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort3(Vehiculo arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition3(arr, begin, end, type);

            quickSort3(arr, begin, partitionIndex - 1, type);
            quickSort3(arr, partitionIndex + 1, end, type);
        }
    }
//ORDEN POR COLOR

    public LinkedList<HashMap<String, String>> orderColor(Integer type) throws Exception {
        LinkedList<Vehiculo> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Vehiculo arr[] = listAll().toArray();
            quickSort4(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition4(Vehiculo arr[], int begin, int end, Integer type) {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();

        Vehiculo pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getColor().toString().toLowerCase().compareTo(pivot.getColor().toString().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getColor().toString().toLowerCase().compareTo(pivot.getColor().toString().toLowerCase()) > 0)  {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Vehiculo swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort4(Vehiculo arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition4(arr, begin, end, type);

            quickSort4(arr, begin, partitionIndex - 1, type);
            quickSort4(arr, partitionIndex + 1, end, type);
        }
    }

// ORDEN POR PERSONA


    public LinkedList<HashMap<String, String>> orderPersona(Integer type) throws Exception {
        LinkedList<Vehiculo> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Vehiculo arr[] = listAll().toArray();
            quickSort5(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition5(Vehiculo arr[], int begin, int end, Integer type) throws Exception {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();
        DaoPersona daoPersona = new DaoPersona();
        Vehiculo pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (daoPersona.get(arr[j].getId_persona()).getNombre().toLowerCase().compareTo(daoPersona.get(pivot.getId_persona()).getNombre().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else { //aux.put("genero",da.get(arreglo.getId_genero()).getNombre());
            for (int j = begin; j < end; j++) {
                if (daoPersona.get(arr[j].getId_persona()).getNombre().toLowerCase().compareTo(daoPersona.get(pivot.getId_persona()).getNombre().toLowerCase()) > 0)  {
                    // if (arr[j] <= pivot) {
                    i++;
                    Vehiculo swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Vehiculo swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort5(Vehiculo arr[], int begin, int end, Integer type) throws Exception {
        if (begin < end) {
            int partitionIndex = partition5(arr, begin, end, type);

            quickSort5(arr, begin, partitionIndex - 1, type);
            quickSort5(arr, partitionIndex + 1, end, type);
        }
    }


    //BUSQUEDA BINARIA
    public LinkedList<HashMap<String, String>> search(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> lista = all(listAll());
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
//                        System.out.println("llego aqui? "+m.get(attribute));
                    }
                    break;
                case 2:
                    System.out.println(attribute+" "+text+" DOS");
                    for (HashMap m : arr) {
                        if (m.get(attribute).toString().toLowerCase().endsWith(text.toLowerCase())) {
                            resp.add(m);
                        }
//                        System.out.println("llego aqui?2 "+m.get(attribute));
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
