package com.mistletoe.estaciona.base.service;

import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoReserva;
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPersona; // Asumiendo que DaoPersona existe
import com.mistletoe.estaciona.base.controller.dao.dao_models.DaoPlaza; // Asumiendo que DaoPlaza existe
import com.mistletoe.estaciona.base.models.Reserva;
import com.mistletoe.estaciona.base.models.Persona; // Asumiendo que Persona existe
import com.mistletoe.estaciona.base.models.Plaza; // Asumiendo que Plaza existe
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.text.SimpleDateFormat;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class ReservaService {
    private DaoReserva daoReserva;

    public ReservaService() {
        this.daoReserva = new DaoReserva();
    }

    public void createReserva(@NotNull Date fecha, @NotNull LocalDateTime horaEntrada,
                              @NotNull LocalDateTime horaSalida, @NotNull Integer idCliente,
                              @NotNull Integer idEspacioParqueadero) throws Exception {
        if (fecha == null || horaEntrada == null || horaSalida == null ||
            idCliente == null || idCliente <= 0 ||
            idEspacioParqueadero == null || idEspacioParqueadero <= 0) {
            throw new Exception("Datos de la reserva incompletos o invalidos.");
        }
        this.daoReserva.getObj().setFecha(fecha);
        this.daoReserva.getObj().setHoraEntrada(horaEntrada);
        this.daoReserva.getObj().setHoraSalida(horaSalida);
        this.daoReserva.getObj().setIdCliente(idCliente);
        this.daoReserva.getObj().setIdEspacioParqueadero(idEspacioParqueadero);
        if (!this.daoReserva.save()) {
            throw new Exception("No se pudo guardar los datos de la reserva");
        }
    }

    public void updateReserva(@NotNull Integer id, @NotNull Date fecha, @NotNull LocalDateTime horaEntrada,
                              @NotNull LocalDateTime horaSalida, @NotNull Integer idCliente,
                              @NotNull Integer idEspacioParqueadero) throws Exception {
        if (id == null || id <= 0 || fecha == null || horaEntrada == null || horaSalida == null ||
            idCliente == null || idCliente <= 0 ||
            idEspacioParqueadero == null || idEspacioParqueadero <= 0) {
            throw new Exception("Datos de la reserva incompletos o invalidos para actualizar.");
        }

        Reserva reservaToUpdate = null;
        int posToUpdate = -1;
        List<Reserva> allReservas = Arrays.asList(this.daoReserva.listAll().toArray());
        for (int i = 0; i < allReservas.size(); i++) {
            Reserva r = allReservas.get(i);
            if (r != null && r.getId() != null && r.getId().equals(id)) {
                reservaToUpdate = r;
                posToUpdate = i;
                break;
            }
        }

        if (reservaToUpdate == null || posToUpdate == -1) {
            throw new Exception("Reserva con ID " + id + " no encontrada para actualizar.");
        }

        this.daoReserva.setObj(reservaToUpdate);
        this.daoReserva.getObj().setFecha(fecha);
        this.daoReserva.getObj().setHoraEntrada(horaEntrada);
        this.daoReserva.getObj().setHoraSalida(horaSalida);
        this.daoReserva.getObj().setIdCliente(idCliente);
        this.daoReserva.getObj().setIdEspacioParqueadero(idEspacioParqueadero);
        if (!this.daoReserva.update(posToUpdate)) {
            throw new Exception("No se pudo modificar los datos de la reserva");
        }
    }

    public List<Reserva> list(Pageable pageable) {
        return Arrays.asList(this.daoReserva.listAll().toArray());
    }

    public List<Reserva> listAll() {
        return Arrays.asList(this.daoReserva.listAll().toArray());
    }

    public Reserva getReservaById(@NotNull Integer id) {
        if (id == null || id <= 0) {
            return null;
        }
        List<Reserva> list = listAll();
        for (Reserva r : list) {
            if (r != null && r.getId() != null && r.getId().equals(id)) {
                return r;
            }
        }
        return null;
    }

    public List<HashMap<String, String>> listClienteCombo() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoPersona daoPersona = new DaoPersona();
        if (!daoPersona.listAll().isEmpty()) {
            Persona[] arreglo = daoPersona.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre() + " " + arreglo[i].getApellido());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap<String, String>> listEspacioParqueaderoCombo() {
        List<HashMap<String, String>> lista = new ArrayList<>();
        DaoPlaza daoPlaza = new DaoPlaza();
        if (!daoPlaza.listAll().isEmpty()) {
            Plaza[] arreglo = daoPlaza.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getCodigo());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap<String, String>> listReservaConNombres() throws Exception {
        List<HashMap<String, String>> lista = new ArrayList<>();
        if (!daoReserva.listAll().isEmpty()) {
            List<Reserva> reservas = Arrays.asList(daoReserva.listAll().toArray());
            DaoPersona daoPersona = new DaoPersona();
            DaoPlaza daoPlaza = new DaoPlaza();

            List<Persona> allPersonas = Arrays.asList(daoPersona.listAll().toArray());
            List<Plaza> allPlazas = Arrays.asList(daoPlaza.listAll().toArray());

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

            for (Reserva reserva : reservas) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", reserva.getId() != null ? reserva.getId().toString() : "");
                aux.put("fecha", reserva.getFecha() != null ? dateFormatter.format(reserva.getFecha()) : "");
                aux.put("horaEntrada", reserva.getHoraEntrada() != null ? reserva.getHoraEntrada().format(formatter) : "");
                aux.put("horaSalida", reserva.getHoraSalida() != null ? reserva.getHoraSalida().format(formatter) : "");
                aux.put("idEspacioParqueadero", reserva.getIdEspacioParqueadero() != null ? reserva.getIdEspacioParqueadero().toString() : "");
                aux.put("idCliente", reserva.getIdCliente() != null ? reserva.getIdCliente().toString() : "");

                String nombreCliente = "Desconocido";
                if (reserva.getIdCliente() != null && reserva.getIdCliente() > 0 && reserva.getIdCliente() <= allPersonas.size()) {
                    Persona clienteEncontrado = allPersonas.get(reserva.getIdCliente() - 1);
                    if (clienteEncontrado != null && clienteEncontrado.getNombre() != null && clienteEncontrado.getApellido() != null) {
                        nombreCliente = clienteEncontrado.getNombre() + " " + clienteEncontrado.getApellido();
                    }
                }
                aux.put("nombreCliente", nombreCliente);

                String codigoEspacio = "Desconocido";
                if (reserva.getIdEspacioParqueadero() != null && reserva.getIdEspacioParqueadero() > 0 && reserva.getIdEspacioParqueadero() <= allPlazas.size()) {
                    Plaza plazaEncontrada = allPlazas.get(reserva.getIdEspacioParqueadero() - 1);
                    if (plazaEncontrada != null && plazaEncontrada.getCodigo() != null) {
                        codigoEspacio = plazaEncontrada.getCodigo();
                    }
                }
                aux.put("codigoEspacio", codigoEspacio);

                lista.add(aux);
            }
        }
        return lista;
    }
}