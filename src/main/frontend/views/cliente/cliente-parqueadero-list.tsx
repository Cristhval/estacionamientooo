import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button,
  Dialog,
  Grid,
  GridColumn,
  GridItemModel,
  TextField,
  VerticalLayout,
  Notification,
  DatePicker,
  TimePicker,
  Select,
} from '@vaadin/react-components';
import { ParqueaderoService, ReservaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import Parqueadero from 'Frontend/generated/com/mistletoe/estaciona/base/models/Parqueadero';
import { useEffect, useState } from 'react';
import { GridSortColumn } from '@vaadin/react-components/GridSortColumn';
import { useAuth } from 'Frontend/security/auth';

export const config: ViewConfig = {
  title: 'Parqueadero',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 5,
    title: 'Parqueadero',
  },
};

// ----------- Formulario para crear Parqueaderos -----------
type ParqueaderoEntryFormProps = {
  onParqueaderoCreated?: () => void;
};

function ParqueaderoEntryForm(props: ParqueaderoEntryFormProps) {
  const dialogOpened = useSignal(false);

  const nombre = useSignal('');
  const direccion = useSignal('');

  const createParqueadero = async () => {
    try {
      if ((nombre.value ?? '').trim().length === 0 || (direccion.value ?? '').trim().length === 0) {
        Notification.show('No se pudo crear: faltan datos obligatorios', { duration: 5000, position: 'top-center', theme: 'error' });
        return;
      }
      await ParqueaderoService.createParqueadero(nombre.value, direccion.value);
      if (props.onParqueaderoCreated) {
        props.onParqueaderoCreated();
      }
      nombre.value = '';
      direccion.value = '';
      dialogOpened.value = false;
      Notification.show('Parqueadero creado exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al crear el parqueadero', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo Parqueadero"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createParqueadero} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField
            label="Nombre del Parqueadero"
            placeholder="Ingrese el nombre del parqueadero"
            aria-label="Nombre del Parqueadero"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <TextField
            label="Direccion del Parqueadero"
            placeholder="Ingrese la direccion del parqueadero"
            aria-label="Direccion del Parqueadero"
            value={direccion.value}
            onValueChanged={(evt) => (direccion.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
    </>
  );
}

// ----------- Formulario para crear Reserva -----------
type ReservaEntryFormProps = {
  parqueadero: Parqueadero;
};

function ReservaEntryForm({ parqueadero }: ReservaEntryFormProps) {
  const dialogOpened = useSignal(false);

  const [clientes, setClientes] = useState<{ value: string; label: string }[]>([]);
  const [plazas, setPlazas] = useState<{ value: string; label: string }[]>([]);
  const [cliente, setCliente] = useState<string | null>(null);
  const [plaza, setPlaza] = useState<string | null>(null);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaEntrada, setHoraEntrada] = useState<string | null>(null);
  const [horaSalida, setHoraSalida] = useState<string | null>(null);

  useEffect(() => {
    if (dialogOpened.value) {
      ReservaService.listaAlbumClientes().then(setClientes);
      ReservaService.listaAlbumPlazas().then(setPlazas);
    }
  }, [dialogOpened.value]);

  const createReserva = async () => {
    if (!fecha || !horaEntrada || !horaSalida || !cliente || !plaza) {
      Notification.show('Completa todos los campos', { duration: 3000, position: 'top-center', theme: 'error' });
      return;
    }

    const [hE, mE] = horaEntrada.split(':').map(Number);
    const [hS, mS] = horaSalida.split(':').map(Number);

    const entradaDate = new Date(fecha);
    entradaDate.setHours(hE, mE);

    const salidaDate = new Date(fecha);
    salidaDate.setHours(hS, mS);

    try {
      await ReservaService.createReserva(
        fecha,
        entradaDate.toISOString(),
        salidaDate.toISOString(),
        parseInt(cliente),
        parseInt(plaza)
      );

      Notification.show('Reserva creada correctamente', { duration: 3000, position: 'bottom-end', theme: 'success' });
      dialogOpened.value = false;
    } catch (error) {
      console.error(error);
      Notification.show('Error al crear la reserva', { duration: 3000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        headerTitle={`Crear reserva para ${parqueadero.nombre}`}
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => (dialogOpened.value = detail.value)}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button theme="primary" onClick={createReserva}>
              Guardar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ width: '20rem', gap: 'var(--lumo-space-m)' }}>
          <Select label="Cliente al que reservar" items={clientes} onValueChanged={(e) => setCliente(e.detail.value)} />
          <Select label="Plaza" items={plazas} onValueChanged={(e) => setPlaza(e.detail.value)} />
          <DatePicker label="Fecha" onValueChanged={(e) => setFecha(new Date(e.detail.value))} />
          <TimePicker label="Hora Entrada" onValueChanged={(e) => setHoraEntrada(e.detail.value)} />
          <TimePicker label="Hora Salida" onValueChanged={(e) => setHoraSalida(e.detail.value)} />
        </VerticalLayout>
      </Dialog>

      <Button onClick={() => (dialogOpened.value = true)}>Crear Reserva</Button>
    </>
  );
}

// ----------- Vista Principal de Parqueaderos -----------
export default function ParqueaderoView() {
  const [items, setItems] = useState<Parqueadero[]>([]);
  const { logout } = useAuth();

  const callData = async (): Promise<void> => {
    try {
      const data = await ParqueaderoService.listAll();
      setItems((data ?? []).filter((item): item is Parqueadero => item !== undefined));
    } catch (error) {
      console.error('Error al cargar datos de parqueaderos:', error);
      handleError(error);
      Notification.show('Error al cargar la lista de parqueaderos', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  useEffect(() => {
    callData();
  }, []);

  function index({ model }: { model: GridItemModel<Parqueadero> }) {
    return <span>{model.index + 1}</span>;
  }

  function link({ item }: { item: Parqueadero }) {
    return (
      <span>
        <ReservaEntryForm parqueadero={item} />
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Parqueaderos">
        <Group>
          <ParqueaderoEntryForm onParqueaderoCreated={callData} />
          {/* Botón de cerrar sesión */}
          <Button
            theme="error"
            onClick={async () => {
              await logout();
              window.location.href = '/login'; // redirige al login
            }}
          >
            Cerrar sesión
          </Button>
        </Group>
      </ViewToolbar>
      <Grid items={items}>
        <GridColumn header="Nro" renderer={index} />
        <GridSortColumn path="nombre" header="Nombre del Parqueadero" />
        <GridSortColumn path="direccion" header="Direccion" />
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}
