# 🌿 EcoPuntos - Cliente Web

Aplicación web para el sistema EcoPuntos, donde los usuarios pueden reciclar y ganar puntos canjeables por premios.

## 🚀 Características Principales

### ✅ Implementadas (Cliente)
- ✨ **Autenticación completa** (Login/Registro con tokens JWT)
- 📊 **Dashboard** con resumen de puntos y estadísticas
- 📱 **Escanear QR** para reclamar puntos por reciclaje
- 🛍️ **Tienda** con catálogo de artículos canjeables
- 📜 **Historial** de transacciones (ganadas/canjeadas)
- 🎁 **Mis Canjes** para ver premios pendientes de recojo
- 🗺️ **Mapa** de puntos de acopio cercanos
- 👤 **Perfil** para gestionar datos personales y contraseña
- 🔔 **Notificaciones** toast con feedback en tiempo real
- 📱 **Diseño responsive** con Bootstrap 5

## 🛠️ Tecnologías Utilizadas

- **React** 19.2.0
- **React Router DOM** para navegación
- **Bootstrap** 5 + React Bootstrap
- **Axios** para peticiones HTTP
- **Context API** para gestión de estado
- **React Icons** para iconografía

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env y configurar la URL del backend
REACT_APP_API_URL=http://localhost:8000/api

# Iniciar el servidor de desarrollo
npm start
```

## 🔧 Configuración del Backend

Asegúrate de que el backend Laravel esté corriendo en `http://localhost:8000`

```bash
cd ../ecoPuntosBackend
php artisan serve
```

## 📁 Estructura del Proyecto

```
src/
├── components/         # Componentes de la landing page
│   ├── Header.js
│   ├── Inicio.js
│   ├── QuienesSomos.js
│   └── ...
├── pages/             # Páginas de la aplicación
│   ├── Login.js
│   ├── Registro.js
│   ├── DashboardCliente.js
│   ├── EscanearQR.js
│   ├── Tienda.js
│   ├── Historial.js
│   ├── MisCanjes.js
│   ├── Mapa.js
│   └── Perfil.js
├── context/           # Context API
│   ├── AuthContext.js
│   └── NotificationContext.js
├── services/          # Servicios API
│   ├── api.js
│   └── clienteService.js
├── utils/             # Utilidades
│   └── PrivateRoute.js
└── css/              # Estilos CSS

```

## 🎯 Funcionalidades por Rol

### 👤 Cliente
1. **Reclamar Puntos**: Escanear códigos QR de recolectores
2. **Canjear Premios**: Usar puntos para obtener artículos de la tienda
3. **Ver Historial**: Revisar todas las transacciones
4. **Consultar Mapa**: Encontrar puntos de acopio cercanos
5. **Gestionar Perfil**: Actualizar datos personales

## 🔐 Autenticación

El sistema usa **Laravel Sanctum** con tokens Bearer:
- Los tokens se almacenan en `localStorage`
- Se agregan automáticamente en cada petición HTTP
- Expiración automática y redirección al login

## 📡 Endpoints Consumidos

```javascript
// Autenticación
POST /api/register
POST /api/login
POST /api/logout

// Cliente
GET  /api/cliente/puntos
GET  /api/cliente/historial
GET  /api/cliente/canjes-pendientes
GET  /api/cliente/puntos-acopio
POST /api/transacciones/reclamar
POST /api/transacciones/canjear

// Perfil
GET   /api/perfil
PUT   /api/perfil
PATCH /api/perfil/password

// General
GET /api/articulos
```

## 🎨 Diseño

- **Paleta de colores**: Degradados azules/cyan con fondo oscuro
- **Tema**: Dark mode con efectos glassmorphism
- **Responsive**: Mobile-first con breakpoints de Bootstrap
- **Iconos**: React Icons (Font Awesome)

## 🚧 Próximas Implementaciones

- [ ] Panel de Recolector
- [ ] Panel de Administrador
- [ ] Integración con Google Maps API
- [ ] Scanner QR con cámara
- [ ] Gráficas de estadísticas
- [ ] Sistema de notificaciones push

## 📝 Notas Importantes

1. **Puerto del frontend**: `http://localhost:3000`
2. **Puerto del backend**: `http://localhost:8000`
3. **CORS**: Debe estar configurado en el backend Laravel
4. **Tokens**: Se almacenan en localStorage del navegador

## 🐛 Solución de Problemas

### Error de CORS
```php
// En Laravel: config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

### Token no se envía
Verificar que el interceptor de Axios esté configurado correctamente en `services/api.js`

## 👥 Roles del Sistema

- **cliente**: Usuario que recicla y gana puntos (IMPLEMENTADO)
- **recolector**: Genera QRs y entrega premios (PENDIENTE)
- **admin**: Gestiona el sistema completo (PENDIENTE)

## 📄 Licencia

Proyecto educativo - EcoPuntos 2025
