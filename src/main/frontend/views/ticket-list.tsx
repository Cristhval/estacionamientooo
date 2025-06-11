import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, GridSortColumn, NumberField, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { PersonaService, VehiculoService, TaskService, TicketService, ParqueaderoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Ticket from 'Frontend/generated/com/mistletoe/estaciona/base/models/Ticket';
import { useCallback, useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Ticket',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Ticket',
  },
};


type TicketEntryFormProps = {
  onTicketCreated?: () => void;
};

type TicketEntryFormPropsUpdate = ()=> {
  onTicketUpdated?: () => void;
};

//GUARDAR Ticket
function TicketEntryForm(props: TicketEntryFormProps) {
  const horaEntrada = useSignal('');
  const horaSalida = useSignal('');
  const tarifa = useSignal('');
  const totalPagar = useSignal('');
  const vehiculo = useSignal('');
  const parqueadero = useSignal('');
  const createTicket = async () => {
    try {
      if (horaEntrada.value.trim().length > 0 && tarifa.value.trim().length > 0 && vehiculo.value.trim().length>0) {
        const id_vehiculo = parseInt(vehiculo.value) +1;
        const id_parqueadero = parseInt(parqueadero.value) +1;
        await TicketService.createTicket(horaEntrada.value, parseFloat(tarifa.value), id_vehiculo, id_parqueadero);
        if (props.onTicketCreated) {
          props.onTicketCreated();
        }

        horaEntrada.value = '';
        tarifa.value = '';
        vehiculo.value = '';
        parqueadero.value = '';
        dialogOpened.value = false;
        Notification.show('Ticket creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  let listaVehiculo = useSignal<String[]>([]);
  useEffect(() => {
    TicketService.listaAlbumVehiculo().then(data =>
      //console.log(data)
      listaVehiculo.value = data
    );
  }, []);

let listaParqueadero = useSignal<String[]>([]);
  useEffect(() => {
    TicketService.listaAlbumParqueadero().then(data =>
      //console.log(data)
      listaParqueadero.value = data
    );
  }, []);

  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo Ticket"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Cancelar
            </Button>
            <Button onClick={createTicket} theme="primary">
              Registrar
            </Button>

          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <DatePicker
           label="Fecha de Entrada"
           placeholder="Seleccione una fecha"
           aria-label="Seleccione una fecha"
           value={horaEntrada.value}
           onValueChanged={(evt) => (horaEntrada.value = evt.detail.value)}
          />
          <NumberField  label="Tarifa"
           placeholder="Ingrese la tarifa por hora"
           aria-label="Tarifa por hora"
           value={tarifa.value}
           onValueChanged={(evt) => (tarifa.value = evt.detail.value)}
          />
          <ComboBox label="Vehiculo"
            items={listaVehiculo.value}
            placeholder='Seleccione un Vehiculo'
            aria-label='Seleccione un Vehiculo de la lista'
            value={vehiculo.value}
            onValueChanged={(evt) => (vehiculo.value = evt.detail.value)}
            />
            <ComboBox label="Parqueadero"
             items={listaParqueadero.value}
             placeholder='Seleccione un Parqueadero'
             aria-label='Seleccione un Parqueadero'
             value={parqueadero.value}
             onValueChanged={(evt) => (parqueadero.value = evt.detail.value)}
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

//GUARDAR ARTISTA
const TicketEntryFormUpdate = function(props: TicketEntryFormPropsUpdate){
  const dialogOpened = useSignal(false);

    const listaVehiculo = useSignal<String[]>([]);
    const listaParqueadero = useSignal<String[]>([]);

    const horaEntrada = useSignal(props.arguments.horaEntrada);
    const horaSalida = useSignal(props.arguments.horaSalida);
    const tarifa = useSignal(props.arguments.tarifa);
    const totalPagar = useSignal(props.arguments.totalPagar);
    const vehiculo = useSignal(props.arguments.vehiculo);
    const parqueadero = useSignal(props.arguments.parqueadero);


    useEffect(() => {
        TicketService.listaAlbumVehiculo().then(data => listaVehiculo.value = data);
      }, []);

    useEffect(() => {
        TicketService.listaAlbumParqueadero().then(data => listaParqueadero.value = data);
       }, []);

  const updateTicket = async () => {
      try {
        if (horaEntrada.value.trim().length > 0 && tarifa.value.trim().length > 0 && vehiculo.value.trim().length>0) {
        const id_vehiculo = parseInt(vehiculo.value) + 1;
        const id_parqueadero = parseInt(parqueadero.value) + 1;
        await TicketService.updateTicket(props.arguments.id,horaEntrada.value,horaSalida.value,parseFloat(tarifa.value),id_persona, id_parqueadero);
        if (props.arguments.onTicketUpdated) {
            props.arguments.onTicketUpdated();
        }


         horaEntrada.value = '';
         horaSalida.value = '';
         tarifa.value = '';
         vehiculo.value = '';
         parqueadero.value = '';
        dialogOpened.value = false;
        Notification.show('Ticket actualizado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };


  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Ticket"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Cancelar
            </Button>
            <Button onClick={updateTicket} theme="primary">
              Registrar
            </Button>

          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>


          <ComboBox label="Parqueadero"
            items={listaParqueadero.value}
            placeholder='Seleccione un parqueadero'
            aria-label='Seleccione un parqueadero'
            value={parqueadero.value}
            defaultValue={parqueadero.value}
            onValueChanged={(evt) => (parqueadero.value = evt.detail.value)}
            />

            <ComboBox label="Vehiculo"
                        items={listaVehiculo.value}
                        placeholder='Seleccione un vehiculo'
                        aria-label='Seleccione un vehiculo'
                        value={vehiculo.value}
                        defaultValue={vehiculo.value}
                        onValueChanged={(evt) => (vehiculo.value = evt.detail.value)}
                        />

             <DatePicker
                       label="Fecha de Entrada"
                       placeholder="Seleccione una fecha"
                       aria-label="Seleccione una fecha"
                       value={horaEntrada.value}
                       onValueChanged={(evt) => (horaEntrada.value = evt.detail.value)}
                      />

              <DatePicker
                        label="Fecha de Salida"
                        placeholder="Seleccione una fecha"
                        aria-label="Seleccione una fecha"
                        value={horaSalida.value}
                        onValueChanged={(evt) => (horaSalida.value = evt.detail.value)}
                       />

                <NumberField  label="Tarifa"
                          placeholder="Ingrese la Tarifa"
                          aria-label="Cantidad de Tarifa por hora"
                          value={tarifa.value}
                          onValueChanged={(evt) => (tarifa.value = evt.detail.value)}
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
};


//LISTA DE ARTISTAS
export default function TicketView() {

//   const dataProvider = useDataProvider<Cancion>({
//     list: () => CancionService.listCancion(),
//   });

const [items, setItems] = useState([]);
  useEffect(() => {
    TicketService.listTicket().then(function (data) {
      //items.values = data;
      setItems(data);
    });
  }, []);


const order = (event, columnId) => {
    console.log(event);
    const direction = event.detail.value;
    // Custom logic based on the sorting direction
    console.log(`Sort direction changed for column ${columnId} to ${direction}`);

    var dir = (direction == 'asc') ? 1 : 2;
    TicketService.order(columnId, dir).then(function (data) {
      setItems(data);
    });
  }


  function indexLink({ item}: { item: Ticket }) {

    return (
      <span>
        <TicketEntryFormUpdate arguments={item} onVehiculoUpdated={items.refresh}>

          </TicketEntryFormUpdate>
          <Button onClick ={()=>TicketService.calculoAPagar(item.id)} > Pagar </Button>
      </span>
    );
  }

  function indexIndex({model}:{model:GridItemModel<Ticket>}) {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  return (

    <main className="w-full h-full flex flex-col box-border gap-s p-m">

      <ViewToolbar title="Lista de Tickets">
        <Group>
          <TicketEntryForm onTicketCreated={items.refresh}/>
        </Group>
      </ViewToolbar>
      <Grid items={items}>
        <GridSortColumn path="horaEntrada" header="Hora de entrada" onDirectionChanged={(e) => order(e, "horaEntrada")} />
        <GridSortColumn path="horaSalida" header="Hora de salida" onDirectionChanged={(e) => order(e, "horaSalida")} />
        <GridSortColumn path="tarifa" header="Tarifa" onDirectionChanged={(e) => order(e, "tarifa")} ></GridSortColumn>
        <GridSortColumn path="totalPagar" header="Total a Pagar" onDirectionChanged={(e) => order(e, "totalPagar")}  />
        <GridSortColumn path="vehiculo" header="Vehiculo" onDirectionChanged={(e) => order(e, "vehiculo")}  />
         <GridSortColumn path="parqueadero" header="Parqueadero" onDirectionChanged={(e) => order(e, "parqueadero")}  />

        <GridColumn header="Acciones" renderer={indexLink}/>

      </Grid>
    </main>
  );
}
