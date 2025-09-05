# Proyecto NestJS + React con Vite

Las tecnologias que utilizamos brindadas por la catedra son: **NestJS** en el backend y **React con Vite** en el frontend. 
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
.
├── 2025_proyecto1_back_imc/          # BACKEND
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── module/imc/
│   │   └── app.controller.spec.ts
│   │   └── app.service.spec.ts

├── 2025_proyecto1_front_imc/         # FRONTEND
│   ├── src/
│   └── ...
├── package.json
└── README.md

```

# Configuración del Proyecto NestJS + React (Vite)

Instrucciones para la configuracion del proyecto
---

## Backend (NestJS)

### 1. Instalar dependencias

```bash
cd backend
npm install
# o
yarn install


```
### 2. Ejecutar en modo desarrollador
```bash
npm run start:dev
# o
yarn start:dev

```
El backend correrá en http://localhost:3000.
### 3. Ejecutar pruebas unitarias
```bash
npm run test
# o
yarn test
```

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
### 1. Construimos el backend
```bash
cd backend
npm run build
# o
yarn build
```
### 2. Desplegamos el backend
```bash
npm run start
# o
yarn start
```
### 3. Construimos el frontend
```bash
cd frontend
npm run build
# o
yarn build
```

### 4. Desplegamos el frontend
```bash
npm run dev
# o
yarn dev
```

