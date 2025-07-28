import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {
  Button,
  Dialog,
  TextField,
  VerticalLayout,
  Notification,
  DatePicker,
  TimePicker,
  Select,
  HorizontalLayout,
} from '@vaadin/react-components';
import { ParqueaderoService, ReservaService, VehiculoService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import Parqueadero from 'Frontend/generated/com/mistletoe/estaciona/base/models/Parqueadero';
import { useEffect, useState } from 'react';

import { SessionEndpoint } from 'Frontend/generated/endpoints';
import { CuentaService } from 'Frontend/generated/endpoints';
import { useAuth, getCurrentUserData, getCurrentUserId } from 'Frontend/security/auth';

export const config: ViewConfig = {
  title: 'Parqueadero',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 5,
    title: 'Parqueadero',
  },
};

// ----------- Tarjeta Individual de Parqueadero -----------
type ParqueaderoCardProps = {
  parqueadero: Parqueadero;
  index: number;
};

function ParqueaderoCard({ parqueadero, index }: ParqueaderoCardProps) {
  const dialogOpened = useSignal(false);
  
  const [plazas, setPlazas] = useState<{ value: string; label: string }[]>([]);
  const [cliente, setCliente] = useState<string | null>(null);
  const [plaza, setPlaza] = useState<string | null>(null);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [horaEntrada, setHoraEntrada] = useState<string | null>(null);
  const [horaSalida, setHoraSalida] = useState<string | null>(null);

  useEffect(() => {
    if (dialogOpened.value) {
      
      ReservaService.listaAlbumPlazas().then(setPlazas);
    }
  }, [dialogOpened.value]);

  const createReserva = async () => {
    if (!fecha || !horaEntrada || !horaSalida  || !plaza) {
      Notification.show('Completa todos los campos', { duration: 3000, position: 'top-center', theme: 'error' });
      return;
    }

    const [hE, mE] = horaEntrada.split(':').map(Number);
    const [hS, mS] = horaSalida.split(':').map(Number);

    const entradaDate = new Date(fecha);
    entradaDate.setHours(hE, mE);

    const salidaDate = new Date(fecha);
    salidaDate.setHours(hS, mS);

    const userId = await getCurrentUserId();

    try {
      await ReservaService.createReserva(
        fecha,
        entradaDate.toISOString(),
        salidaDate.toISOString(),
        parseInt(userId),
        parseInt(plaza)
      );

      Notification.show('Reserva creada correctamente', { duration: 3000, position: 'bottom-end', theme: 'success' });
      dialogOpened.value = false;
      // Reset form
      
      setPlaza(null);
      setFecha(null);
      setHoraEntrada(null);
      setHoraSalida(null);
    } catch (error) {
      console.error(error);
      Notification.show('Error al crear la reserva', { duration: 3000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      {/* Tarjeta del Parqueadero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '24px',
          color: 'white',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}
      >
        {/* Patrón decorativo de fondo */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            zIndex: 0
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%',
            zIndex: 0
          }}
        />

        {/* Contenido de la tarjeta */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Número de parqueadero */}
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {index + 1}
          </div>

          {/* Icono de parqueadero */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}
            >
              🅿️
            </div>
          </div>

          {/* Información del parqueadero */}
          <div style={{ marginBottom: '20px' }}>
            <h3
              style={{
                margin: '0 0 8px 0',
                fontSize: '20px',
                fontWeight: '600',
                lineHeight: '1.2'
              }}
            >
              {parqueadero.nombre}
            </h3>
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                opacity: '0.9',
                lineHeight: '1.4'
              }}
            >
              📍 {parqueadero.direccion}
            </p>
          </div>
        </div>

        {/* Botón de reserva */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Button
            theme="primary contrast"
            onClick={() => (dialogOpened.value = true)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              fontWeight: '500'
            }}
          >
            ✨ Crear Reserva
          </Button>
        </div>
      </div>

      {/* Dialog para crear reserva */}
      <Dialog
        headerTitle={`🅿️ Crear reserva para ${parqueadero.nombre}`}
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => (dialogOpened.value = detail.value)}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button theme="primary" onClick={createReserva}>
              💾 Guardar Reserva
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ width: '24rem', gap: 'var(--lumo-space-m)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <h4 style={{ margin: '0 0 4px 0' }}>📍 {parqueadero.nombre}</h4>
            <p style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>{parqueadero.direccion}</p>
          </div>

          
          <Select
            label="🚗 Plaza"
            items={plazas}
            onValueChanged={(e) => setPlaza(e.detail.value)}
            placeholder="Selecciona una plaza"
          />
          <DatePicker
            label="📅 Fecha"
            onValueChanged={(e) => setFecha(new Date(e.detail.value))}
            placeholder="Selecciona la fecha"
          />
          <TimePicker
            label="🕐 Hora de Entrada"
            onValueChanged={(e) => setHoraEntrada(e.detail.value)}
            placeholder="00:00"
          />
          <TimePicker
            label="🕐 Hora de Salida"
            onValueChanged={(e) => setHoraSalida(e.detail.value)}
            placeholder="00:00"
          />
        </VerticalLayout>
      </Dialog>
    </>
  );
}

