import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, GridSortColumn, NumberField, TextField, VerticalLayout,HorizontalLayout,Icon,Select } from '@vaadin/react-components';
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

  const tarifa = useSignal('');
  const vehiculo = useSignal('');
  const parqueadero = useSignal('');
  const estadoTicket = useSignal('');
  const createTicket = async () => {
    try {
      if ( tarifa.value.trim().length > 0 && vehiculo.value.trim().length>0) {
        const id_vehiculo = parseInt(vehiculo.value) +1;
        const id_parqueadero = parseInt(parqueadero.value) +1;
        await TicketService.createTicket( parseFloat(tarifa.value), id_vehiculo, id_parqueadero, estadoTicket.value);
        if (props.onTicketCreated) {
          props.onTicketCreated();
        }


        tarifa.value = '';
        vehiculo.value = '';
        parqueadero.value = '';
        estadoTicket.value = '';
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

let listaEstado = useSignal<String[]>([]);
  useEffect(() => {
    TicketService.listEstadoTicket().then(data =>
      //console.log(data)
      listaEstado.value = data
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

          <NumberField  label="Tarifa"
           placeholder="Ingrese la tarifa por hora"
           aria-label="Tarifa por hora"
           value={tarifa.value}
           onValueChanged={(evt) => (tarifa.value = evt.detail.value)}
          />
          <ComboBox label="Estado"
           items={listaEstado.value}
           placeholder='Seleccione un Estado'
           aria-label='Seleccione un Estado'
           value={estadoTicket.value}
           onValueChanged={(evt) => (estadoTicket.value = evt.detail.value)}
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
    const listaEstado = useSignal<String[]>([]);


    const tarifa = useSignal(props.arguments.tarifa);
    const vehiculo = useSignal(props.arguments.vehiculo);
    const parqueadero = useSignal(props.arguments.parqueadero);
    const estadoTicket = useSignal(props.arguments.estadoTicket);

    useEffect(() => {
        TicketService.listaAlbumVehiculo().then(data => listaVehiculo.value = data);
      }, []);

    useEffect(() => {
        TicketService.listaAlbumParqueadero().then(data => listaParqueadero.value = data);
       }, []);
    useEffect(() => {
        TicketService.listEstadoTicket().then(data => listaEstado.value = data);
       }, []);
  const updateTicket = async () => {
      try {
        if (tarifa.value.trim().length > 0 && vehiculo.value.trim().length>0) {
        const id_vehiculo = parseInt(vehiculo.value) + 1;
        const id_parqueadero = parseInt(parqueadero.value) + 1;
        await TicketService.updateTicket(props.arguments.id,parseFloat(tarifa.value),id_vehiculo, id_parqueadero, estadoTicket.value);
        if (props.arguments.onTicketUpdated) {
            props.arguments.onTicketUpdated();
        }



         tarifa.value = '';
         vehiculo.value = '';
         parqueadero.value = '';
         estadoTicket.value = '';
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

              <ComboBox
                         label="Estado"
                         items={listaEstado.value}
                         placeholder="Seleccione un Estado"
                         value={estadoTicket.value}
                         onValueChanged={(evt) => (estadoTicket.value = evt.detail.value)}
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


//LISTA DE TICKETS
    export default function TicketView() {

        const [items, setItems] = useState<any[]>([]);

        const cargarTickets = () => {
            TicketService.listTicket().then((data) => setItems(data ?? []));
        };

        useEffect(() => { cargarTickets(); }, []);

        const pagarTicket = (id) => {
            TicketService.calculoAPagar(id);
            cargarTickets();
        };

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

//BUSQUEDA BINARIA-------------------------------------------------------------------------------------
  const criterio = useSignal('');
  const texto = useSignal('');
  const itemSelect = [
    {
      label: 'Estado',
      value: 'estadoTicket',
    },
    {
      label: 'Placa',
      value: 'vehiculo',
    },
    {
        label: 'Parqueadero',
        value: 'parqueadero',
    },
    {
        label: 'Tarifa',
        value: 'tarifa',
    },
  ];
const search = async () => {
    try {
      console.log(criterio.value+" "+texto.value);
      TicketService.search(criterio.value, texto.value, 0).then(function (data) {
        setItems(data);
      });

      criterio.value = '';
      texto.value = '';

      Notification.show('Busqueda realizada', { duration: 5000, position: 'bottom-end', theme: 'success' });


    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };


 const deleteTicket = (id) => {
    TicketService.deleteTicket(id);

 };

  function indexLink({ item}: { item: Ticket }) {

    return (
      <span>
        <TicketEntryFormUpdate arguments={item} onVehiculoUpdated={items.refresh}>

          </TicketEntryFormUpdate>
          <Button onClick  ={()=>pagarTicket(item.id)}  >  Pagar </Button>

          <Button onClick  ={()=>deleteTicket(item.id)}  >  BORRAR</Button>
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
          <TicketEntryForm onTicketCreated={cargarTickets}/>
        </Group>
      </ViewToolbar>

     <HorizontalLayout theme="spacing">
                  <Select items={itemSelect}
                    value={criterio.value}
                    onValueChanged={(evt) => (criterio.value = evt.detail.value)}
                    placeholder="Selecione un criterio">
                  </Select>

                  <TextField
                    placeholder="Search"
                    style={{ width: '50%' }}
                    value={texto.value}
                    onValueChanged={(evt) => (texto.value = evt.detail.value)}
                  >
                    <Icon slot="prefix" icon="vaadin:search" />
                  </TextField>
                 <span>
                  <Button onClick={search} theme="primary">
                     BUSCAR
                  </Button>
                 </span>
                </HorizontalLayout>

        <Grid items={items} >
        <GridSortColumn path="horaEntrada" header="Hora de entrada" onDirectionChanged={(e) => order(e, "horaEntrada")} />
        <GridSortColumn path="horaSalida" header="Hora de salida" onDirectionChanged={(e) => order(e, "horaSalida")} />
        <GridSortColumn path="tarifa" header="Tarifa" resizable width ="10px" onDirectionChanged={(e) => order(e, "tarifa")}  ></GridSortColumn>
        <GridSortColumn path="estadoTicket" header="Estado" resizable width ="20px" onDirectionChanged={(e) => order(e, "estadoTicket")}  />
        <GridSortColumn path="totalPagar" header="Total a Pagar" onDirectionChanged={(e) => order(e, "totalPagar")} width="15px" />
        <GridSortColumn path="vehiculo" header="Vehiculo"resizable width ="20px" onDirectionChanged={(e) => order(e, "vehiculo")}  />
         <GridSortColumn path="parqueadero" header="Parqueadero" onDirectionChanged={(e) => order(e, "parqueadero")}  />

        <GridColumn header="Acciones"  resizable width ="200px" renderer={indexLink}/>

      </Grid>
    </main>
  );
}
