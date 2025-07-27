import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, GridSortColumn, NumberField, TextField, VerticalLayout,HorizontalLayout,Icon, Select } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import {PersonaService, VehiculoService, TaskService, TicketService} from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Vehiculo from 'Frontend/generated/com/mistletoe/estaciona/base/models/Vehiculo';
import { useCallback, useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Vehiculo',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Vehiculo',
  },
};


type VehiculoEntryFormProps = {
  onVehiculoCreated?: () => void;
};

type VehiculoEntryFormPropsUpdate = ()=> {
  onVehiculoUpdated?: () => void;
};

//GUARDAR Vehiculo
function VehiculoEntryForm(props: VehiculoEntryFormProps) {
  const placa = useSignal('');
  const marca = useSignal('');
  const modelo = useSignal('');
  const color = useSignal('');
  const persona = useSignal('');
  const createVehiculo = async () => {
    try {
      if (placa.value.trim().length > 0 && marca.value.trim().length > 0
      && modelo.value.trim().length > 0&& color.value.trim().length > 0) {
        const id_persona = parseInt(persona.value) +1;
        await VehiculoService.createVehiculo(placa.value, marca.value, modelo.value, color.value, id_persona);
        if (props.onVehiculoCreated) {
          props.onVehiculoCreated();
        }

        placa.value = '';
        marca.value = '';
        modelo.value = '';
        color.value = '';
        persona.value = '';
        dialogOpened.value = false;
        Notification.show('Vehiculo creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  let listaPersona = useSignal<String[]>([]);
  useEffect(() => {
    VehiculoService.listaAlbumPersona().then(data =>
      //console.log(data)
      listaPersona.value = data
    );
  }, []);


  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo vehiculo"
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
            <Button onClick={createVehiculo} theme="primary">
              Registrar
            </Button>

          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Placa del vehiculo"
            placeholder="Ingrese la placa del vehiculo"
            aria-label="placa del vehiculo"
            value={placa.value}
            onValueChanged={(evt) => (placa.value = evt.detail.value)}
          />
          <ComboBox label="Persona"
            items={listaPersona.value}
            placeholder='Seleccione una persona'
            aria-label='Seleccione una persona de la lista'
            value={persona.value}
            onValueChanged={(evt) => (persona.value = evt.detail.value)}
            />

          <TextField label="Marca del vehiculo"
            placeholder="Ingrese la marca del vehiculo"
            aria-label="Nombre de la marca del vehiculo"
            value={marca.value}
            onValueChanged={(evt) => (marca.value = evt.detail.value)}
          />
          <TextField label="Modelo del vehiculo"
            placeholder="Ingrese el modelo del vehiculo"
            aria-label="Nombre del modelo del vehiculo"
            value={modelo.value}
            onValueChanged={(evt) => (modelo.value = evt.detail.value)}
          />
          <TextField label="Color del vehiculo"
            placeholder="Ingrese el color del vehiculo"
            aria-label="Color del vehiculo"
            value={color.value}
            onValueChanged={(evt) => (color.value = evt.detail.value)}
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
const VehiculoEntryFormUpdate = function(props: VehiculoEntryFormPropsUpdate){
  const dialogOpened = useSignal(false);

    const listaPersona = useSignal<String[]>([]);

    const placa = useSignal(props.arguments.placa);
    const persona = useSignal(props.arguments.persona);
    const marca = useSignal(props.arguments.marca);
    const modelo = useSignal(props.arguments.modelo);
    const color = useSignal(props.arguments.color);

    useEffect(() => {
        VehiculoService.listaAlbumPersona().then(data => listaPersona.value = data);
      }, []);
  const updateVehiculo = async () => {
      try {
        if (placa.value.trim().length > 0 && marca.value.trim().length > 0
            && modelo.value.trim().length > 0&& color.value.trim().length > 0) {
        const id_persona = parseInt(persona.value) + 1;
        await VehiculoService.updateVehiculo(props.arguments.id,placa.value,modelo.value,marca.value,color.value,id_persona);
        if (props.arguments.onVehiculoUpdated) {
            props.arguments.onVehiculoUpdated();
        }

        placa.value = '';
        modelo.value = '';
        marca.value = '';
        persona.value = '';
        color.value = '';
        dialogOpened.value = false;
        Notification.show('Vehiculo actualizado', { duration: 5000, position: 'bottom-end', theme: 'success' });
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
        headerTitle="Actualizar Vehiculo"
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
            <Button onClick={updateVehiculo} theme="primary">
              Registrar
            </Button>

          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Placa del vehiculo"
            placeholder="Ingrese la placa del vehiculo"
            aria-label="placa del vehiculo"
            value={placa.value}
            onValueChanged={(evt) => (placa.value = evt.detail.value)}
          />

          <ComboBox label="Persona"
            items={listaPersona.value}
            placeholder='Seleccione una persona'
            aria-label='Seleccione una persona de la lista'
            value={persona.value}
            defaultValue={persona.value}
            onValueChanged={(evt) => (persona.value = evt.detail.value)}
            />

            <TextField
              label="Modelo"
              value={modelo.value}
              onValueChanged={(evt) => (modelo.value = evt.detail.value)}
            />
            <TextField
            label="Marca"
            value={marca.value}
            onValueChanged={(evt) => (marca.value = evt.detail.value)}
            />
            <TextField
             label="Color"
             value={color.value}
             onValueChanged={(evt) => (color.value = evt.detail.value)}
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
export default function VehiculoView() {

//   const dataProvider = useDataProvider<Cancion>({
//     list: () => CancionService.listCancion(),
//   });

const [items, setItems] = useState([]);
  useEffect(() => {
    VehiculoService.listVehiculo().then(function (data) {
      //items.values = data;
      setItems(data);
    });
  }, []);

    const deleteVehiculo = (id) => {
        VehiculoService.deleteVehiculo(id);

    };


const order = (event, columnId) => {
    console.log(event);
    const direction = event.detail.value;
    // Custom logic based on the sorting direction
    console.log(`Sort direction changed for column ${columnId} to ${direction}`);

    var dir = (direction == 'asc') ? 1 : 2;
    VehiculoService.order(columnId, dir).then(function (data) {
      setItems(data);
    });
  }

 //BUSQUEDA BINARIA-------------------------------------------------------------------------------------
  const criterio = useSignal('');
  const texto = useSignal('');
  const itemSelect = [
    {
      label: 'Placa',
      value: 'placa',
    },
    {
      label: 'Persona',
      value: 'persona',
    },
    {
        label: 'Modelo',
        value: 'modelo',
    },
    {
        label: 'Marca',
        value: 'marca',
    },
    {
        label: 'Color',
        value: 'color',
    },
  ];
  const search = async () => {
    try {
      console.log(criterio.value+" "+texto.value);
      VehiculoService.search(criterio.value, texto.value, 0).then(function (data) {
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
  function indexLink({ item}: { item: Vehiculo }) {

    return (
      <span>
        <VehiculoEntryFormUpdate arguments={item} onVehiculoUpdated={items.refresh}>

          </VehiculoEntryFormUpdate>

          <Button onClick  ={()=>deleteVehiculo(item.id)}  >  BORRAR</Button>
      </span>
    );
  }

  function indexIndex({model}:{model:GridItemModel<Vehiculo>}) {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  return (

    <main className="w-full h-full flex flex-col box-border gap-s p-m">

      <ViewToolbar title="Lista de Vehiculos">
        <Group>
          <VehiculoEntryForm onVehiculoCreated={items.refresh}/>
        </Group>
      </ViewToolbar>

       <HorizontalLayout theme="spacing">
                    <Select items={itemSelect}
                      value={criterio.value}
                      onValueChanged={(evt) => (criterio.value = evt.detail.value)}
                      placeholder="Selecione un cirterio">
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

      <Grid items={items}>
        <GridSortColumn path="placa" header="Placa" onDirectionChanged={(e) => order(e, "placa")} />
        <GridSortColumn path="persona" header="Persona" onDirectionChanged={(e) => order(e, "persona")} />
        <GridSortColumn path="modelo" header="Modelo" onDirectionChanged={(e) => order(e, "modelo")} ></GridSortColumn>
        <GridSortColumn path="marca" header="Marca" onDirectionChanged={(e) => order(e, "marca")}  />
        <GridSortColumn path="color" header="Color" onDirectionChanged={(e) => order(e, "color")}  />


        <GridColumn header="Acciones" renderer={indexLink}/>
      </Grid>
    </main>
  );
}
