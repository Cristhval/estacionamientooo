import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, Notification,
  VerticalLayout, TextField, HorizontalLayout, Icon, ConfirmDialog
} from '@vaadin/react-components';
import { useSignal } from '@vaadin/hilla-react-signals';
import { useEffect, useState } from 'react';
import { ReservaService } from 'Frontend/generated/endpoints';
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

export default function ReservaView() {
  const [items, setItems] = useState<any[]>([]);
  const [deleteDialogOpened, setDeleteDialogOpened] = useState(false);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [reservaToDelete, setReservaToDelete] = useState<any | null>(null);
  const [reservaToEdit, setReservaToEdit] = useState<any | null>(null);

  const searchCriteria = useSignal<string>('');
  const searchText = useSignal<string>('');

  const [listaClientes, setListaClientes] = useState<{ label: string, value: string }[]>([]);
  const [listaPlazas, setListaPlazas] = useState<{ label: string, value: string }[]>([]);

  const searchOptions = [
    { label: 'ID', value: 'id' },
    { label: 'Cliente', value: 'cliente' },
    { label: 'Plaza', value: 'plaza' },
    { label: 'Fecha', value: 'fecha' },
  ];

  const callData = async (criteria?: string, text?: string) => {
    try {
      const data = await ReservaService.search(criteria || '', text || '');
      setItems(data ?? []);
    } catch (err) {
      handleError(err);
    }
  };

 useEffect(() => {
  const fetchData = async () => {
    try {
      const clientes = await ReservaService.listaAlbumClientes();
      const plazas = await ReservaService.listaAlbumPlazas();

      setListaClientes((clientes ?? []).map((c: any) => ({
        label: c.label ?? c.nombre ?? `Cliente ${c.id}`,
        value: String(c.value ?? c.id),
      })));

      setListaPlazas((plazas ?? []).map((p: any) => ({
        label: p.label ?? p.codigo ?? `Plaza ${p.id}`,
        value: String(p.value ?? p.id),
      })));
    } catch (error) {
      console.error("Error al cargar clientes o plazas", error);
    }
  };

  fetchData();
  callData(); 
}, []);

  const handleDelete = async () => {
    try {
      await ReservaService.deleteReserva(reservaToDelete.id);
      Notification.show('Reserva eliminada', { theme: 'success' });
      setDeleteDialogOpened(false);
      setReservaToDelete(null);
      callData(searchCriteria.value, searchText.value);
    } catch (err) {
      handleError(err);
    }
  };

  const confirmDelete = (item: any) => {
    setReservaToDelete(item);
    setDeleteDialogOpened(true);
  };

  const [formOpened, setFormOpened] = useState(false);
  const [formData, setFormData] = useState<any>({ fecha: '', horaEntrada: '', horaSalida: '', cliente: '', plaza: '' });

  const handleFormSubmit = async () => {
    try {
      const fechaParsed = new Date(formData.fecha);
      const [hEnt, mEnt] = formData.horaEntrada.split(":").map(Number);
      const [hSal, mSal] = formData.horaSalida.split(":").map(Number);

      const horaEntradaDate = new Date(fechaParsed);
      horaEntradaDate.setHours(hEnt, mEnt, 0, 0);

      const horaSalidaDate = new Date(fechaParsed);
      horaSalidaDate.setHours(hSal, mSal, 0, 0);

      await ReservaService.createReserva(
        fechaParsed.toISOString(),
        horaEntradaDate.toISOString(),
        horaSalidaDate.toISOString(),
        parseInt(formData.cliente),
        parseInt(formData.plaza)
      );

      Notification.show('Reserva creada correctamente', { theme: 'success' });
      setFormOpened(false);
      setFormData({ fecha: '', horaEntrada: '', horaSalida: '', cliente: '', plaza: '' });
      callData();
    } catch (error) {
      handleError(error);
    }
  };

  const handleEdit = (item: any) => {
    setReservaToEdit(item);
    setEditDialogOpened(true);
  };

  const handleEditSave = async () => {
    try {
      if (!reservaToEdit) return;

      const fechaParsed = new Date(reservaToEdit.fecha as string);
      const [hEnt, mEnt] = (reservaToEdit.horaEntrada as string).split(":").map(Number);
      const [hSal, mSal] = (reservaToEdit.horaSalida as string).split(":").map(Number);

      const horaEntradaDate = new Date(fechaParsed);
      horaEntradaDate.setHours(hEnt, mEnt, 0, 0);

      const horaSalidaDate = new Date(fechaParsed);
      horaSalidaDate.setHours(hSal, mSal, 0, 0);

      await ReservaService.updateReserva(
        parseInt(reservaToEdit.id),
        fechaParsed.toISOString(),
        horaEntradaDate.toISOString(),
        horaSalidaDate.toISOString(),
        parseInt(reservaToEdit.id_cliente),
        parseInt(reservaToEdit.id_plaza)
      );

      Notification.show('Reserva actualizada correctamente', { theme: 'success' });
      setEditDialogOpened(false);
      setReservaToEdit(null);
      callData();
    } catch (error) {
      handleError(error);
    }
  };

  const renderActions = ({ item }: { item: any }) => {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
        <Button onClick={() => handleEdit(item)} theme="primary" style={{ minWidth: 'auto' }}>Editar</Button>
        <Button onClick={() => confirmDelete(item)} theme="error" style={{ minWidth: 'auto' }}>Eliminar</Button>
      </div>
    );
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Reservas">
        <Group>
          <Button onClick={() => setFormOpened(true)}>Agregar</Button>
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
        <GridColumn path="fecha" header="Fecha" />
        <GridColumn path="horaEntrada" header="Hora Entrada" />
        <GridColumn path="horaSalida" header="Hora Salida" />
        <GridColumn path="cliente" header="Cliente" />
        <GridColumn path="plaza" header="Plaza" />
        <GridColumn header="Acciones" renderer={renderActions} />
      </Grid>

      <ConfirmDialog
        opened={deleteDialogOpened}
        onOpenedChanged={({ detail }) => setDeleteDialogOpened(detail.value)}
        header="Eliminar Reserva"
        confirmTheme="error primary"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpened(false)}
      >
        ¿Estás seguro de que quieres eliminar la reserva con ID <b>{reservaToDelete?.id}</b>?
      </ConfirmDialog>

      <Dialog headerTitle="Registrar Reserva" opened={formOpened} onOpenedChanged={({ detail }) => setFormOpened(detail.value)}
        footer={<><Button onClick={() => setFormOpened(false)}>Cancelar</Button><Button onClick={handleFormSubmit} theme="primary">Registrar</Button></>}>
        <VerticalLayout style={{ width: '20rem', alignItems: 'stretch' }}>
          <DatePicker label="Fecha" value={formData.fecha} onValueChanged={(e) => setFormData({ ...formData, fecha: e.detail.value })} />
          <label>Hora Entrada</label>
          <input type="time" value={formData.horaEntrada} onChange={(e) => setFormData({ ...formData, horaEntrada: e.target.value })} />
          <label>Hora Salida</label>
          <input type="time" value={formData.horaSalida} onChange={(e) => setFormData({ ...formData, horaSalida: e.target.value })} />
          <ComboBox label="Cliente" items={listaClientes} itemLabelPath="label" itemValuePath="value" value={formData.cliente} onValueChanged={(e) => setFormData({ ...formData, cliente: e.detail.value })} />
          <ComboBox label="Plaza" items={listaPlazas} itemLabelPath="label" itemValuePath="value" value={formData.plaza} onValueChanged={(e) => setFormData({ ...formData, plaza: e.detail.value })} />
        </VerticalLayout>
      </Dialog>

      <Dialog headerTitle="Editar Reserva" opened={editDialogOpened} onOpenedChanged={({ detail }) => setEditDialogOpened(detail.value)}
        footer={<><Button onClick={() => setEditDialogOpened(false)}>Cancelar</Button><Button onClick={handleEditSave} theme="primary">Actualizar</Button></>}>
        {reservaToEdit && (
          <VerticalLayout style={{ width: '20rem', alignItems: 'stretch' }}>
            <DatePicker label="Fecha" value={reservaToEdit.fecha} onValueChanged={(e) => setReservaToEdit({ ...reservaToEdit, fecha: e.detail.value })} />
            <label>Hora Entrada</label>
            <input type="time" value={reservaToEdit.horaEntrada} onChange={(e) => setReservaToEdit({ ...reservaToEdit, horaEntrada: e.target.value })} />
            <label>Hora Salida</label>
            <input type="time" value={reservaToEdit.horaSalida} onChange={(e) => setReservaToEdit({ ...reservaToEdit, horaSalida: e.target.value })} />
            <ComboBox label="Cliente" items={listaClientes} itemLabelPath="label" itemValuePath="value" value={reservaToEdit.id_cliente} onValueChanged={(e) => setReservaToEdit({ ...reservaToEdit, id_cliente: e.detail.value })} />
            <ComboBox label="Plaza" items={listaPlazas} itemLabelPath="label" itemValuePath="value" value={reservaToEdit.id_plaza} onValueChanged={(e) => setReservaToEdit({ ...reservaToEdit, id_plaza: e.detail.value })} />
          </VerticalLayout>
        )}
      </Dialog>
    </main>
  );
}
