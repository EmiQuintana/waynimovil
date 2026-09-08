# WayniWallet

Wallet web: saldo, contactos y transferencias. Next.js (App Router) + TypeScript, TanStack Query, Zustand, Tailwind y persistencia en `localStorage`.

```bash
npm install
npm run dev
```

Tests:

```bash
npm test
```

## Uso de IA

Trabajé el challenge en **Cursor**, con el agente para implementar por pasos (boilerplate, pantallas, tests). Las decisiones de producto y de arquitectura las fui fijando yo; la IA ejecutó sobre ese recorte.

### Qué herramientas usé y para qué

- **Cursor (agente de código):** scaffolding de Next.js, carpetas (`services/`, `hooks/`, `store/`, `components/`, `utils/`), Home, flujo de transferencia, Perfil, Jest + Testing Library, y este README.
- **Capturas del diseño:** las pasé yo; la IA las usó como referencia visual (header verde, card blanca, empty states).
- **GitHub:** el repo lo creé yo (`EmiQuintana/waynimovil`). El push quedó de mi lado por autenticación local.
- **Terminal local:** el `npm run dev` lo corrí yo. Pedí que el agente no ocupara el puerto 3000.

No usé la IA para “review” formal de PR ni para inventar el enunciado: el alcance (stack, reglas de negocio, estados de UI) vino del challenge.

### Qué decidí yo

- **Plata en centavos (enteros).** El saldo y los montos se guardan y se calculan como enteros. El formateo a ARS (`$ 1.234,56`) es solo de presentación. Así se cumple “no usar floats para calcular” y se evitan errores de redondeo al descontar.
- **TanStack Query vs Zustand.** Query para estado de servidor/dispositivo que se lee en varias pantallas: directorio de Random User y ledger (`saldo` + `movimientos`). Zustand solo para el draft del flujo (destinatario, monto, concepto) y el último comprobante de éxito. Si la confirmación falla, el draft no se limpia.
- **Estados de error.** Loading con skeletons, empty state si no hay movimientos/contactos, y error + retry si falla Random User o la confirmación. En confirmación hay un toggle de desarrollo “Force error”: si falla, no se descuenta el saldo.
- **Alcance por pasos.** Primero un Next.js que arranque, después la arquitectura, después cada pantalla. Evité que la IA entregara la app entera de una.
- **Perfil.** Nombre y avatar salen de Random User; si faltan ubicación o contacto (cache viejo o API incompleta), se completan con datos locales.

### Qué output de IA rechacé o corregí, y por qué

- **Servidor en localhost:3000.** El agente lo levantó para “verificar” la UI. Lo corté: quería controlar el puerto desde mi terminal.
- **Wallet como HTTP a `/api/...`.** En el esqueleto de arquitectura inventó llamadas a APIs que no existían. Lo reemplacé por Random User + `localStorage`, que es lo que pide el enunciado.
- **Plata como float.** El saldo inicial se guardó primero como `2800` en número decimal y se restaba con `toFixed(2)`. Lo corregí a centavos cuando llegaron las reglas de transferencia.
- **Pantalla de transferir incompleta.** El primer `/transfer` solo mostraba el contacto. Lo rechacé como entrega: hacían falta monto, concepto, confirmación, éxito/error y las reglas (saldo, decimales, no transferirse a uno mismo, botón deshabilitado, anti doble submit).
- **Perfil vacío.** La UI pintaba labels (City, State, etc.) sin valores porque el cache de Query tenía usuarios viejos sin esos campos. Pedí fallback local en vez de depender solo de un refetch.
- **`refetchOnMount: false` en el directorio.** Evitaba refetch al navegar, pero en un load fresco de Perfil podía no pedir datos. Lo saqué: `staleTime: Infinity` ya cachea; no hace falta bloquear el mount.

La IA aceleró boilerplate y UI; el modelo de datos, el corte Query/Zustand y los estados de error los revisé y ajusté contra el enunciado.
