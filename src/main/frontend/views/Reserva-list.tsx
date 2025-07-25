import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, Notification, VerticalLayout } from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';
import {ReservaService, TicketService} from 'Frontend/generated/endpoints';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

export const config: ViewConfig = {
  title: 'Reserva',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 2,
    title: 'Reserva',
  },
};


function ReservaEntryForm({ onReservaCreated }: { onReservaCreated?: () => void }) {
  const dialogOpened = useSignal(false);
  const fecha = useSignal('');
  const horaEntrada = useSignal('');
  const horaSalida = useSignal('');
  const cliente = useSignal('');
  const plaza = useSignal('');

  const listaClientes = useSignal<{ label: string; value: string }[]>([]);
  const listaPlazas = useSignal<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await ReservaService.listaAlbumClientes();
      listaClientes.value = (data ?? []).map((item: any) => ({
        label: item.label ?? String(item),
        value: String(item.value ?? item.id),
      }));
    };
    const fetchPlazas = async () => {
      const data = await ReservaService.listaAlbumPlazas();
      listaPlazas.value = (data ?? []).map((item: any) => ({
        label: item.label ?? String(item),
        value: String(item.value ?? item.id),
      }));
    };
    fetchClientes();
    fetchPlazas();
  }, []);

  const crearReserva = async () => {
    try {
      if (fecha.value && horaEntrada.value && horaSalida.value && cliente.value && plaza.value) {
        const fechaParsed = new Date(fecha.value);
        const [entradaHoras, entradaMinutos] = horaEntrada.value.split(':').map(Number);
        const [salidaHoras, salidaMinutos] = horaSalida.value.split(':').map(Number);

        const horaEntradaDate = new Date(fechaParsed);
        horaEntradaDate.setHours(entradaHoras, entradaMinutos, 0, 0);

        const horaSalidaDate = new Date(fechaParsed);
        horaSalidaDate.setHours(salidaHoras, salidaMinutos, 0, 0);

        const idCliente = parseInt(cliente.value);
        const idPlaza = parseInt(plaza.value);

        await ReservaService.createReserva(
          fechaParsed.toISOString(),
          horaEntradaDate.toISOString(),
          horaSalidaDate.toISOString(),
          idCliente,
          idPlaza
        );

        dialogOpened.value = false;
        Notification.show('Reserva creada', { duration: 4000, position: 'bottom-end', theme: 'success' });
        if (onReservaCreated) onReservaCreated();
      } else {
        Notification.show('Complete todos los campos', { duration: 4000, position: 'top-center', theme: 'error' });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dialog modeless headerTitle="Nueva Reserva" opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => dialogOpened.value = detail.value}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={crearReserva} theme="primary">Registrar</Button>
          </>
        }
      >
        <VerticalLayout style={{ width: '20rem', alignItems: 'stretch' }}>
          <DatePicker label="Fecha" value={fecha.value} onValueChanged={(e) => (fecha.value = e.detail.value)} />
          <label>Hora Entrada</label>
          <input type="time" value={horaEntrada.value} onChange={(e) => (horaEntrada.value = e.target.value)} />
          <label>Hora Salida</label>
          <input type="time" value={horaSalida.value} onChange={(e) => (horaSalida.value = e.target.value)} />
          <ComboBox label="Cliente" items={listaClientes.value} itemLabelPath="label" itemValuePath="value"
            value={cliente.value} onValueChanged={(e) => (cliente.value = e.detail.value)} />
          <ComboBox label="Plaza" items={listaPlazas.value} itemLabelPath="label" itemValuePath="value"
            value={plaza.value} onValueChanged={(e) => (plaza.value = e.detail.value)} />
        </VerticalLayout>
      </Dialog>

      <Button onClick={() => dialogOpened.value = true}>Agregar</Button>
    </>
  );
}