// ----------- Formulario para registrar Vehículos -----------
type VehiculoEntryFormProps = {
  onVehiculoCreated?: () => void;
};

function VehiculoEntryForm(props: VehiculoEntryFormProps) {
  const dialogOpened = useSignal(false);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Campos del formulario
  const placa = useSignal('');
  const marca = useSignal('');
  const modelo = useSignal('');
  const color = useSignal('');

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      if (userId) {
        // Obtener todos los vehículos y filtrar por usuario actual
        const allVehiculos = await VehiculoService.listVehiculo();
        const userVehiculos = allVehiculos.filter(v => v.id_persona === userId);
        setVehiculos(userVehiculos || []);
      }
    } catch (error) {
      console.error('Error cargando vehículos:', error);
      Notification.show('Error al cargar los vehículos', { duration: 3000, position: 'top-center', theme: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dialogOpened.value) {
      loadVehiculos();
    }
  }, [dialogOpened.value]);

  const createVehiculo = async () => {
    try {
      if (!placa.value.trim() || !marca.value.trim() || !modelo.value.trim() || !color.value.trim()) {
        Notification.show('Completa todos los campos', { duration: 3000, position: 'top-center', theme: 'error' });
        return;
      }

      const userId = await getCurrentUserId();
      if (!userId) {
        Notification.show('Error: Usuario no identificado', { duration: 3000, position: 'top-center', theme: 'error' });
        return;
      }

      // Usar el método de tu VehiculoService
      await VehiculoService.createVehiculo(
        placa.value.trim(),
        marca.value.trim(),
        modelo.value.trim(),
        color.value.trim(),
        parseInt(userId)
      );

      Notification.show('Vehículo registrado exitosamente', { duration: 3000, position: 'bottom-end', theme: 'success' });

      // Reset form
      placa.value = '';
      marca.value = '';
      modelo.value = '';
      color.value = '';

      // Reload vehicles
      await loadVehiculos();

      if (props.onVehiculoCreated) {
        props.onVehiculoCreated();
      }
    } catch (error) {
      console.error(error);
      Notification.show('Error al registrar el vehículo: ' + (error as Error).message, { duration: 3000, position: 'top-center', theme: 'error' });
    }
  };

  const deleteVehiculo = async (vehiculoId: string) => {
    try {
      await VehiculoService.deleteVehiculo(parseInt(vehiculoId));
      Notification.show('Vehículo eliminado', { duration: 3000, position: 'bottom-end', theme: 'success' });
      await loadVehiculos();
    } catch (error) {
      console.error(error);
      Notification.show('Error al eliminar el vehículo: ' + (error as Error).message, { duration: 3000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Button
        theme="primary"
        onClick={() => (dialogOpened.value = true)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(10px)'
        }}
      >
        🚗 Mis Vehículos
      </Button>

      <Dialog
        headerTitle="🚗 Gestionar Mis Vehículos"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => (dialogOpened.value = detail.value)}
        style={{ '--vaadin-dialog-width': '600px' }}
      >
        <VerticalLayout style={{ gap: 'var(--lumo-space-m)', padding: '0' }}>

          {/* Lista de vehículos existentes */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>🚗 Mis Vehículos Registrados</h3>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                🔄 Cargando vehículos...
              </div>
            ) : vehiculos.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '32px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '2px dashed #d1d5db'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚗</div>
                <p style={{ margin: '0', color: '#6b7280' }}>Aún no tienes vehículos registrados</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
                  Registra tu primer vehículo usando el formulario de abajo
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vehiculos.map((vehiculo, index) => (
                  <div
                    key={vehiculo.id || index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                        🚗 {vehiculo.placa}
                      </div>
                      <div style={{ fontSize: '14px', opacity: '0.9' }}>
                        {vehiculo.marca} {vehiculo.modelo}
                      </div>
                      <div style={{ fontSize: '12px', opacity: '0.8' }}>
                        Color: {vehiculo.color}
                      </div>
                    </div>
                    <Button
                      theme="error small"
                      onClick={() => deleteVehiculo(vehiculo.id)}
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        minWidth: '40px'
                      }}
                      title="Eliminar vehículo"
                    >
                      🗑️
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulario para nuevo vehículo */}
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#374151' }}>➕ Registrar Nuevo Vehículo</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <TextField
                label="🆔 Placa"
                placeholder="ABC-123"
                value={placa.value}
                onValueChanged={(evt) => (placa.value = evt.detail.value.toUpperCase())}
                style={{ gridColumn: 'span 1' }}
                maxlength={10}
                helperText="Formato: ABC-123 o ABC123"
              />
              <TextField
                label="🏭 Marca"
                placeholder="Toyota, Honda, etc."
                value={marca.value}
                onValueChanged={(evt) => (marca.value = evt.detail.value)}
              />
              <TextField
                label="🚙 Modelo"
                placeholder="Corolla, Civic, etc."
                value={modelo.value}
                onValueChanged={(evt) => (modelo.value = evt.detail.value)}
              />
              <TextField
                label="🎨 Color"
                placeholder="Blanco, Negro, etc."
                value={color.value}
                onValueChanged={(evt) => (color.value = evt.detail.value)}
              />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button onClick={() => (dialogOpened.value = false)}>
                Cerrar
              </Button>
              <Button theme="primary" onClick={createVehiculo}>
                ➕ Registrar Vehículo
              </Button>
            </div>
          </div>
        </VerticalLayout>
      </Dialog>
    </>
  );
}
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
        headerTitle="🏢 Nuevo Parqueadero"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button onClick={() => (dialogOpened.value = false)}>Cancelar</Button>
            <Button onClick={createParqueadero} theme="primary">
              💾 Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '20rem', maxWidth: '100%' }}>
          <TextField
            label="🏢 Nombre del Parqueadero"
            placeholder="Ej: Parqueadero Centro Comercial"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <TextField
            label="📍 Dirección del Parqueadero"
            placeholder="Ej: Calle 123 #45-67"
            value={direccion.value}
            onValueChanged={(evt) => (direccion.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
    </>
  );
}

