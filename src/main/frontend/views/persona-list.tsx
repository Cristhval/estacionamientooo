import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
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
        await PersonaService.createArtista(nombre.value, apellido.value,correoElectronico.value, rol.value);
        if (props.onPersonaCreated) {
          props.onPersonaCreated();
        }
        nombre.value = '';
        apellido.value = '';
        correoElectronico = '';
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
        await ArtistaService.updatePersona(props.arguments.id, nombre.value, apellido.value, correoElectronico.value, rol.value);
        if (props.arguments.onPersonaUpdated) {
          props.arguments.onPersonaUpdated();
        }
        nombre.value = '';
        apellido.value = '';
        correoElectronico = '';
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

  const dataProvider = useDataProvider<Persona>({
    list: () => PersonaService.listAll(),
  });

  function indexLink({ item}: { item: Persona }) {

    return (
      <span>
        <PersonaEntryFormUpdate arguments={item} onPersonaUpdated={dataProvider.refresh}>

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
          <PersonaEntryForm onPersonaCreated={dataProvider.refresh}/>
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn path="nombre" header="Nombre de la persona" />
        <GridColumn path="apellido" header="Apellido"></GridColumn>
        <GridColumn path="correoElectronico" header="Correo" />
        <GridColumn path="rol" header="Rol" />
        <GridColumn header="Acciones" renderer={indexLink}/>
      </Grid>
    </main>
  );
}