function ReservaEntryFormUpdate({ item, onReservaUpdated }: { item: any, onReservaUpdated?: () => void }) {
  const dialogOpened = useSignal(false);
  const fecha = useSignal(item.fecha);
  const horaEntrada = useSignal(item.horaEntrada);
  const horaSalida = useSignal(item.horaSalida);
  const cliente = useSignal(item.id_cliente);
  const plaza = useSignal(item.id_plaza);

  const listaClientes = useSignal<{ label: string; value: string }[]>([]);
  const listaPlazas = useSignal<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await ReservaService.listaAlbumClientes();
      listaClientes.value = (data ?? []).map((item: any) => ({
        label: item.label ?? String(item),
        value: String(item.value ?? item.id),
      }));
    };
    const fetchPlazas = async () => {
      const data = await ReservaService.listaAlbumPlazas();
      listaPlazas.value = (data ?? []).map((item: any) => ({
        label: item.label ?? String(item),
        value: String(item.value ?? item.id),
      }));
    };
    fetchClientes();
    fetchPlazas();
  }, []);

  const updateReserva = async () => {
    try {
      if (fecha.value && horaEntrada.value && horaSalida.value && cliente.value && plaza.value) {
        const fechaParsed = new Date(fecha.value);
        const [entradaHoras, entradaMinutos] = horaEntrada.value.split(':').map(Number);
        const [salidaHoras, salidaMinutos] = horaSalida.value.split(':').map(Number);

        const horaEntradaDate = new Date(fechaParsed);
        horaEntradaDate.setHours(entradaHoras, entradaMinutos, 0, 0);

        const horaSalidaDate = new Date(fechaParsed);
        horaSalidaDate.setHours(salidaHoras, salidaMinutos, 0, 0);

        const idCliente = parseInt(cliente.value);
        const idPlaza = parseInt(plaza.value);

        await ReservaService.updateReserva(
          parseInt(item.id),
          fechaParsed.toISOString(),
          horaEntradaDate.toISOString(),
          horaSalidaDate.toISOString(),
          idCliente,
          idPlaza
        );

        dialogOpened.value = false;
        Notification.show('Reserva actualizada', { duration: 4000, position: 'bottom-end', theme: 'success' });
        if (onReservaUpdated) onReservaUpdated();
      } else {
        Notification.show('Complete todos los campos', { duration: 4000, position: 'top-center', theme: 'error' });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Dialog modeless headerTitle="Editar Reserva" opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => dialogOpened.value = detail.value}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={updateReserva} theme="primary">Actualizar</Button>
          </>
        }
      >
        <VerticalLayout style={{ width: '20rem', alignItems: 'stretch' }}>
          <DatePicker label="Fecha" value={fecha.value} onValueChanged={(e) => (fecha.value = e.detail.value)} />
          <label>Hora Entrada</label>
          <input type="time" value={horaEntrada.value} onChange={(e) => (horaEntrada.value = e.target.value)} />
          <label>Hora Salida</label>
          <input type="time" value={horaSalida.value} onChange={(e) => (horaSalida.value = e.target.value)} />
          <ComboBox label="Cliente" items={listaClientes.value} itemLabelPath="label" itemValuePath="value"
            value={cliente.value} onValueChanged={(e) => (cliente.value = e.detail.value)} />
          <ComboBox label="Plaza" items={listaPlazas.value} itemLabelPath="label" itemValuePath="value"
            value={plaza.value} onValueChanged={(e) => (plaza.value = e.detail.value)} />
        </VerticalLayout>
      </Dialog>

      <Button onClick={() => dialogOpened.value = true}>Editar</Button>
    </>
  );
}


export default function ReservaView() {
  const [items, setItems] = useState<any[]>([]);

  const cargarReservas = () => {
    ReservaService.listReserva().then((data) => setItems(data ?? []));
  };

  const deleteReserva = (id) => {
    ReservaService.deleteReserva(id);

  };

  function indexLink({ item}: { item: void }) {

    return (
        <span>
          <ReservaEntryFormUpdate item={item} onReservaUpdated={cargarReservas} />

          <Button onClick  ={()=>deleteReserva(item.id)}  >  BORRAR</Button>
      </span>


    );
  }

  useEffect(() => { cargarReservas(); }, []);

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Reservas">
        <Group>
          <ReservaEntryForm onReservaCreated={cargarReservas} />
        </Group>
      </ViewToolbar>

      <Grid items={items}>
        <GridColumn header="#" renderer={({ model }: { model: GridItemModel<any> }) => <>{model.index + 1}</>} />
        <GridColumn path="fecha" header="Fecha" />
        <GridColumn path="horaEntrada" header="Hora Entrada" />
        <GridColumn path="horaSalida" header="Hora Salida" />
        <GridColumn path="cliente" header="Cliente" />
        <GridColumn path="plaza" header="Plaza" />
        <GridColumn header="Acciones" renderer={indexLink} />
      </Grid>
    </main>
  );
}