// ----------- Vista Principal de Parqueaderos -----------
export default function ParqueaderoView() {
  const [sessionInfo, setSessionInfo] = useState<{ username: string; roles: string } | null>(null);

  useEffect(() => {
    SessionEndpoint.getSessionInfo().then((info) => {
      if (info) {
        console.log('Usuario autenticado:', info.username);
        console.log('Roles:', info.roles);
        setSessionInfo(info);
      } else {
        console.warn('No hay sesión activa, redirigiendo a login...');
        window.location.href = '/login'; // Redirigir si no hay sesión
      }
    });
  }, []);

  useEffect(() => {
    CuentaService.getUserInfo()
      .then((info) => {
        if (info) {
          console.log("Usuario autenticado:", info);
        } else {
          window.location.href = '/login';
        }
      })
      .catch(() => window.location.href = '/login');
  }, []);


  const [items, setItems] = useState<Parqueadero[]>([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const callData = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await ParqueaderoService.listAll();
      setItems((data ?? []).filter((item): item is Parqueadero => item !== undefined));
    } catch (error) {
      console.error('Error al cargar datos de parqueaderos:', error);
      handleError(error);
      Notification.show('Error al cargar la lista de parqueaderos', { duration: 5000, position: 'top-center', theme: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callData();
  }, []);

  return (
    <main style={{ width: '100%', height: '100%', background: '#f8fafc' }}>
      {/* Header mejorado */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '32px 24px',
        marginBottom: '32px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
                🅿️ Parqueaderos Disponibles
              </h1>
              <p style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>
                Encuentra y reserva tu espacio de parqueo ideal
              </p>
            </div>

            <HorizontalLayout style={{ gap: '12px' }}>
              <VehiculoEntryForm />
              <ParqueaderoEntryForm onParqueaderoCreated={callData} />
              <Button
                theme="contrast"
                onClick={async () => {
                  await logout();
                  window.location.href = '/login';
                }}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                👋 Cerrar sesión
              </Button>
            </HorizontalLayout>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px',
            color: '#666'
          }}>
            🔄 Cargando parqueaderos...
          </div>
        ) : items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🅿️</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No hay parqueaderos disponibles</h3>
            <p style={{ margin: '0', color: '#6b7280' }}>Crea el primer parqueadero para comenzar</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>🅿️</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>
                  {items.length} parqueadero{items.length !== 1 ? 's' : ''} disponible{items.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Grid de tarjetas */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}
            >
              {items.map((parqueadero, index) => (
                <ParqueaderoCard
                  key={parqueadero.id || index}
                  parqueadero={parqueadero}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}