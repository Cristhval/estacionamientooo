import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, NumberField, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { PlazaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import Plaza from 'Frontend/generated/com/mistletoe/estaciona/base/models/Plaza';
import { useEffect, useState } from 'react';

import { GridSortColumn } from '@vaadin/react-components/GridSortColumn';

export const config: ViewConfig = {
  title: 'Plaza',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 6,
    title: 'Plaza',
  },
};

type PlazaEntryFormProps = {
  onPlazaCreated?: () => void;
};

function PlazaEntryForm(props: PlazaEntryFormProps): JSX.Element {
  const dialogOpened = useSignal(false);

  const codigo = useSignal('');
  const plazasTotales = useSignal<string>('');
  const plazasDisponibles = useSignal<string>('');
  const idParqueadero = useSignal('');
  const estado = useSignal('');

  const createPlaza = async (): Promise<void> => {
    try {
      const plazasTotalesNum = parseInt(plazasTotales.value || '0');
      const plazasDisponiblesNum = parseInt(plazasDisponibles.value || '0');
      const idParqueaderoNum = parseInt(idParqueadero.value || '0');

      await PlazaService.createPlaza(
        codigo.value,
        plazasTotalesNum,
        plazasDisponiblesNum,
        idParqueaderoNum,
        estado.value
      );
      if (props.onPlazaCreated) {
        props.onPlazaCreated();
      }
      codigo.value = '';
      plazasTotales.value = '';
      plazasDisponibles.value = '';
      idParqueadero.value = '';
      estado.value = '';
      dialogOpened.value = false;
      Notification.show('Plaza creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al crear la plaza', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  const listaParqueaderos = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    PlazaService.listParqueaderoCombo().then(data => {
      listaParqueaderos.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaEstados = useSignal<string[]>([]);
  useEffect(() => {
    PlazaService.listEstadoPlaza().then(data =>
      listaEstados.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nueva Plaza"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={createPlaza} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Codigo de Plaza"
            placeholder="Ingrese el codigo de la plaza"
            aria-label="Codigo de Plaza"
            value={codigo.value}
            onValueChanged={(evt) => (codigo.value = evt.detail.value)}
          />
          <NumberField label="Plazas Totales"
            placeholder="Ingrese el total de plazas"
            aria-label="Plazas Totales"
            value={plazasTotales.value}
            onValueChanged={(evt) => (plazasTotales.value = evt.detail.value)}
          />
          <NumberField label="Plazas Disponibles"
            placeholder="Ingrese las plazas disponibles"
            aria-label="Plazas Disponibles"
            value={plazasDisponibles.value}
            onValueChanged={(evt) => (plazasDisponibles.value = evt.detail.value)}
          />
          <ComboBox label="Parqueadero"
            items={listaParqueaderos.value}
            placeholder='Seleccione un Parqueadero'
            itemLabelPath="label"
            itemValuePath="value"
            value={idParqueadero.value}
            onValueChanged={(evt) => (idParqueadero.value = evt.detail.value)}
          />
          <ComboBox label="Estado"
            items={listaEstados.value}
            placeholder='Seleccione un Estado'
            value={estado.value}
            onValueChanged={(evt) => (estado.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => dialogOpened.value = true}>
        Agregar
      </Button>
    </>
  );
}

type PlazaEntryFormUpdateProps = {
  arguments: Plaza;
  onPlazaUpdated?: () => void;
};

function PlazaEntryFormUpdate(props: PlazaEntryFormUpdateProps): JSX.Element {
  const dialogOpened = useSignal(false);

  const codigo = useSignal(props.arguments.codigo ?? '');
  const plazasTotales = useSignal<string>(props.arguments.plazasTotales?.toString() ?? '');
  const plazasDisponibles = useSignal<string>(props.arguments.plazasDisponibles?.toString() ?? '');
  const idParqueadero = useSignal<string>(props.arguments.idParqueadero?.toString() ?? '');
  const estado = useSignal<string>(props.arguments.estado?.toString() ?? '');
  const id = useSignal(props.arguments.id);

  useEffect(() => {
    codigo.value = props.arguments.codigo ?? '';
    plazasTotales.value = props.arguments.plazasTotales?.toString() ?? '';
    plazasDisponibles.value = props.arguments.plazasDisponibles?.toString() ?? '';
    idParqueadero.value = props.arguments.idParqueadero?.toString() ?? '';
    estado.value = props.arguments.estado?.toString() ?? '';
    id.value = props.arguments.id;
  }, [props.arguments]);

  const listaParqueaderos = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    PlazaService.listParqueaderoCombo().then(data => {
      listaParqueaderos.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaEstados = useSignal<string[]>([]);
  useEffect(() => {
    PlazaService.listEstadoPlaza().then(data =>
      listaEstados.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);

  const updatePlaza = async (): Promise<void> => {
    try {
      const plazasTotalesNum = parseInt(plazasTotales.value || '0');
      const plazasDisponiblesNum = parseInt(plazasDisponibles.value || '0');
      const idParqueaderoNum = parseInt(idParqueadero.value || '0');

      if (
        (codigo.value ?? '').trim().length === 0 ||
        plazasTotalesNum <= 0 ||
        plazasDisponiblesNum < 0 ||
        idParqueaderoNum <= 0 ||
        (estado.value ?? '').trim().length === 0 ||
        id.value === undefined || id.value === null || id.value <= 0
      ) {
        Notification.show('No se pudo actualizar: faltan datos o ID invalido', { duration: 5000, position: 'top-center', theme: 'error' });
        return;
      }

      await PlazaService.updatePlaza(
        id.value,
        codigo.value,
        plazasTotalesNum,
        plazasDisponiblesNum,
        idParqueaderoNum,
        estado.value
      );
      if (props.onPlazaUpdated) {
        props.onPlazaUpdated();
      }
      dialogOpened.value = false;
      Notification.show('Plaza actualizada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al actualizar la plaza', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Plaza"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button onClick={updatePlaza} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Codigo de Plaza"
            placeholder="Ingrese el codigo de la plaza"
            aria-label="Codigo de Plaza"
            value={codigo.value}
            onValueChanged={(evt) => (codigo.value = evt.detail.value)}
          />
          <NumberField label="Plazas Totales"
            placeholder="Ingrese el total de plazas"
            aria-label="Plazas Totales"
            value={plazasTotales.value}
            onValueChanged={(evt) => (plazasTotales.value = evt.detail.value)}
          />
          <NumberField label="Plazas Disponibles"
            placeholder="Ingrese las plazas disponibles"
            aria-label="Plazas Disponibles"
            value={plazasDisponibles.value}
            onValueChanged={(evt) => (plazasDisponibles.value = evt.detail.value)}
          />
          <ComboBox label="Parqueadero"
            items={listaParqueaderos.value}
            placeholder='Seleccione un Parqueadero'
            itemLabelPath="label"
            itemValuePath="value"
            value={idParqueadero.value}
            onValueChanged={(evt) => (idParqueadero.value = evt.detail.value)}
          />
          <ComboBox label="Estado"
            items={listaEstados.value}
            placeholder='Seleccione un Estado'
            value={estado.value}
            onValueChanged={(evt) => (estado.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => dialogOpened.value = true}>
        Editar
      </Button>
    </>
  );
}

export default function PlazaView() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  const callData = async (): Promise<void> => {
    try {
      const data = await PlazaService.listPlazaConNombres();
      setItems((data ?? []).filter((item) => item !== undefined));
    } catch (error) {
      console.error("Error al cargar datos de plazas:", error);
      handleError(error);
      Notification.show('Error al cargar la lista de plazas', { duration: 5000, position: 'top-center', theme: 'error' });
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
    const plazaItem: Plaza = {
      id: item.id as number | undefined,
      codigo: item.codigo as string | undefined,
      plazasTotales: item.plazasTotales as number | undefined,
      plazasDisponibles: item.plazasDisponibles as number | undefined,
      idParqueadero: item.idParqueadero as number | undefined,
      estado: item.estado as any
    };
    return (
      <span>
        <PlazaEntryFormUpdate arguments={plazaItem} onPlazaUpdated={callData} />
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Plazas">
        <Group>
          <PlazaEntryForm onPlazaCreated={callData} />
        </Group>
      </ViewToolbar>
      <Grid items={items}>
        <GridColumn header="Nro" renderer={index} />
        <GridSortColumn path="codigo" header="Codigo de Plaza" />
        <GridSortColumn path="plazasTotales" header="Plazas Totales" />
        <GridSortColumn path="plazasDisponibles" header="Plazas Disponibles" />
        <GridSortColumn path="nombreParqueadero" header="Parqueadero" />
        <GridSortColumn path="estado" header="Estado" />
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}