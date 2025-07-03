# PRD - Walletfy

## Descripción General del Proyecto

Walletfy es una aplicación web de gestión financiera personal que permite a los usuarios llevar un control detallado de sus ingresos y egresos. La aplicación ofrece una interfaz intuitiva para registrar eventos financieros y visualizar el flujo del balance a lo largo del tiempo, organizando la información por meses para facilitar el análisis de los patrones de gasto e ingreso del usuario.

### Arquitectura de la Aplicación

La aplicación combina los requisitos obligatorios con principios suckless donde es posible. Desarrollada en React con TypeScript, siguiendo arquitectura modular con SRP y estructura simple.

## Requisitos Técnicos

### Stack Tecnológico (Requisitos + Filosofía)
- **Runtime**: Bun 1.2
- **Lenguaje**: TypeScript (100% - No JavaScript permitido)
- **Framework**: React con TypeScript
- **Bundler**: Vite
- **Estado**: Redux Toolkit con Thunks 
- **Data Fetching**: React Query (Tanstack Query)
- **Validación**: Zod 
- **Fechas**: Day.js 
- **Estilos**: Tailwind CSS 
- **Componentes UI**: Mantine library (simplificado pero funcional)
- **Tooltips**: React Tooltip (especificado en requisitos)
- **Identificadores**: uuid (recomendado en requisitos)

### Paleta de Colores Temática
Acorde a la temática financiera, se utilizará una paleta que inspire confianza y profesionalismo:

#### Colores Principales
- **Verde Financiero**: `#22c55e` (éxito, ingresos, crecimiento)
- **Rojo Financiero**: `#ef4444` (egresos, alertas, pérdidas)
- **Azul Corporativo**: `#3b82f6` (confianza, estabilidad)
- **Gris Neutral**: `#6b7280` (texto secundario, bordes)

#### Colores de Soporte
- **Verde Claro**: `#dcfce7` (fondos de éxito)
- **Rojo Claro**: `#fee2e2` (fondos de alerta)
- **Azul Claro**: `#dbeafe` (fondos informativos)
- **Blanco/Negro**: Para texto principal y fondos

#### Tema Oscuro
- **Fondo Principal**: `#0f172a` (slate-900)
- **Fondo Secundario**: `#1e293b` (slate-800)
- **Verde Oscuro**: `#16a34a` (green-600)
- **Rojo Oscuro**: `#dc2626` (red-600)
- **Azul Oscuro**: `#2563eb` (blue-600)

### Principios de Desarrollo
- **Single Responsibility Principle (SRP)**: Cada módulo con una única responsabilidad 
- **Programación Funcional**: map, filter, reduce en lugar de loops imperativos 
- **Programación Imperativa**: Preferir paradigma funcional, evitar patrones imperativos y procedurales
- **Componentes con children**: Al menos uno debe usar prop children 
- **Modularidad**: Organización clara por entidad/funcionalidad 
- **KISS**: Mantener simplicidad dentro de restricciones
- **Minimal SLOC**: Usar el mínimo código necesario para cumplir requisitos
- **No Over-Engineering**: Evitar abstracciones innecesarias (donde sea permitido)

## Requisitos Funcionales

### Descripción General
Walletfy permite a los usuarios:
- Definir un dinero inicial para su billetera
- Crear eventos de ingreso o egreso de dinero
- Visualizar el flujo del balance a lo largo del tiempo
- Organizar los eventos por meses
- Persistir los datos en el navegador

### Entidades

#### Evento
Representa un ingreso o egreso del usuario con los siguientes campos:

| Campo | Tipo | Obligatorio | Validaciones |
|-------|------|-------------|--------------|
| id | string | Sí | Único por evento (uuid) |
| nombre | string | Sí | Máximo 20 caracteres |
| descripción | string | No | Máximo 100 caracteres |
| cantidad | number | Sí | Número positivo (entero o decimal) |
| fecha | Date | Sí | Fecha válida |
| tipo | string | Sí | Solo valores: "egreso" o "ingreso" |

## Secciones de la Aplicación

### 1. Flujo Balance

#### Descripción
Sección principal que presenta todos los eventos creados por el usuario, agrupados por meses.

#### Características
- **Agrupación por Meses**: Los eventos se organizan automáticamente por mes y año
- **Visualización de Mes**: Cada mes muestra:
  - Nombre del mes y año
  - Total de ingresos del mes
  - Total de egresos del mes
  - Lista de eventos (puede ser fija o desplegable)

#### Visualización de Eventos
Cada evento dentro del mes muestra:
- **Nombre**: Visible directamente
- **Descripción**: Como tooltip de Mantine al pasar el mouse sobre el evento
- **Cantidad**: Monto del evento con formato de moneda
- **Fecha**: Formato DD/MM/YYYY
- **Tipo**: Badge de Mantine o icono indicando si es ingreso o egreso
- **Colores**: Verde para ingresos, rojo para egresos según paleta definida

### 2. Formulario de Evento

#### Descripción
Sección para crear nuevos eventos o editar eventos existentes.

#### Funcionalidades
- **Modo Creación**: Formulario vacío con valores iniciales usando Mantine Form
- **Modo Edición**: Formulario precargado con datos del evento seleccionado
- **Validaciones**: En tiempo real según las reglas de la entidad Evento usando Zod + Mantine
- **Mensajes de Error**: Mostrados con Mantine Error en cada campo cuando no cumple validaciones
- **Componentes**: TextInput, NumberInput, DatePicker, Select, FileInput (Mantine)

