import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ParqueaderoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import Parqueadero from 'Frontend/generated/com/mistletoe/estaciona/base/models/Parqueadero';
import { useEffect, useState } from 'react';

import { GridSortColumn, GridSortColumnDirectionChangedEvent } from '@vaadin/react-components/GridSortColumn';

export const config: ViewConfig = {
  title: 'Parqueadero',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 5,
    title: 'Parqueadero',
  },
};

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
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={createParqueadero} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del Parqueadero"
            placeholder="Ingrese el nombre del parqueadero"
            aria-label="Nombre del Parqueadero"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <TextField label="Direccion del Parqueadero"
            placeholder="Ingrese la direccion del parqueadero"
            aria-label="Direccion del Parqueadero"
            value={direccion.value}
            onValueChanged={(evt) => (direccion.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => dialogOpened.value = true}>
        Agregar
      </Button>
    </>
  );
}

type ParqueaderoEntryFormUpdateProps = {
  arguments: Parqueadero;
  onParqueaderoUpdated?: () => void;
};

function ParqueaderoEntryFormUpdate(props: ParqueaderoEntryFormUpdateProps) {
  const dialogOpened = useSignal(false);

  const nombre = useSignal(props.arguments.nombre ?? '');
  const direccion = useSignal(props.arguments.direccion ?? '');
  const id = useSignal(props.arguments.id);

  useEffect(() => {
    nombre.value = props.arguments.nombre ?? '';
    direccion.value = props.arguments.direccion ?? '';
    id.value = props.arguments.id;
  }, [props.arguments]);

  const updateParqueadero = async () => {
    try {
      if (
        (nombre.value ?? '').trim().length === 0 ||
        (direccion.value ?? '').trim().length === 0 ||
        id.value === undefined ||
        id.value === null ||
        id.value <= 0
      ) {
        Notification.show('No se pudo actualizar: faltan datos o ID invalido', { duration: 5000, position: 'top-center', theme: 'error' });
        return;
      }
      await ParqueaderoService.updateParqueadero(id.value, nombre.value, direccion.value);
      if (props.onParqueaderoUpdated) {
        props.onParqueaderoUpdated();
      }
      dialogOpened.value = false;
      Notification.show('Parqueadero actualizado exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al actualizar el parqueadero', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Parqueadero"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={updateParqueadero} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '300px', maxWidth: '100%' }}>
          <TextField label="Nombre del Parqueadero"
            placeholder="Ingrese el nombre del parqueadero"
            aria-label="Nombre del Parqueadero"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <TextField label="Direccion del Parqueadero"
            placeholder="Ingrese la direccion del parqueadero"
            aria-label="Direccion del Parqueadero"
            value={direccion.value}
            onValueChanged={(evt) => (direccion.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => dialogOpened.value = true}>
        Editar
      </Button>
    </>
  );
}

export default function ParqueaderoView() {
  const [items, setItems] = useState<Parqueadero[]>([]);

  const callData = async (): Promise<void> => {
    try {
      
      const data = await ParqueaderoService.listAll();
      setItems((data ?? []).filter((item): item is Parqueadero => item !== undefined));
    } catch (error) {
      console.error("Error al cargar datos de parqueaderos:", error);
      handleError(error);
      Notification.show('Error al cargar la lista de parqueaderos', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };
      useEffect(() => {
    callData();
  }, []);

  function index({ model }: { model: GridItemModel<Parqueadero> }) {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  function link({ item }: { item: Parqueadero }) {
    return (
      <span>
        <ParqueaderoEntryFormUpdate arguments={item} onParqueaderoUpdated={callData} />
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Parqueaderos">
        <Group>
          <ParqueaderoEntryForm onParqueaderoCreated={callData} />
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