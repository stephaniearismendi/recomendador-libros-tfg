# Read-It

## Descripción

Este proyecto forma parte de un Trabajo de Fin de Grado (TFG) y consiste en el desarrollo de una aplicación móvil multiplataforma para la gestión personal de bibliotecas de lectura. La aplicación permite a los usuarios organizar sus libros, realizar seguimiento de lecturas, participar en clubs de lectura y compartir opiniones con el resto de usuarios.

## Características principales

- **Gestión de biblioteca personal**: Catálogo de libros con información detallada
- **Seguimiento de lectura**: Control de progreso y sesiones de lectura
- **Sistema social**: Compartir reseñas, seguir usuarios y participar en clubs
- **Gamificación**: Logros, desafíos de lectura y estadísticas
- **Recomendaciones**: Sistema de sugerencias basado en preferencias
- **Búsqueda avanzada**: Filtros por género, autor, popularidad

## Tecnologías utilizadas

- **React Native** con Expo para el desarrollo móvil
- **React Navigation** para la navegación
- **Axios** para las peticiones HTTP
- **AsyncStorage** para el almacenamiento local
- **JWT** para la autenticación

## Instalación y configuración

### Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil con Expo Go o emulador

### Pasos de instalación

1. Clonar el repositorio:

```bash
git clone [url-del-repositorio]
cd biblioteca-lectura
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:
   Crear archivo `.env` en la raíz:

```
EXPO_PUBLIC_API_URL=http://192.168.0.19:3000
```

4. Iniciar el servidor de desarrollo:

```bash
npm start
```

## Scripts disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run android    # Ejecuta en Android
npm run ios        # Ejecuta en iOS
npm run web        # Ejecuta en navegador web
```

## Arquitectura del proyecto

```
src/
├── api/           # Configuración y servicios de API
├── components/    # Componentes reutilizables
├── context/       # Contextos de React (autenticación)
├── navigation/    # Configuración de navegación
├── screens/       # Pantallas principales
├── styles/        # Estilos y temas
└── utils/         # Funciones auxiliares
```
