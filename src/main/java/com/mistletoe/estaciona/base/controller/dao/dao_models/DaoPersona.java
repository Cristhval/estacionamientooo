package com.mistletoe.estaciona.base.controller.dao.dao_models;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.controller.data_struct.Utiles;
import com.mistletoe.estaciona.base.controller.data_struct.list.LinkedList;
import com.mistletoe.estaciona.base.models.Persona;
import com.mistletoe.estaciona.base.models.RolEnum;
import org.springframework.security.core.parameters.P;

import java.util.Date;
import java.util.HashMap;


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

    public LinkedList<HashMap<String, String>> all(LinkedList<Persona> personas) throws Exception {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!personas.isEmpty()) {
            Persona[] arreglo = personas.toArray();
            for (int i = 0; i < arreglo.length; i++) {

                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    private HashMap<String, String> toDict(Persona arreglo) throws Exception {

        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("nombre", arreglo.getNombre());
        aux.put("apellido", arreglo.getApellido());
        aux.put("correoElectronico", arreglo.getCorreoElectronico());
        aux.put("rol", arreglo.getRol().toString());
        return aux;
    }

    private int partition(Persona arr[], int begin, int end, Integer type) {

        Persona pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getNombre().toLowerCase().compareTo(pivot.getNombre().toLowerCase()) < 0) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getNombre().toLowerCase().compareTo(pivot.getNombre().toLowerCase()) > 0) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Persona swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort(Persona arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition(arr, begin, end, type);

            quickSort(arr, begin, partitionIndex - 1, type);
            quickSort(arr, partitionIndex + 1, end, type);
        }
    }

    public LinkedList<HashMap<String, String>> orderName(Integer type) throws Exception {
        LinkedList<Persona> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Persona arr[] = listAll().toArray();
            quickSort(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    //ORDEN POR Apellido--------------------------------------------------------------------------------------------
    public LinkedList<HashMap<String, String>> orderApellido(Integer type) throws Exception {
        LinkedList<Persona> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Persona arr[] = listAll().toArray();
            quickSort2(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition2(Persona arr[], int begin, int end, Integer type) {

        Persona pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getApellido().toLowerCase().compareTo(pivot.getApellido().toLowerCase()) < 0) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getApellido().toLowerCase().compareTo(pivot.getApellido().toLowerCase()) > 0) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Persona swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort2(Persona arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition2(arr, begin, end, type);

            quickSort2(arr, begin, partitionIndex - 1, type);
            quickSort2(arr, partitionIndex + 1, end, type);
        }
    }

    //ORDEN POR CORREO ELECTRONICO

    public LinkedList<HashMap<String, String>> orderCorreo(Integer type) throws Exception {
        LinkedList<Persona> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Persona arr[] = listAll().toArray();
            quickSort3(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition3(Persona arr[], int begin, int end, Integer type) {

        Persona pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getCorreoElectronico().toLowerCase().compareTo(pivot.getCorreoElectronico().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getCorreoElectronico().toLowerCase().compareTo(pivot.getCorreoElectronico().toLowerCase()) > 0)  {
                    // if (arr[j] <= pivot) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Persona swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort3(Persona arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition3(arr, begin, end, type);

            quickSort3(arr, begin, partitionIndex - 1, type);
            quickSort3(arr, partitionIndex + 1, end, type);
        }
    }

    //ORDEN POR Rol _--------------------------------------------------------------------

    public LinkedList<HashMap<String, String>> orderRol(Integer type) throws Exception {
        LinkedList<Persona> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {

            Persona arr[] = listAll().toArray();
            quickSort4(arr, 0, arr.length - 1, type);
            lista.toList(arr);
        }
        return all(lista);
    }

    private int partition4(Persona arr[], int begin, int end, Integer type) {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();

        Persona pivot = arr[end];
        int i = (begin - 1);
        if (type == Utiles.ASCEDENTE) {
            for (int j = begin; j < end; j++) {
                if (arr[j].getRol().toString().toLowerCase().compareTo(pivot.getRol().toString().toLowerCase()) < 0) {
                    // if (arr[j] <= pivot) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                if (arr[j].getRol().toString().toLowerCase().compareTo(pivot.getRol().toString().toLowerCase()) > 0)  {
                    // if (arr[j] <= pivot) {
                    i++;
                    Persona swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        Persona swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort4(Persona arr[], int begin, int end, Integer type) {
        if (begin < end) {
            int partitionIndex = partition4(arr, begin, end, type);

            quickSort4(arr, begin, partitionIndex - 1, type);
            quickSort4(arr, partitionIndex + 1, end, type);
        }
    }

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
                    }
                    break;
            }
        }
        return resp;
    }


}
