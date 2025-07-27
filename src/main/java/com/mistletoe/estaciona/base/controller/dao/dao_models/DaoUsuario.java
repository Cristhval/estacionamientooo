package com.mistletoe.estaciona.base.controller.dao.dao_models;

import java.util.HashMap;

import com.mistletoe.estaciona.base.controller.dao.AdapterDao;
import com.mistletoe.estaciona.base.controller.data_struct.Utiles;
import com.mistletoe.estaciona.base.controller.data_struct.list.LinkedList;
import com.mistletoe.estaciona.base.models.Persona;


public class DaoUsuario extends AdapterDao<Persona>{
    private Persona obj;

    public DaoUsuario() {
        super(Persona.class);

    }

    public Persona getObj() {
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



    public HashMap<String, Object> toDict(Persona p) throws Exception{
        HashMap<String, Object> map = new HashMap<>();
        map.put("usuario", p.getUsuario());
        map.put("id", p.getId());
        map.put("rol", p.getRol());
        map.put("correoElectronico", p.getCorreoElectronico());
        return map;
    }

    private HashMap<String, Object> toDictPassword(Persona p) throws Exception{
        HashMap<String, Object> map = new HashMap<>();
        map.put("usuario", p.getUsuario());
        map.put("clave", p.getClave());
        map.put("id", p.getId());
        map.put("rol", p.getRol());
        map.put("nombre", p.getNombre());
        map.put("correoElectronico", p.getCorreoElectronico());
        return map;
    }

    private LinkedList<HashMap<String, Object>> listPrivate() throws Exception{
        LinkedList<HashMap<String, Object>> lista = new LinkedList<>();
        if(!listAll().isEmpty()){
            Persona[] aux = listAll().toArray();
            for(Persona c: aux){
                lista.add(toDictPassword(c));
            }
        }
        return lista;
    }

    
    private int partition(HashMap<String, Object> arr[], int begin, int end, Integer type, String attribute) {
        // hashmap //clave - valor
        // Calendar cd = Calendar.getInstance();
        
        HashMap<String, Object> pivot = arr[end];
        int i = (begin - 1);

        
        if (type == Utiles.ASCEDENTE) {
            
            for (int j = begin; j < end; j++) {
                System.out.println("hashmap " + arr[j]);
                System.out.println("atribute " + attribute);
                System.out.println("completo busqueda " + arr[j].get(attribute));
                System.out.println("primera creacion de string"+arr[j].get(attribute).toString());
                System.out.println("segunda creacion de string"+pivot.get(attribute).toString());

                if (arr[j].get(attribute).toString().compareTo(pivot.get(attribute).toString()) < 0) {
                    
                    // if (arr[j] <= pivot) {
                    i++;
                    HashMap<String, Object> swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        } else {
            for (int j = begin; j < end; j++) {
                System.out.println("primera creacion de string"+arr[j].get(attribute).toString());
                System.out.println("segunda creacion de string"+pivot.get(attribute).toString());

                if (arr[j].get(attribute).toString().compareTo(pivot.get(attribute).toString()) > 0) {
                    
                    // if (arr[j] <= pivot) {
                    i++;
                    HashMap<String, Object> swapTemp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = swapTemp;
                }
            }
        }
        HashMap<String, Object> swapTemp = arr[i + 1];
        arr[i + 1] = arr[end];
        arr[end] = swapTemp;

        return i + 1;
    }

    private void quickSort(HashMap<String, Object> arr[], int begin, int end, Integer type, String attribute) {
        if (begin < end) {
            System.out.println("el problema esta en el partition :v");
            int partitionIndex = partition(arr, begin, end, type, attribute);
            System.out.println("todavia estamos en el quick 1");
            quickSort(arr, begin, partitionIndex - 1, type, attribute);
            System.out.println("todavia estamos en el quick 2");
            quickSort(arr, partitionIndex + 1, end, type, attribute);
            System.out.println("todavia estamos en el quick 3");
        }
    }




    public HashMap<String, Object> login (String usuario, String clave) throws Exception{
        //System.out.println("correoElectronico: "+usuario);
        //System.out.println("clave: "+clave);
        if(!listAll().isEmpty()){
            HashMap<String, Object>[] arreglo = listPrivate().toArray();
            System.out.println(arreglo[0].get("correroElectronico") + "  este es null?");
            
            //System.out.println("el arreglo spuestamente desordenado  " + arreglo.length);

            quickSort(arreglo, 0, arreglo.length - 1, 1, "correoElectronico");
            
            //System.out.println("el arreglo spuestamente ordenado  " + arreglo.length);

            HashMap<String, Object> search = BinarySearchRecursive(arreglo, 0, arreglo.length-1, "correoElectronico", usuario);
            System.out.println("objeto buscado" + search);
            if(search != null){
                if(search.get("clave").toString().equals(clave)){
                    return toDict(get((Integer)search.get("id")));
                }else{
                    throw new Exception("Credenciales erroneas");
                }
            }else 
                throw new Exception("No se encontro la cuenta");
        }else return null;
    }


    public HashMap<String, Object> BinarySearchRecursive(HashMap<String, Object> arr[], int a, int b,String attribute, String value) throws Exception {
        if (b < 1) {
            return null;
        }
        int n = a + (b = 1) / 2;

        if (arr[n].get(attribute).toString().equals(value))
            return arr[n];

        else if (arr[n].get(attribute).toString().compareTo(value) > 0)
            return BinarySearchRecursive(arr, a, n - 1, attribute, value);

        else
            return BinarySearchRecursive(arr, n + 1, b, attribute, value);
    }

}
