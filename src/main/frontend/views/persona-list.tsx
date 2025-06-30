import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout, GridSortColumn, HorizontalLayout,Icon,Select } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { PersonaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import Persona from 'Frontend/generated/com/mistletoe/estaciona/base/models/Persona';


import { useDataProvider } from '@vaadin/hilla-react-crud';
import { useCallback, useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Personas',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Persona',
  },
};

type PersonaEntryFormProps = {
  onPersonaCreated?: () => void;
};

type PersonaEntryFormPropsUpdate = ()=> {
  onPersonaUpdated?: () => void;
};

//GUARDAR PERSONAS
function PersonaEntryForm(props: PersonaEntryFormProps) {
  const nombre = useSignal('');
  const apellido = useSignal('');
  const correoElectronico = useSignal('');
  const rol = useSignal('');
  const createPersona = async () => {
    try {
      if (nombre.value.trim().length > 0 && apellido.value.trim().length > 0
       && correoElectronico.value.trim().length > 0)  {
        await PersonaService.createPersona(nombre.value, apellido.value,correoElectronico.value, rol.value);
        if (props.onPersonaCreated) {
          props.onPersonaCreated();
        }
        nombre.value = '';
        apellido.value = '';
        correoElectronico.value = '';
        rol.value = '';
        dialogOpened.value = false;
        Notification.show('Persona creada', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };


let listaRol = useSignal<String[]>([]);
    useEffect(() => {
      PersonaService.listRolPersona().then(data =>
        //console.log(data)
        listaRol.value = data
      );
    }, []);

  const dialogOpened = useSignal(false);

 return (
    <>
      <Dialog
        modeless
        headerTitle="Nueva Persona"
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
              Candelar
            </Button>
            <Button onClick={createPersona} theme="primary">
              Registrar
            </Button>

          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre de la persona"
            placeholder="Ingrese el nombre de la persona"
            aria-label="Nombre de la persona"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <TextField label="Apellido de la persona"
            placeholder="Ingrese el apellido de la persona"
            aria-label="Apellido de la persona"
            value={apellido.value}
            onValueChanged={(evt) => (apellido.value = evt.detail.value)}
          />
          <TextField label="Correo Electronico de la persona"
           placeholder="Ingrese el correo electronico de la persona"
           aria-label="correo electronico de la persona"
           value={correoElectronico.value}
           onValueChanged={(evt) => (correoElectronico.value = evt.detail.value)}
          />

             <ComboBox label="Rol"
             items={listaRol.value}
             placeholder='Seleccione un tipo de archivo'
             aria-label='Seleccione un tipo de archivo de la lista'
             value={rol.value}
             onValueChanged={(evt) => (rol.value = evt.detail.value)}
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


//ACTUALIZAR PERSONAS
const PersonaEntryFormUpdate = function(props: PersonaEntryFormPropsUpdate){
  console.log(props);

  const nombre = useSignal(props.arguments.nombre);
  const apellido = useSignal(props.arguments.apellido);
  const correoElectronico = useSignal(props.arguments.correoElectronico);
  const rol = useSignal(props.arguments.rol);
  const createPersona = async () => {
    try {
      if (nombre.value.trim().length > 0 && apellido.value.trim().length > 0
                 && correoElectronico.value.trim().length > 0) {
        await PersonaService.updatePersona(props.arguments.id, nombre.value, apellido.value, correoElectronico.value, rol.value);
        if (props.arguments.onPersonaUpdated) {
          props.arguments.onPersonaUpdated();
        }
        nombre.value = '';
        apellido.value = '';
        correoElectronico.value = '';
        rol.value = '';
        dialogOpened.value = false;
        Notification.show('Persona actualizada', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo actualizar, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

let listaRol = useSignal<String[]>([]);
    useEffect(() => {
      PersonaService.listRolPersona().then(data =>
        //console.log(data)
        listaRol.value = data
      );
    }, []);

  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar persona"
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
            <Button onClick={createPersona} theme="primary">
              Registrar
            </Button>

          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre de la persona"
            placeholder="Ingrese el nombre de la persona"
            aria-label="Nombre de la persona"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
           <TextField label="Apellido de la persona"
             placeholder="Ingrese el apellido de la persona"
             aria-label="Apellido de la persona"
             value={apellido.value}
             onValueChanged={(evt) => (apellido.value = evt.detail.value)}
           />
           <TextField label="Correo Electronico de la persona"
              placeholder="Ingrese el correo electronico de la persona"
              aria-label="correo electronico de la persona"
              value={correoElectronico.value}
              onValueChanged={(evt) => (correoElectronico.value = evt.detail.value)}
           />

           <ComboBox label="Rol"
              items={listaRol.value}
               placeholder='Seleccione un tipo de archivo'
               aria-label='Seleccione un tipo de archivo de la lista'
               value={rol.value}
               defaultValue={rol.value}
               onValueChanged={(evt) => (rol.value = evt.detail.value)}
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

//LISTA DE PERSONAS
export default function PersonaView() {

//  const dataProvider = useDataProvider<Persona>({
//    list: () => PersonaService.listAll(),
//  });

const [items, setItems] = useState([]);
  useEffect(() => {
    PersonaService.listPersona().then(function (data) {
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
    PersonaService.order(columnId, dir).then(function (data) {
      setItems(data);
    });
  }

  const criterio = useSignal('');
    const texto = useSignal('');
    const itemSelect = [
      {
        label: 'Nombre',
        value: 'nombre',
      },
      {
        label: 'Apellido',
        value: 'apellido',
      },
      {
        label: 'Correo Electronico',
        value: 'correoElectronico',
      },
      {
        label: 'Rol',
        value: 'rol',
      },
    ];

const search = async () => {
    try {
      console.log(criterio.value+" "+texto.value);
      PersonaService.search(criterio.value, texto.value, 0).then(function (data) {
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

  function indexLink({ item}: { item: Persona }) {

    return (
      <span>
        <PersonaEntryFormUpdate arguments={item} onPersonaUpdated={items.refresh}>

          </PersonaEntryFormUpdate>
      </span>
    );
  }

  function indexIndex({model}:{model:GridItemModel<Persona>}) {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  return (

    <main className="w-full h-full flex flex-col box-border gap-s p-m">

      <ViewToolbar title="Lista de personas">
        <Group>
          <PersonaEntryForm onPersonaCreated={items.refresh}/>
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
              <Button onClick={search} theme="primary">
                BUSCAR
              </Button>
            </HorizontalLayout>

      <Grid items={items}>
        <GridSortColumn path="nombre" header="Nombre de la persona"  onDirectionChanged={(e) => order(e, "nombre")} />
        <GridSortColumn path="apellido" header="Apellido"  onDirectionChanged={(e) => order(e, "apellido")}></GridSortColumn>
        <GridSortColumn path="correoElectronico" header="Correo"  onDirectionChanged={(e) => order(e, "correoElectronico")} />
        <GridSortColumn path="rol" header="Rol"  onDirectionChanged={(e) => order(e, "rol")}/>


        <GridColumn header="Acciones" renderer={indexLink}/>
      </Grid>
    </main>
  );
}

