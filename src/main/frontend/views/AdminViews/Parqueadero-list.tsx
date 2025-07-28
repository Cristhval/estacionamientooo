import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button, ComboBox, Dialog, Grid, GridColumn, GridSortColumn, TextField,
  VerticalLayout, HorizontalLayout, Icon
} from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification.js';
import { ParqueaderoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import Parqueadero from 'Frontend/generated/com/mistletoe/estaciona/base/models/Parqueadero';
import handleError from 'Frontend/views/_ErrorHandler';
import { ConfirmDialog } from '@vaadin/react-components/ConfirmDialog';
import { useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Parqueadero',
  menu: {
    icon: 'vaadin:clipboard-check',
    title: 'Parqueadero',
    order: 5,
  },
};

export default function ParqueaderoView() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [formValues, setFormValues] = useState({
    id: 0,
    nombre: '',
    direccion: '',
  });

  const searchCriteria = useSignal('');
  const searchText = useSignal('');
  const deleteConfirmationDialogOpened = useSignal(false);
  const parqueaderoToDelete = useSignal<Parqueadero | null>(null);

  const searchOptions = [
    { label: 'ID', value: 'id' },
    { label: 'Nombre', value: 'nombre' },
    { label: 'Dirección', value: 'direccion' },
  ];

  const resetForm = () => setFormValues({ id: 0, nombre: '', direccion: '' });

  const callData = async (criteria: string | null = null, text: string | null = null): Promise<void> => {
    try {
      const all = await ParqueaderoService.listAll();
      const data = (all ?? [])
        .filter((item): item is Parqueadero => !!item)
        .map(item => ({
          id: item.id ?? 0,
          nombre: item.nombre ?? '',
          direccion: item.direccion ?? '',
        }))
        .filter(item => {
          if (!criteria || !text) return true;
          const value = item[criteria as keyof typeof item];
          return value?.toString().toLowerCase().includes(text.toLowerCase());
        });
      setItems(data);
    } catch (error) {
      handleError(error);
      Notification.show('Error al cargar parqueaderos', {
        duration: 5000,
        position: 'top-center',
        theme: 'error',
      });
    }
  };

  useEffect(() => {
    callData();
  }, []);

  const handleSave = async () => {
    try {
      const { id, nombre, direccion } = formValues;

      if (!nombre.trim() || !direccion.trim()) {
        Notification.show('Campos obligatorios', { theme: 'error' });
        return;
      }

      if (id > 0) {
        await ParqueaderoService.update(id, nombre, direccion);
        Notification.show('Parqueadero actualizado', { theme: 'success' });
      } else {
        await ParqueaderoService.create(nombre, direccion);
        Notification.show('Parqueadero creado', { theme: 'success' });
      }

      setEditDialogOpened(false);
      resetForm();
      callData(searchCriteria.value, searchText.value);
    } catch (error) {
      handleError(error);
    }
  };

  const confirmDelete = (item: Parqueadero) => {
    parqueaderoToDelete.value = item;
    deleteConfirmationDialogOpened.value = true;
  };

  const handleDelete = async () => {
    const id = parqueaderoToDelete.value?.id;
    if (!id) return;
    try {
      await ParqueaderoService.delete(id);
      Notification.show('Parqueadero eliminado', { theme: 'success' });
      deleteConfirmationDialogOpened.value = false;
      parqueaderoToDelete.value = null;
      callData(searchCriteria.value, searchText.value);
    } catch (error) {
      handleError(error);
    }
  };

  const renderActions = ({ item }: { item: Record<string, unknown> }) => {
    const id = item.id as number;
    return (
      <div key={`parqueadero-${id}`} style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          onClick={() => {
            const newValues = {
              id,
              nombre: item.nombre as string,
              direccion: item.direccion as string,
            };
            setFormValues(newValues);
            setEditDialogOpened(true);
          }}
        >Editar</Button>
        <Button theme="error" onClick={() => confirmDelete(item as Parqueadero)}>Eliminar</Button>
      </div>
    );
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Parqueaderos">
        <Group>
          <Button onClick={() => {
            resetForm();
            setEditDialogOpened(true);
          }}>Agregar</Button>
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
        <GridSortColumn path="nombre" header="Nombre" />
        <GridSortColumn path="direccion" header="Dirección" />
        <GridColumn header="Acciones" renderer={renderActions} />
      </Grid>

      <Dialog
        headerTitle={formValues.id > 0 ? 'Editar Parqueadero' : 'Nuevo Parqueadero'}
        opened={editDialogOpened}
        onOpenedChanged={({ detail }) => setEditDialogOpened(detail.value)}
        footer={
          <>
            <Button onClick={() => {
              setEditDialogOpened(false);
              resetForm();
            }}>Cancelar</Button>
            <Button theme="primary" onClick={handleSave}>
              {formValues.id > 0 ? 'Actualizar' : 'Registrar'}
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '20rem' }}>
          <TextField
            label="Nombre"
            value={formValues.nombre}
            onValueChanged={({ detail }) => setFormValues({ ...formValues, nombre: detail.value })}
          />
          <TextField
            label="Dirección"
            value={formValues.direccion}
            onValueChanged={({ detail }) => setFormValues({ ...formValues, direccion: detail.value })}
          />
        </VerticalLayout>
      </Dialog>

      <ConfirmDialog
        header={`Eliminar Parqueadero`}
        confirmTheme="error primary"
        confirmText="Eliminar"
        cancelText="Cancelar"
        opened={deleteConfirmationDialogOpened.value}
        onConfirm={handleDelete}
        onCancel={() => {
          deleteConfirmationDialogOpened.value = false;
          parqueaderoToDelete.value = null;
        }}
      >
        ¿Estás seguro de que quieres eliminar el parqueadero <b>{parqueaderoToDelete.value?.nombre}</b>?
      </ConfirmDialog>
    </main>
  );
}
