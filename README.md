# WayniWallet

Wallet web: saldo, contactos y transferencias.

Stack: Next.js (App Router) + TypeScript, componentes funcionales y hooks, TanStack Query, Zustand, Tailwind CSS y persistencia en `localStorage`.

## Instalación

Con **npm**:

```bash
npm install
```

Con **yarn**:

```bash
yarn
```

Con **pnpm**:

```bash
pnpm install
```

## Cómo correr la app

```bash
npm run dev
# yarn dev
# pnpm dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Cómo correr tests

Jest + Testing Library:

```bash
npm test
# yarn test
# pnpm test
```

En watch:

```bash
npm run test:watch
# yarn test:watch
# pnpm test:watch
```

Los tests cubren: no confirmar un monto mayor al saldo, actualización de saldo e historial tras una transferencia exitosa, y empty state del historial.

## Decisiones de arquitectura

Separación mínima, sin capas de más:

| Carpeta | Responsabilidad |
| --- | --- |
| `services/` | HTTP (Random User) y persistencia del ledger |
| `hooks/` | TanStack Query y lógica del flujo |
| `store/` | Zustand: solo el draft de la transferencia |
| `components/` | UI. Las páginas orquestan; las reglas no viven en el JSX |
| `utils/` | Formatter de moneda (centavos → ARS) y helpers puros |

**Plata.** Internamente todo es entero en centavos. No se suma ni resta con floats. `formatCurrency` solo formatea para la UI (`$ 1.234,56`).

**TanStack Query.** Estado que se comparte entre pantallas y se cachea: directorio de usuarios (Random User) y ledger (saldo + movimientos en `localStorage`). Tras una transferencia exitosa se actualiza el cache; Home e Historial se refrescan sin recargar.

**Zustand.** Draft del flujo: destinatario, monto y concepto. Si la confirmación falla, el draft se conserva. El comprobante de éxito se guarda aparte para la pantalla final.

**Datos.** Usuario y contactos: `https://randomuser.me/api/` (mínimo 10 contactos), cacheados para no refetch en cada navegación. Saldo inicial y movimientos: locales. Si Random User no trae ubicación o contacto, el perfil completa con datos locales.

**Errores y vacíos.** Skeletons en carga. Empty state si no hay movimientos o contactos. Error + retry si falla Random User o la confirmación. Toggle “Force error” en desarrollo: no descuenta saldo.

## Uso de IA

Trabajé el challenge en **Cursor**, con el agente para implementar por pasos (boilerplate, pantallas, tests). Las decisiones de producto y de arquitectura las fui fijando yo; la IA ejecutó sobre ese recorte.

### Qué herramientas usé y para qué

- **Cursor (agente de código):** scaffolding de Next.js, carpetas (`services/`, `hooks/`, `store/`, `components/`, `utils/`), Home, flujo de transferencia, Perfil, Jest + Testing Library, y este README.
- **Capturas del diseño:** las pasé yo; la IA las usó como referencia visual (header verde, card blanca, empty states).
- **GitHub:** el repo lo creé yo (`EmiQuintana/waynimovil`). El push quedó de mi lado por autenticación local.
- **Terminal local:** el `npm run dev` lo corrí yo. Pedí que el agente no ocupara el puerto 3000.

No usé la IA para “review” formal de PR ni para inventar el enunciado: el alcance (stack, reglas de negocio, estados de UI) vino del challenge.

### Qué decidí yo

- Modelo de la plata en centavos, corte Query/Zustand, estados de error/empty/retry, y el trabajo por pantallas (primero que arranque Next, después arquitectura, después cada feature).
- La IA aceleró boilerplate y UI; esas decisiones las revisé contra el enunciado.

### Qué output de IA rechacé o corregí, y por qué

- **Servidor en localhost:3000.** El agente lo levantó para “verificar” la UI. Lo corté: quería controlar el puerto desde mi terminal.
- **Wallet como HTTP a `/api/...`.** En el esqueleto de arquitectura inventó llamadas a APIs que no existían. Lo reemplacé por Random User + `localStorage`.
- **Plata como float.** El saldo inicial se guardó primero como `2800` decimal y se restaba con `toFixed(2)`. Lo pasé a centavos cuando llegaron las reglas de transferencia.
- **Pantalla de transferir incompleta.** El primer `/transfer` solo mostraba el contacto. Hacían falta monto, concepto, confirmación, éxito/error y las reglas de negocio.
- **Perfil vacío.** Labels sin valores por cache viejo de Query. Pedí fallback local.
- **`refetchOnMount: false` en el directorio.** Bloqueaba el fetch en un load fresco de Perfil. `staleTime: Infinity` ya alcanza para no refetch al navegar.
