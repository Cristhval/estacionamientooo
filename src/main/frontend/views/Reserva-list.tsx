import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ReservaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import Reserva from 'Frontend/generated/com/mistletoe/estaciona/base/models/Reserva';
import { useEffect, useState } from 'react';

import { GridSortColumn } from '@vaadin/react-components/GridSortColumn';

export const config: ViewConfig = {
  title: 'Reserva',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 7,
    title: 'Reserva',
  },
};

type ReservaEntryFormProps = {
  onReservaCreated?: () => void;
};

function ReservaEntryForm(props: ReservaEntryFormProps): JSX.Element {
  const dialogOpened = useSignal(false);

  const fecha = useSignal<string>('');
  const horaEntrada = useSignal<string>('');
  const horaSalida = useSignal<string>('');
  const idCliente = useSignal('');
  const idEspacioParqueadero = useSignal('');

  const createReserva = async (): Promise<void> => {
    try {
      const idClienteNum = parseInt(idCliente.value || '0');
      const idEspacioParqueaderoNum = parseInt(idEspacioParqueadero.value || '0');

      // Correccion: Eliminar cualquier espacio despues de la 'T'
      const formattedHoraEntrada = horaEntrada.value.replace('T ', 'T');
      const formattedHoraSalida = horaSalida.value.replace('T ', 'T');

      await ReservaService.createReserva(
        fecha.value,
        formattedHoraEntrada,
        formattedHoraSalida,
        idClienteNum,
        idEspacioParqueaderoNum
      );
      if (props.onReservaCreated) {
        props.onReservaCreated();
      }
      fecha.value = '';
      horaEntrada.value = '';
      horaSalida.value = '';
      idCliente.value = '';
      idEspacioParqueadero.value = '';
      dialogOpened.value = false;
      Notification.show('Reserva creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al crear la reserva', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  const listaClientes = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    ReservaService.listClienteCombo().then(data => {
      listaClientes.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaEspacios = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    ReservaService.listEspacioParqueaderoCombo().then(data => {
      listaEspacios.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nueva Reserva"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={createReserva} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <DatePicker
            label="Fecha"
            placeholder="Seleccione una fecha"
            value={fecha.value}
            onValueChanged={(evt) => (fecha.value = evt.detail.value)}
          />
          <TextField label="Hora Entrada (YYYY-MM-DDTHH:MM:SS)"
            placeholder="Ej: 2025-06-14T10:00:00"
            value={horaEntrada.value}
            onValueChanged={(evt) => (horaEntrada.value = evt.detail.value)}
          />
          <TextField label="Hora Salida (YYYY-MM-DDTHH:MM:SS)"
            placeholder="Ej: 2025-06-14T12:00:00"
            value={horaSalida.value}
            onValueChanged={(evt) => (horaSalida.value = evt.detail.value)}
          />
          <ComboBox label="Cliente"
            items={listaClientes.value}
            placeholder='Seleccione un Cliente'
            itemLabelPath="label"
            itemValuePath="value"
            value={idCliente.value}
            onValueChanged={(evt) => (idCliente.value = evt.detail.value)}
          />
          <ComboBox label="Espacio Parqueadero"
            items={listaEspacios.value}
            placeholder='Seleccione un Espacio de Parqueadero'
            itemLabelPath="label"
            itemValuePath="value"
            value={idEspacioParqueadero.value}
            onValueChanged={(evt) => (idEspacioParqueadero.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button
        onClick={() => {
          dialogOpened.value = true;
        }}
      >
        Agregar
      </Button>
    </>
  );
}

type ReservaEntryFormUpdateProps = {
  arguments: Reserva;
  onReservaUpdated?: () => void;
};

function ReservaEntryFormUpdate(props: ReservaEntryFormUpdateProps): JSX.Element {
  const dialogOpened = useSignal(false);

  const fecha = useSignal<string>(props.arguments.fecha ? new Date(props.arguments.fecha as string).toISOString().split('T')[0] : '');
  const horaEntrada = useSignal<string>(props.arguments.horaEntrada ? new Date(props.arguments.horaEntrada as string).toISOString().substring(0, 19) : '');
  const horaSalida = useSignal<string>(props.arguments.horaSalida ? new Date(props.arguments.horaSalida as string).toISOString().substring(0, 19) : '');
  const idCliente = useSignal<string>(props.arguments.idCliente?.toString() ?? '');
  const idEspacioParqueadero = useSignal<string>(props.arguments.idEspacioParqueadero?.toString() ?? '');
  const id = useSignal(props.arguments.id);

  useEffect(() => {
    // Estas líneas causaban un error porque 'nombre', 'genero', 'album' no existen en Reserva
    // nombre.value = props.arguments.nombre ?? '';
    // genero.value = props.arguments.id_genero?.toString() ?? '';
    // album.value = props.arguments.id_album?.toString() ?? '';
    fecha.value = props.arguments.fecha ? new Date(props.arguments.fecha as string).toISOString().split('T')[0] : '';
    horaEntrada.value = props.arguments.horaEntrada ? new Date(props.arguments.horaEntrada as string).toISOString().substring(0, 19) : '';
    horaSalida.value = props.arguments.horaSalida ? new Date(props.arguments.horaSalida as string).toISOString().substring(0, 19) : '';
    idCliente.value = props.arguments.idCliente?.toString() ?? '';
    idEspacioParqueadero.value = props.arguments.idEspacioParqueadero?.toString() ?? '';
    id.value = props.arguments.id;
  }, [props.arguments]);

  const listaClientes = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    ReservaService.listClienteCombo().then(data => {
      listaClientes.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaEspacios = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    ReservaService.listEspacioParqueaderoCombo().then(data => {
      listaEspacios.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const updateReserva = async (): Promise<void> => {
    try {
      const idClienteNum = parseInt(idCliente.value || '0');
      const idEspacioParqueaderoNum = parseInt(idEspacioParqueadero.value || '0');

      await ReservaService.updateReserva(
        id.value ?? 0,
        fecha.value,
        horaEntrada.value,
        horaSalida.value,
        idClienteNum,
        idEspacioParqueaderoNum
      );
      if (props.onReservaUpdated) {
        props.onReservaUpdated();
      }
      dialogOpened.value = false;
      Notification.show('Reserva actualizada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al actualizar la reserva', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Reserva"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={updateReserva} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <DatePicker
            label="Fecha"
            placeholder="Seleccione una fecha"
            value={fecha.value}
            onValueChanged={(evt) => (fecha.value = evt.detail.value)}
          />
          <TextField label="Hora Entrada (YYYY-MM-DDTHH:MM:SS)"
            placeholder="Ej: 2025-06-14T10:00:00"
            value={horaEntrada.value}
            onValueChanged={(evt) => (horaEntrada.value = evt.detail.value)}
          />
          <TextField label="Hora Salida (YYYY-MM-DDTHH:MM:SS)"
            placeholder="Ej: 2025-06-14T12:00:00"
            value={horaSalida.value}
            onValueChanged={(evt) => (horaSalida.value = evt.detail.value)}
          />
          <ComboBox label="Cliente"
            items={listaClientes.value}
            placeholder='Seleccione un Cliente'
            itemLabelPath="label"
            itemValuePath="value"
            value={idCliente.value}
            onValueChanged={(evt) => (idCliente.value = evt.detail.value)}
          />
          <ComboBox label="Espacio Parqueadero"
            items={listaEspacios.value}
            placeholder='Seleccione un Espacio de Parqueadero'
            itemLabelPath="label"
            itemValuePath="value"
            value={idEspacioParqueadero.value}
            onValueChanged={(evt) => (idEspacioParqueadero.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button
        onClick={() => {
          dialogOpened.value = true;
        }}
      >
        Editar
      </Button>
    </>
  );
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' });
const timeFormatter = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

export default function ReservaView() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  const callData = async (): Promise<void> => {
    try {
      const data = await ReservaService.listReservaConNombres();
      setItems(((data ?? []).filter((item): item is Record<string, string | undefined> => item !== undefined) as Record<string, unknown>[]));
    } catch (error) {
      console.error("Error al cargar datos de reservas:", error);
      handleError(error);
      Notification.show('Error al cargar la lista de reservas', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  useEffect(() => {
    callData();
  }, []);

  function index({ model }: { model: GridItemModel<Record<string, unknown>> }) {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  function link({ item }: { item: Record<string, unknown> }): JSX.Element {
    const reservaItem: Reserva = {
      id: item.id as number | undefined,
      fecha: item.fecha as string | undefined,
      horaEntrada: item.horaEntrada as any,
      horaSalida: item.horaSalida as any,
      idCliente: item.idCliente as number | undefined,
      idEspacioParqueadero: item.idEspacioParqueadero as number | undefined
    };
    return (
      <span>
        <ReservaEntryFormUpdate arguments={reservaItem} onReservaUpdated={callData} />
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Reservas">
        <Group>
          <ReservaEntryForm onReservaCreated={callData} />
        </Group>
      </ViewToolbar>
      <Grid items={items}>
        <GridColumn header="Nro" renderer={index} />
        <GridSortColumn path="fecha" header="Fecha" />
        <GridSortColumn path="horaEntrada" header="Hora Entrada" />
        <GridSortColumn path="horaSalida" header="Hora Salida" />
        <GridSortColumn path="nombreCliente" header="Cliente" />
        <GridSortColumn path="codigoEspacio" header="Espacio Parqueadero" />
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}