#### Botones de Acción
- **"Crear evento"**: Mantine Button con variante filled para nuevos eventos
- **"Actualizar evento"**: Mantine Button con variante outline para editar eventos existentes
- **Colores**: Verde para crear, azul para actualizar según paleta definida

#### Comportamiento
- Al guardar: Los datos se persisten en LocalStorage
- Redirección automática a la vista Flujo Balance
- Los cambios se reflejan inmediatamente

## Funcionalidades Adicionales

### Tema Light/Dark
- ActionIcon de Mantine para alternar entre tema claro y oscuro
- Integración con Mantine ColorScheme Provider
- El valor se almacena en el estado global (Redux)
- La preferencia persiste al refrescar la página
- Iconos: Sol para tema claro, Luna para tema oscuro

## Puntos Extras

### Campos Adicionales en Evento
| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| adjunto | string | No | Imagen codificada en base64 |

### Mejoras en el Formulario
- FileInput de Mantine para subir imagen con preview
- Validación del formato de imagen usando Zod
- Conversión a base64 para almacenamiento
- Dropzone component de Mantine para mejor UX

### Mejoras en Flujo Balance
1. **Modal de Detalle**: Al hacer clic en un evento, mostrar Modal de Mantine con:
   - Todos los campos del evento usando Text components
   - Imagen adjunta usando Image component de Mantine (si existe)
   - Opción alternativa: mostrar imagen en el Tooltip de Mantine

2. **Búsqueda de Meses**:
   - TextInput de Mantine con icono de búsqueda
   - Placeholder: "Buscar por mes y año (ej: Diciembre 2024)"
   - Implementación con debouncing usando custom hook
   - Filtrado y búsqueda optimizada con debouncing

## Consideraciones Técnicas

### Persistencia de Datos
- Todos los eventos se almacenan en LocalStorage
- El tema seleccionado se persiste en LocalStorage
- Recuperación automática de datos al cargar la aplicación

### Gestión de Estado y Cache
- **React Query**: Manejo de cache para datos de eventos
- **Sincronización**: Actualización automática del estado local
- **Optimistic Updates**: Actualizaciones optimistas para mejor UX
- **Background Refetch**: Sincronización en segundo plano cuando corresponda

### Rendimiento
- Uso de debouncing en la búsqueda
- Lazy loading para listas largas de eventos
- Memoización de cálculos de totales

### Experiencia de Usuario
- Validaciones en tiempo real
- Feedback visual inmediato
- Navegación intuitiva entre secciones
- Diseño responsivo con Tailwind CSS y Mantine components

## Estructura de Carpetas Recomendada

```
src/
├── components/
│   ├── EventForm.tsx
│   ├── EventList.tsx
│   ├── MonthCard.tsx
│   ├── ThemeToggle.tsx
│   └── (...)
├── redux/
│   ├── store.ts
│   ├── slices/
│   │   ├── eventsSlice.ts
│   │   ├── themeSlice.ts
│   │   └── (...)
│   └── thunks/
│       ├── eventThunks.ts
│       └── (...)
├── hooks/
│   ├── useEvents.ts
│   ├── useEventsQuery.ts
│   └── (...)
├── types/
│   ├── Event.ts
│   └── (...)
├── schemas/
│   ├── eventSchema.ts
│   └── (...)
├── utils/
│   ├── storage.ts
│   ├── dateHelpers.ts
│   ├── queryClient.ts
│   └── (...)
├── styles/
│   └── globals.css
└── App.tsx
```

### Estructura Balanceada
- **Redux**: Store, slices, thunks según requisitos
- **Componentes planos**: Sin sub-carpetas innecesarias (suckless)
- **Modularidad**: Cada archivo con responsabilidad única (SRP)
- **Schemas**: Validaciones Zod separadas
- **Utils**: Helpers para fechas Day.js y storage
- **Types**: Interfaces TypeScript para type safety

## Dependencias Principales

### Dependencias Requeridas
- **Core**: react
- **Estado**: redux
- **Data Fetching**: @tanstack/react-query
- **Validación**: zod
- **Fechas**: dayjs
- **Estilos**: tailwindcss
- **UI**: mantine
- **Tooltips**: react-tooltip (especificado en requisitos)
- **Utilidades**: uuid, crypto

### Filosofía
- ✅ **TypeScript 100%**: Sin JavaScript
- ✅ **Estructura simple**: Carpetas planas, sin over-engineering
- ✅ **Mantine mínimo**: Solo paquetes necesarios, no todos los módulos
- ✅ **Código directo**: Sin abstracciones innecesarias

### Configuración de TypeScript
Configuración estricta requerida:
- `strict: true` - Modo estricto habilitado
- `noImplicitAny: true` - No permitir any implícito
- `strictNullChecks: true` - Verificación estricta de null/undefined
- `noImplicitReturns: true` - Todas las rutas deben retornar valor
- Interfaces tipadas para todas las entidades y props de componentes

### Configuración Minimalista
- **Mantine**: Configuración básica con tema light/dark simple  
- **Tailwind**: CSS utilities directo sin configuración compleja
