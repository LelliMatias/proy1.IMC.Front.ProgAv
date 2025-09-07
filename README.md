# Proyecto NestJS + React con Vite

Las tecnologias que utilizamos brindadas por la catedra son: **NestJS** en el backend y **React con Vite** en el frontend. Este documento es una guia para poder poner en funcionamiento el **frontend**
---

## Tecnologías utilizadas

- **Backend:** NestJS, TypeScript
- **Frontend:** React, Vite, TypeScript
- **Testing:** Jest (para pruebas unitarias)
- **Gestión de dependencias:** npm / yarn
- **Base de datos:** (Postgres 1era parte)

---

## Estructura del proyecto

```text

├── 2025_proyecto1_front_imc/         # FRONTEND
│   ├── src/
│   └── ...
├── package.json
└── README.md

```

# Configuración del Proyecto NestJS + React (Vite)

Instrucciones para la configuracion del proyecto
---
## Frontend (React + Vite)
### 1. Instalar dependencias
```bash
cd frontend
npm install
# o
yarn install
```
### 2. Ejecutar en modo desarrollador
```bash
npm run dev
# o
yarn dev
```
El frontend correrá en http://localhost:5173.

## Despliegue
### 1. Construimos el frontend
```bash
cd frontend
npm run build
# o
yarn build
```

### 2. Desplegamos el frontend
```bash
npm run dev
# o
yarn dev
```

### Posibles Issues
| Issue                                      | Causa                                                      | Solución                                                                                                               |
| ------------------------------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Errores de dependencias faltantes**      | Node\_modules no instalados o versión incompatible de Node | Ejecutar `npm install` o `yarn install`; usar Node 20+                                                                 |
| **Frontend no se conecta al backend**      | URL o puerto incorrecto                                    | Verificar que el backend esté corriendo en el puerto correcto y que la URL usada en fetch/axios coincida               |
| **Problemas al construir para producción** | Cache corrupta o dependencias obsoletas                    | Ejecutar `rm -rf node_modules dist && npm install && npm run build`                                                    |
| **Errores de CORS**                        | Requests a backend desde otro puerto sin CORS              | Asegurarse que el backend tenga CORS habilitado                                                                        |

### Casos de Prueba con Gherkin

Este archivo especifica documentacion que sirve como especificacion y como base para la comprension
de las pruebas automatizadas.

```
├── 2025_proyecto1_front_imc/        
│   ├── src/
│   │   ├── ImcForm.feature
```