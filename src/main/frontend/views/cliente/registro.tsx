import { useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, PasswordField, Button, Notification } from '@vaadin/react-components';
import { PersonaService } from 'Frontend/generated/endpoints';

export default function RegistroView() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');

  const rol = 'CLIENTE'; // Fijo

  const handleRegistro = async () => {
    try {
      // Validaciones básicas
      if (!nombre || !apellido || !correoElectronico || !usuario || !clave || !confirmarClave) {
        Notification.show('Todos los campos son obligatorios', { theme: 'error', position: 'top-center' });
        return;
      }

      if (clave !== confirmarClave) {
        Notification.show('Las contraseñas no coinciden', { theme: 'error', position: 'top-center' });
        return;
      }

      // Verificar si el correo ya existe
      const existentes = await PersonaService.search('correoElectronico', correoElectronico, 0);
      if (existentes.length > 0) {
        Notification.show('El correo ya está registrado', { theme: 'error', position: 'top-center' });
        return;
      }

      // Crear persona
      await PersonaService.createPersona(nombre, apellido, correoElectronico, rol, clave, usuario);

      Notification.show('Registro exitoso. Redirigiendo al login...', { theme: 'success', position: 'top-center' });

      // Redirigir después de un pequeño delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      Notification.show('Error al registrar: ' + (error as Error).message, { theme: 'error', position: 'top-center' });
      console.error(error);
    }
  };

  return (
    <div  className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4"  >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro de Cliente</h1>

        <TextField
          label="Nombre"
          value={nombre}
          onValueChanged={(e) => setNombre(e.detail.value)}
          required
        />
        <TextField
          label="Apellido"
          value={apellido}
          onValueChanged={(e) => setApellido(e.detail.value)}
          required
        />
        <TextField
          label="Correo Electrónico"
          value={correoElectronico}
          onValueChanged={(e) => setCorreoElectronico(e.detail.value)}
          required
        />
        <TextField
          label="Usuario"
          value={usuario}
          onValueChanged={(e) => setUsuario(e.detail.value)}
          required
        />
        <PasswordField
          label="Contraseña"
          value={clave}
          onValueChanged={(e) => setClave(e.detail.value)}
          required
        />
        <PasswordField
          label="Confirmar Contraseña"
          value={confirmarClave}
          onValueChanged={(e) => setConfirmarClave(e.detail.value)}
          required
        />

        <Button
          theme="primary"
          className="w-full mt-4"
          onClick={handleRegistro}
        >
          Registrarse
        </Button>
      </div>
    </div>
  );
}
