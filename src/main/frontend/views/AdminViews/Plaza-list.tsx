import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, NumberField,
  TextField, VerticalLayout, HorizontalLayout, Icon, Select
} from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { PlazaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import Plaza from 'Frontend/generated/com/mistletoe/estaciona/base/models/Plaza';
import { useEffect, useState } from 'react';

import { GridSortColumn } from '@vaadin/react-components/GridSortColumn';
import { ConfirmDialog } from '@vaadin/react-components/ConfirmDialog';

export const config: ViewConfig = {
  title: 'Plaza',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 6,
    title: 'Plaza',
  },
};

export default function PlazaView() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState<Plaza | null>(null);

  const [listaParqueaderos, setListaParqueaderos] = useState<{ label: string, value: string }[]>([]);
  const [listaEstados, setListaEstados] = useState<string[]>([]);

  const deleteConfirmationDialogOpened = useSignal(false);
  const plazaToDelete = useSignal<Plaza | null>(null);

  const searchCriteria = useSignal<string>('');
  const searchText = useSignal<string>('');

  const searchOptions = [
    { label: 'Código', value: 'codigo' },
    { label: 'Plazas Totales', value: 'plazasTotales' },
    { label: 'Plazas Disponibles', value: 'plazasDisponibles' },
    { label: 'Parqueadero', value: 'nombreParqueadero' },
    { label: 'Estado', value: 'estado' },
    { label: 'ID', value: 'id' },
  ];

  const [formValues, setFormValues] = useState({
    id: 0,
    codigo: '',
    plazasTotales: '',
    plazasDisponibles: '',
    idParqueadero: '',
    estado: '',
  });

  const resetForm = () => setFormValues({ id: 0, codigo: '', plazasTotales: '', plazasDisponibles: '', idParqueadero: '', estado: '' });

  const callData = async (criteria: string | null = null, text: string | null = null): Promise<void> => {
    try {
      const data = await PlazaService.listPlazaConNombresFiltered(
        criteria ?? undefined,
        text ?? undefined
      );
      setItems((data ?? []).filter((item) => item !== undefined));
    } catch (error) {
      handleError(error);
      Notification.show('Error al cargar la lista de plazas', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  useEffect(() => {
    callData();
    PlazaService.listParqueaderoCombo().then(data =>
      setListaParqueaderos(
        (data ?? [])
          .filter((item): item is Record<string, string> => !!item && typeof item.label === 'string' && typeof item.value === 'string')
          .map(item => ({ label: item.label, value: item.value }))
      )
    );
    PlazaService.listEstadoPlaza().then(data => setListaEstados((data ?? []).filter(item => typeof item === 'string')));
  }, []);

  const handleSave = async () => {
    try {
      const { id, codigo, plazasTotales, plazasDisponibles, idParqueadero, estado } = formValues;
      const total = parseInt(plazasTotales);
      const disp = parseInt(plazasDisponibles);
      const parqueadero = parseInt(idParqueadero);

      if (!codigo || isNaN(total) || isNaN(disp) || isNaN(parqueadero) || !estado) {
        Notification.show('Datos incompletos o inválidos', { theme: 'error' });
        return;
      }

      if (id > 0) {
        await PlazaService.updatePlaza(id, codigo, total, disp, parqueadero, estado);
        Notification.show('Plaza actualizada exitosamente', { theme: 'success' });
      } else {
        await PlazaService.createPlaza(codigo, total, disp, parqueadero, estado);
        Notification.show('Plaza creada exitosamente', { theme: 'success' });
      }
      resetForm();
      setEditDialogOpened(false);
      callData(searchCriteria.value, searchText.value);
    } catch (error) {
      handleError(error);
    }
  };

  const confirmDelete = (plaza: Plaza) => {
    plazaToDelete.value = plaza;
    deleteConfirmationDialogOpened.value = true;
  };

  const handleDelete = async () => {
    const id = plazaToDelete.value?.id;
    if (!id) return;
    try {
      await PlazaService.deletePlaza(id);
      Notification.show('Plaza eliminada exitosamente', { theme: 'success' });
      deleteConfirmationDialogOpened.value = false;
      plazaToDelete.value = null;
      setItems([]);
      await callData(searchCriteria.value, searchText.value);
    } catch (error) {
      handleError(error);
    }
  };

  const renderActions = ({ item }: { item: Record<string, unknown> }) => {
    const id = item.id as number;
    return (
      <div key={`plaza-${id}`} style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          onClick={() => {
            setFormValues({
              id,
              codigo: item.codigo as string,
              plazasTotales: item.plazasTotales as string,
              plazasDisponibles: item.plazasDisponibles as string,
              idParqueadero: item.idParqueadero?.toString() ?? '',
              estado: item.estado as string,
            });
            setEditDialogOpened(true);
          }}
        >Editar</Button>
        <Button theme="error" onClick={() => confirmDelete(item as Plaza)}>Eliminar</Button>
      </div>
    );
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Plazas">
        <Group>
          <Button
            onClick={() => {
              resetForm();
              setEditDialogOpened(true);
            }}
          >Agregar</Button>
        </Group>
      </ViewToolbar>

      <HorizontalLayout theme="spacing" style={{ width: '100%', alignItems: 'baseline' }}>
        <ComboBox
          items={searchOptions}
          itemLabelPath="label"
          itemValuePath="value"
          value={searchCriteria.value}
          onValueChanged={({ detail }) => (searchCriteria.value = detail.value ?? '')}
          placeholder="Seleccione un criterio"
          style={{ flexGrow: 1, minWidth: '150px' }}
        />
        <TextField
          placeholder="Buscar"
          value={searchText.value}
          onValueChanged={({ detail }) => (searchText.value = detail.value ?? '')}
          onKeyDown={(e) => e.key === 'Enter' && callData(searchCriteria.value, searchText.value)}
          style={{ flexGrow: 2, minWidth: '200px' }}
        >
          <Icon slot="prefix" icon="vaadin:search" />
        </TextField>
        <Button onClick={() => callData(searchCriteria.value, searchText.value)} theme="primary">
          BUSCAR
        </Button>
      </HorizontalLayout>

      <Grid items={items} itemIdPath="id">
        <GridColumn header="#" renderer={({ model }) => <span>{model.index + 1}</span>} />
        <GridSortColumn path="codigo" header="Codigo de Plaza" />
        <GridSortColumn path="plazasTotales" header="Plazas Totales" />
        <GridSortColumn path="plazasDisponibles" header="Plazas Disponibles" />
        <GridSortColumn path="nombreParqueadero" header="Parqueadero" />
        <GridSortColumn path="estado" header="Estado" />
        <GridColumn header="Acciones" renderer={renderActions} />
      </Grid>

      <Dialog
        headerTitle={formValues.id > 0 ? 'Editar Plaza' : 'Nueva Plaza'}
        opened={editDialogOpened}
        onOpenedChanged={({ detail }) => setEditDialogOpened(detail.value)}
        footer={
          <>
            <Button onClick={() => setEditDialogOpened(false)}>Cancelar</Button>
            <Button onClick={handleSave} theme="primary">
              {formValues.id > 0 ? 'Actualizar' : 'Registrar'}
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '20rem' }}>
          <TextField
            label="Código"
            value={formValues.codigo}
            onValueChanged={(e) => setFormValues({ ...formValues, codigo: e.detail.value })}
          />
          <NumberField
            label="Plazas Totales"
            value={formValues.plazasTotales}
            onValueChanged={(e) => setFormValues({ ...formValues, plazasTotales: e.detail.value })}
          />
          <NumberField
            label="Plazas Disponibles"
            value={formValues.plazasDisponibles}
            onValueChanged={(e) => setFormValues({ ...formValues, plazasDisponibles: e.detail.value })}
          />
          <ComboBox
            label="Parqueadero"
            items={listaParqueaderos}
            itemLabelPath="label"
            itemValuePath="value"
            value={formValues.idParqueadero}
            onValueChanged={(e) => setFormValues({ ...formValues, idParqueadero: e.detail.value })}
          />
          <ComboBox
            label="Estado"
            items={listaEstados}
            value={formValues.estado}
            onValueChanged={(e) => setFormValues({ ...formValues, estado: e.detail.value })}
          />
        </VerticalLayout>
      </Dialog>

      <ConfirmDialog
        opened={deleteConfirmationDialogOpened.value}
        onOpenedChanged={({ detail }) => (deleteConfirmationDialogOpened.value = detail.value)}
        header={`Eliminar Plaza`}
        confirmTheme="error primary"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => {
          deleteConfirmationDialogOpened.value = false;
          plazaToDelete.value = null;
        }}
      >
        ¿Estás seguro de que quieres eliminar la plaza con código <b>{plazaToDelete.value?.codigo}</b>?
      </ConfirmDialog>
    </main>
  );
}
