// main.jsx — TravelPro · Sistema de Gestión de Presupuestos de Viajes (versión alineada al PDF v4.0)
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

/* ============================================================
   1. DATOS GLOBALES (simulan AMADEUS y los catálogos locales)
   ============================================================ */
const AMADEUS_VUELOS = [
  { idVuelo: 'V1', pais: 'Francia', aerolinea: 'Air France', precioMXN: 15000, duracion: '11h', escalas: 0 },
  { idVuelo: 'V2', pais: 'España', aerolinea: 'Iberia', precioMXN: 13500, duracion: '10h', escalas: 0 },
  { idVuelo: 'V3', pais: 'Japón', aerolinea: 'ANA', precioMXN: 28000, duracion: '18h', escalas: 1 },
  { idVuelo: 'V4', pais: 'Estados Unidos', aerolinea: 'American Airlines', precioMXN: 8500, duracion: '4h', escalas: 0 },
  { idVuelo: 'V5', pais: 'México', aerolinea: 'Aeroméxico', precioMXN: 4500, duracion: '2h', escalas: 0 },
];

const AMADEUS_HOSPEDAJES = [
  { idHotel: 'H1', pais: 'Francia', nombre: 'Hotel Ritz Paris', precioNocheMXN: 5000, camas: 2 },
  { idHotel: 'H2', pais: 'España', nombre: 'Hotel Riu Madrid', precioNocheMXN: 2500, camas: 3 },
  { idHotel: 'H3', pais: 'Japón', nombre: 'Shinjuku Granbell Hotel', precioNocheMXN: 3000, camas: 2 },
  { idHotel: 'H4', pais: 'Estados Unidos', nombre: 'The Manhattan Times Square', precioNocheMXN: 4500, camas: 2 },
  { idHotel: 'H5', pais: 'México', nombre: 'Hotel Geneve CDMX', precioNocheMXN: 1800, camas: 2 },
];

const ATRACCIONES_DB = [
  { idAtraccion: 'A1', pais: 'Francia', nombre: 'Museo del Louvre', precioMXN: 400 },
  { idAtraccion: 'A2', pais: 'Francia', nombre: 'Torre Eiffel', precioMXN: 500 },
  { idAtraccion: 'A3', pais: 'Japón', nombre: 'Templo Senso-ji', precioMXN: 0 },
  { idAtraccion: 'A4', pais: 'Estados Unidos', nombre: 'Estatua de la Libertad', precioMXN: 700 },
  { idAtraccion: 'A5', pais: 'México', nombre: 'Museo de Antropología', precioMXN: 100 },
  { idAtraccion: 'A6', pais: 'España', nombre: 'Museo del Prado', precioMXN: 300 },
];

// modo: 'persona' = se cobra a cada viajero · 'compartido' = se cobra una vez por el grupo
const TRANSPORTE_DB = [
  { idTransporte: 'T1', tipo: 'Pase Semanal Metro', precioMXN: 679, modo: 'persona' },
  { idTransporte: 'T2', tipo: 'Taxi Aeropuerto-Ciudad', precioMXN: 850, modo: 'compartido' },
];

const GASTOS_DB = [
  { tipo: 'eSIM', descripcion: 'Chip de Datos', costoMXN: 337.6 },
  { tipo: 'Adaptador', descripcion: 'Enchufe Universal', costoMXN: 253.37 },
  { tipo: 'Visa', descripcion: 'Trámite Migratorio', costoMXN: 1400.0 },
];

const PAISES = ['Francia', 'España', 'Japón', 'Estados Unidos', 'México'];
const COMISION = 0.1;

const INITIAL_USUARIOS = [
  { id: 1, nombre: 'Carlos Gerente', email: 'gerente@travelpro.com', password: '123', rol: 'gerente', creadoPor: null },
  { id: 2, nombre: 'Laura Jefa', email: 'jefa@travelpro.com', password: '123', rol: 'jefe', creadoPor: 1 },
  { id: 3, nombre: 'Misael Agente', email: 'agente@travelpro.com', password: '123', rol: 'agente', creadoPor: 2 },
];

// Estructura del PDF (Sección 3): 4 pasos y sus subpasos
const PASOS = [
  { n: 1, titulo: 'Registrar solicitud', subs: ['Buscar vuelos', 'Apartar vuelo', 'Buscar hospedajes', 'Apartar hospedaje'] },
  { n: 2, titulo: 'Atracciones y transporte', subs: ['Buscar atracciones', 'Seleccionar atracciones', 'Buscar transportes', 'Seleccionar transporte'] },
  { n: 3, titulo: 'Itinerario y viajeros', subs: ['Crear itinerario', 'Registrar gastos extras'] },
  { n: 4, titulo: 'Presupuesto y confirmación', subs: ['Calcular presupuesto', 'Aplicar comisión', 'Enviar PDF al cliente', 'Confirmar o liberar'] },
];

/* ============================================================
   2. UTILIDADES
   ============================================================ */
const fmt = (n) => (n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const hoy = () => new Date().toISOString().slice(0, 10);
const sumarDias = (iso, d) => {
  const dt = new Date(iso + 'T12:00:00');
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().slice(0, 10);
};
const fechaLarga = (iso) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
const nuevoOrderId = (p) => `AMD-${p}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
const folioCot = (n) => `COT-${String(n).padStart(8, '0')}`;

// 4.1 Calcular presupuesto (costo compartido + costo por persona) y 4.2 aplicar comisión
function calcular({ pax, vuelo, hotel, noches, transportes, atracciones, viajeros }) {
  const habitaciones = hotel ? Math.ceil(pax / hotel.camas) : 0;
  const hospedaje = hotel ? hotel.precioNocheMXN * noches * habitaciones : 0;
  const compartidoTransp = transportes.filter((t) => t.modo === 'compartido').reduce((s, t) => s + t.precioMXN, 0);
  const compartido = hospedaje + compartidoTransp;

  const transpPersona = transportes.filter((t) => t.modo === 'persona').reduce((s, t) => s + t.precioMXN, 0);
  const atraccionesPersona = atracciones.reduce((s, a) => s + a.precioMXN, 0);
  const vueloPersona = vuelo ? vuelo.precioMXN : 0;
  const basePersona = vueloPersona + transpPersona + atraccionesPersona;

  const porViajero = viajeros.map((v) => {
    const gastos = v.gastos.reduce((s, g) => s + g.costoMXN, 0);
    return { idViajero: v.idViajero, nombre: v.nombre, gastos, total: basePersona + gastos + (pax ? compartido / pax : 0) };
  });
  const totalGastos = porViajero.reduce((s, v) => s + v.gastos, 0);

  const subtotal = compartido + basePersona * pax + totalGastos;
  const comision = subtotal * COMISION;
  return {
    habitaciones, hospedaje, compartidoTransp, compartido,
    vueloPersona, transpPersona, atraccionesPersona, basePersona,
    porViajero, totalGastos, subtotal, comision, total: subtotal + comision,
  };
}

/* ============================================================
   3. ESTILOS
   Paleta: tinta #0F1B2D · papel #EEF1F4 · señal (teal) #0E7C86
           ámbar #D98A1F (expiraciones y avisos) · rojo #B42318
   Tipografía: Bricolage Grotesque (títulos) + Figtree (texto)
   ============================================================ */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=Figtree:wght@400;500;600;700&display=swap');
  :root {
    --ink: #0F1B2D; --ink-2: #44546A; --ink-3: #7B8798;
    --paper: #EEF1F4; --card: #FFFFFF; --line: #DDE2E9;
    --signal: #0E7C86; --signal-d: #0A5F67; --signal-bg: #E3F3F4;
    --amber: #D98A1F; --amber-bg: #FDF1DC;
    --red: #B42318; --red-bg: #FDE8E6; --ok: #1E7B4A; --ok-bg: #E2F4EA;
    --r-lg: 14px; --r-md: 10px; --r-sm: 6px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--paper); color: var(--ink); font-family: 'Figtree', system-ui, sans-serif; font-size: 15px; line-height: 1.5; }
  h1, h2, h3, .display { font-family: 'Bricolage Grotesque', 'Figtree', sans-serif; letter-spacing: -0.01em; }
  button, input, select, textarea { font-family: inherit; font-size: inherit; color: inherit; }
  :focus-visible { outline: 3px solid rgba(14,124,134,.45); outline-offset: 2px; }

  /* ---------- Estructura de la app ---------- */
  .app { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: 248px; background: var(--ink); color: #fff; display: flex; flex-direction: column; flex-shrink: 0; }
  .brand { padding: 26px 24px 22px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 22px; }
  .brand small { display: block; font-family: 'Figtree', sans-serif; font-weight: 500; font-size: 12px; color: #9FB0C6; margin-top: 2px; }
  .nav { padding: 8px 12px; flex: 1; }
  .nav button { display: flex; width: 100%; align-items: center; gap: 12px; padding: 11px 14px; margin-bottom: 4px; border: 0; border-radius: var(--r-md); background: transparent; color: #C5D0DF; font-weight: 600; cursor: pointer; text-align: left; }
  .nav button:hover { background: rgba(255,255,255,.07); color: #fff; }
  .nav button.on { background: var(--signal); color: #fff; }
  .side-user { padding: 18px 24px; border-top: 1px solid rgba(255,255,255,.1); font-size: 13px; color: #9FB0C6; }
  .side-user b { display: block; color: #fff; font-size: 14px; }
  .btn-exit { margin-top: 10px; background: transparent; color: #F4B7B0; border: 1px solid rgba(244,183,176,.35); padding: 6px 12px; border-radius: var(--r-sm); cursor: pointer; font-weight: 600; }
  .btn-exit:hover { background: rgba(244,183,176,.12); }

  .main { flex: 1; overflow-y: auto; }
  .topbar { padding: 22px 36px 6px; display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
  .topbar h1 { font-size: 28px; font-weight: 700; }
  .content { padding: 18px 36px 48px; max-width: 1320px; }

  /* ---------- Componentes base ---------- */
  .card { background: var(--card); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 24px; margin-bottom: 20px; }
  .card-title { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 18px; }
  .card-sub { color: var(--ink-2); font-size: 13.5px; margin-top: 2px; }
  .card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
  .grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); }
  .grid-2 { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); align-items: start; }
  .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .field { margin-bottom: 16px; }
  .field label { display: block; font-weight: 600; font-size: 13px; color: var(--ink-2); margin-bottom: 6px; }
  .input { width: 100%; padding: 11px 12px; border: 1px solid #C9D1DB; border-radius: var(--r-md); background: #fff; }
  .input:focus { border-color: var(--signal); outline: none; box-shadow: 0 0 0 3px rgba(14,124,134,.15); }
  .hint { font-size: 12.5px; color: var(--ink-3); margin-top: 5px; }

  .btn { padding: 11px 18px; border: 0; border-radius: var(--r-md); font-weight: 700; cursor: pointer; transition: background .15s; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }
  .btn-primary { background: var(--signal); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--signal-d); }
  .btn-ghost { background: transparent; color: var(--ink-2); border: 1px solid #C9D1DB; }
  .btn-ghost:hover { background: #fff; }
  .btn-ok { background: var(--ok); color: #fff; }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-sm { padding: 7px 12px; font-size: 13px; }
  .actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; }

  .pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: var(--signal-bg); color: var(--signal-d); }
  .pill.amber { background: var(--amber-bg); color: #8A5300; }
  .pill.ok { background: var(--ok-bg); color: var(--ok); }
  .pill.red { background: var(--red-bg); color: var(--red); }
  .pill.gray { background: #E8ECF1; color: var(--ink-2); }

  .list-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid var(--line); }
  .list-item:last-child { border-bottom: 0; }
  .empty { padding: 22px; text-align: center; color: var(--ink-3); border: 1px dashed #C9D1DB; border-radius: var(--r-md); }
  .alert { padding: 11px 14px; border-radius: var(--r-md); font-size: 13.5px; margin-bottom: 14px; }
  .alert.warn { background: var(--amber-bg); color: #7A4A00; }
  .alert.err { background: var(--red-bg); color: var(--red); }
  .alert.info { background: var(--signal-bg); color: var(--signal-d); }
  .num { font-variant-numeric: tabular-nums; }

  /* ---------- Opciones seleccionables (vuelos, hoteles, atracciones) ---------- */
  .option { border: 1.5px solid var(--line); border-radius: var(--r-lg); padding: 16px; background: #fff; display: flex; flex-direction: column; gap: 8px; }
  .option.picked { border-color: var(--signal); background: var(--signal-bg); }
  .option .name { font-weight: 700; }
  .option .meta { font-size: 13px; color: var(--ink-2); }
  .option .price { font-family: 'Bricolage Grotesque', sans-serif; font-size: 22px; font-weight: 700; }
  .order-id { font-size: 12.5px; color: var(--signal-d); font-weight: 600; background: #fff; border-radius: var(--r-sm); padding: 6px 8px; }
  .toggle { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 12px 14px; border: 1.5px solid var(--line); border-radius: var(--r-md); margin-bottom: 10px; cursor: pointer; background: #fff; width: 100%; text-align: left; }
  .toggle.picked { border-color: var(--signal); background: var(--signal-bg); }
  .toggle small { display: block; color: var(--ink-2); }

  /* ---------- Asistente (wizard) ---------- */
  .wizard { display: grid; grid-template-columns: 230px minmax(0, 1fr) 290px; gap: 24px; align-items: start; }
  .rail { position: sticky; top: 12px; }
  .rail-step { position: relative; padding: 0 0 18px 34px; color: var(--ink-3); }
  .rail-step::before { content: ''; position: absolute; left: 11px; top: 24px; bottom: 0; width: 2px; background: var(--line); }
  .rail-step:last-child::before { display: none; }
  .rail-dot { position: absolute; left: 0; top: 0; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 2px solid #C9D1DB; display: grid; place-items: center; font-size: 12px; font-weight: 700; }
  .rail-step.now { color: var(--ink); }
  .rail-step.now .rail-dot { background: var(--signal); border-color: var(--signal); color: #fff; }
  .rail-step.done { color: var(--ink-2); }
  .rail-step.done .rail-dot { background: var(--ok); border-color: var(--ok); color: #fff; }
  .rail-step.done::before { background: var(--ok); }
  .rail-title { font-weight: 700; font-size: 14px; line-height: 24px; }
  .rail-subs { list-style: none; margin-top: 4px; }
  .rail-subs li { font-size: 12.5px; padding: 2px 0; display: flex; gap: 6px; color: var(--ink-3); }
  .rail-subs li.ok { color: var(--ok); }
  .rail-subs li.cur { color: var(--signal-d); font-weight: 700; }

  .live { position: sticky; top: 12px; }
  .live h3 { font-size: 16px; margin-bottom: 12px; }
  .live-line { display: flex; justify-content: space-between; gap: 10px; font-size: 13.5px; padding: 5px 0; color: var(--ink-2); }
  .live-total { margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--ink); display: flex; justify-content: space-between; align-items: baseline; }
  .live-total b { font-family: 'Bricolage Grotesque', sans-serif; font-size: 24px; }

  /* ---------- Itinerario ---------- */
  .day { border: 1px solid var(--line); border-radius: var(--r-md); padding: 14px; margin-bottom: 12px; background: #FAFBFC; }
  .day-head { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 8px; }
  .act { display: flex; gap: 12px; align-items: center; padding: 6px 0; font-size: 14px; }
  .act time { font-weight: 700; min-width: 52px; color: var(--signal-d); }
  .act-form { display: grid; grid-template-columns: 110px 1fr auto; gap: 8px; margin-top: 8px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .chip { border: 1px solid #C9D1DB; background: #fff; border-radius: 999px; padding: 3px 10px; font-size: 12px; cursor: pointer; }
  .chip:hover { border-color: var(--signal); color: var(--signal-d); }
  .x { border: 0; background: transparent; color: var(--ink-3); cursor: pointer; font-size: 16px; margin-left: auto; }
  .x:hover { color: var(--red); }

  /* ---------- Cotización: boarding pass ---------- */
  .ticket { display: grid; grid-template-columns: minmax(0, 1fr) 220px; background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; margin-bottom: 20px; }
  .ticket-main { padding: 28px 30px; }
  .ticket-stub { background: var(--ink); color: #fff; padding: 28px 22px; border-left: 2px dashed #8CA0B8; position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; }
  .ticket-stub::before, .ticket-stub::after { content: ''; position: absolute; left: -11px; width: 20px; height: 20px; border-radius: 50%; background: var(--paper); }
  .ticket-stub::before { top: -10px; } .ticket-stub::after { bottom: -10px; }
  .route { display: flex; align-items: center; gap: 14px; font-family: 'Bricolage Grotesque', sans-serif; font-size: 34px; font-weight: 800; line-height: 1.1; }
  .route i { flex: 1; height: 2px; background: repeating-linear-gradient(90deg, var(--ink-3) 0 6px, transparent 6px 12px); min-width: 30px; }
  .t-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-top: 22px; }
  .t-label { font-size: 12px; color: var(--ink-3); font-weight: 600; }
  .t-val { font-weight: 700; }
  .stub-total { font-family: 'Bricolage Grotesque', sans-serif; font-size: 30px; font-weight: 800; line-height: 1.1; }
  .stub small { color: #9FB0C6; display: block; }

  .tbl { width: 100%; border-collapse: collapse; font-size: 14px; }
  .tbl th { text-align: left; font-size: 12.5px; color: var(--ink-3); font-weight: 600; padding: 8px 6px; border-bottom: 1px solid var(--line); }
  .tbl td { padding: 10px 6px; border-bottom: 1px solid var(--line); }
  .tbl td.r, .tbl th.r { text-align: right; }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .stat { background: #fff; border: 1px solid var(--line); border-radius: var(--r-lg); padding: 18px 20px; }
  .stat b { display: block; font-family: 'Bricolage Grotesque', sans-serif; font-size: 30px; }
  .stat span { color: var(--ink-2); font-size: 13.5px; }

  /* ---------- Login ---------- */
  .login { min-height: 100vh; display: grid; grid-template-columns: 1.1fr 1fr; }
  .login-art { background: var(--ink); color: #fff; padding: 56px; display: flex; flex-direction: column; justify-content: space-between; }
  .login-art h1 { font-size: 46px; line-height: 1.05; font-weight: 800; max-width: 460px; }
  .login-art p { color: #9FB0C6; max-width: 420px; }
  .login-form { display: grid; place-items: center; padding: 32px; }
  .login-card { width: 100%; max-width: 380px; }
  .quick { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }

  @media (max-width: 1180px) { .wizard { grid-template-columns: 200px minmax(0,1fr); } .live { grid-column: 1 / -1; position: static; } }
  @media (max-width: 820px) {
    .app { flex-direction: column; height: auto; overflow: visible; }
    .sidebar { width: 100%; } .main { overflow: visible; }
    .wizard { grid-template-columns: 1fr; } .rail { position: static; }
    .row, .row-3 { grid-template-columns: 1fr; }
    .ticket { grid-template-columns: 1fr; } .ticket-stub { border-left: 0; border-top: 2px dashed #8CA0B8; }
    .login { grid-template-columns: 1fr; } .login-art { display: none; }
    .content, .topbar { padding-left: 18px; padding-right: 18px; }
  }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  @media print {
    body * { visibility: hidden; }
    .print-area, .print-area * { visibility: visible; }
    .print-area { position: absolute; left: 0; top: 0; width: 100%; }
    .app { display: block; height: auto; overflow: visible; } .main { overflow: visible; }
  }
`;

/* ============================================================
   4. COMPONENTES COMPARTIDOS
   ============================================================ */
const ESTADO_PLAN = {
  borrador: ['gray', 'Borrador'], cotizado: ['', 'Cotizado'], enviado: ['amber', 'Enviado al cliente'],
  aceptado: ['amber', 'Aceptado · pago pendiente'], confirmado: ['ok', 'Confirmado'], cancelado: ['red', 'Cancelado'],
};
const EstadoPill = ({ estado }) => {
  const [cls, txt] = ESTADO_PLAN[estado] || ['gray', estado];
  return <span className={`pill ${cls}`}>{txt}</span>;
};

// Cotización con formato de pase de abordar (PDF de la cotización final)
function QuoteTicket({ cot }) {
  return (
    <div className="ticket print-area">
      <div className="ticket-main">
        <div className="t-label">Cotización para {cot.cliente.nombre}</div>
        <div className="route"><span>{cot.origen}</span><i /><span>{cot.destino}</span></div>
        <div className="t-grid">
          <div><div className="t-label">Salida</div><div className="t-val">{fechaLarga(cot.fechaInicio)}</div></div>
          <div><div className="t-label">Regreso</div><div className="t-val">{fechaLarga(cot.fechaFin)}</div></div>
          <div><div className="t-label">Viajeros · Noches</div><div className="t-val">{cot.viajeros.length} · {cot.noches}</div></div>
          <div><div className="t-label">Vuelo</div><div className="t-val">{cot.vuelo.aerolinea}</div><div className="t-label">{cot.vuelo.orderId} ({cot.vuelo.estado})</div></div>
          <div><div className="t-label">Hospedaje</div><div className="t-val">{cot.hotel.nombre}</div><div className="t-label">{cot.hotel.orderId} ({cot.hotel.estado})</div></div>
          <div><div className="t-label">Apartados vencen</div><div className="t-val">{fechaLarga(cot.vuelo.fechaExpiracion)}</div></div>
        </div>
        <table className="tbl" style={{ marginTop: 22 }}>
          <tbody>
            <tr><td>Costo compartido (hospedaje y traslados del grupo)</td><td className="r num">{fmt(cot.calc.compartido)}</td></tr>
            <tr><td>Costo individual × {cot.viajeros.length} (vuelo, transporte, atracciones)</td><td className="r num">{fmt(cot.calc.basePersona * cot.viajeros.length)}</td></tr>
            <tr><td>Gastos extras</td><td className="r num">{fmt(cot.calc.totalGastos)}</td></tr>
            <tr><td>Comisión de la agencia (10%)</td><td className="r num">{fmt(cot.calc.comision)}</td></tr>
          </tbody>
        </table>
      </div>
      <div className="ticket-stub">
        <div><small>Folio</small><b>{cot.folio}</b></div>
        <div><small>Total a pagar</small><div className="stub-total num">{fmt(cot.calc.total)}</div><small>MXN</small></div>
        <div><small>Estado del plan</small><EstadoPill estado={cot.estadoPlan} />
          {cot.pago && <small style={{ marginTop: 8 }}>Pago: {cot.pago.metodo} ({cot.pago.estado})</small>}</div>
      </div>
    </div>
  );
}

/* ============================================================
   5. LOGIN Y ADMINISTRACIÓN
   ============================================================ */
function LoginScreen({ onLogin, usuarios }) {
  const [email, setEmail] = useState('agente@travelpro.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const u = usuarios.find((x) => x.email === email.trim() && x.password === password);
    if (u) onLogin(u); else setError('Correo o contraseña incorrectos.');
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="login">
        <div className="login-art">
          <div className="display" style={{ fontSize: 24, fontWeight: 800 }}>TravelPro</div>
          <div>
            <h1>De la solicitud al presupuesto, en cuatro pasos.</h1>
            <p style={{ marginTop: 16 }}>Apartas vuelos y hospedaje en Amadeus, armas el itinerario y envías la cotización al cliente.</p>
          </div>
          <p style={{ fontSize: 13 }}>Ingeniería de Software · Equipo 9</p>
        </div>
        <div className="login-form">
          <form className="login-card" onSubmit={submit}>
            <h2 style={{ fontSize: 28, marginBottom: 4 }}>Iniciar sesión</h2>
            <p style={{ color: 'var(--ink-2)', marginBottom: 22 }}>Portal para agencias de viajes</p>
            <div className="field"><label htmlFor="em">Correo</label>
              <input id="em" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label htmlFor="pw">Contraseña</label>
              <input id="pw" className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            {error && <div className="alert err">{error}</div>}
            <button className="btn btn-primary" style={{ width: '100%' }} type="submit">Entrar</button>
            <div className="quick">
              <span className="hint" style={{ width: '100%', marginTop: 0 }}>Cuentas de prueba (contraseña 123):</span>
              {usuarios.slice(0, 3).map((u) => (
                <button key={u.id} type="button" className="chip" onClick={() => { setEmail(u.email); setPassword('123'); }}>{u.rol}</button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function AdminUsersModule({ user, usuarios, setUsuarios }) {
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'agente' });
  const [msg, setMsg] = useState(null);

  const crear = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) return setMsg({ t: 'err', s: 'Escribe nombre y correo.' });
    if (usuarios.some((u) => u.email === form.email.trim())) return setMsg({ t: 'err', s: 'Ya existe un usuario con ese correo.' });
    setUsuarios([...usuarios, { id: Date.now(), ...form, email: form.email.trim(), password: '123', creadoPor: user.id }]);
    setForm({ nombre: '', email: '', rol: 'agente' });
    setMsg({ t: 'info', s: 'Usuario creado. Su contraseña inicial es 123.' });
  };
  const subordinados = usuarios.filter((u) => u.creadoPor === user.id);

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-head"><div><div className="card-title">Dar de alta usuario</div>
          <div className="card-sub">Solo puedes crear roles por debajo del tuyo.</div></div></div>
        {msg && <div className={`alert ${msg.t}`}>{msg.s}</div>}
        <form onSubmit={crear}>
          <div className="field"><label>Nombre</label>
            <input className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
          <div className="field"><label>Correo</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Rol</label>
            <select className="input" value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              {user.rol === 'gerente' && <option value="gerente">Gerente</option>}
              {(user.rol === 'gerente' || user.rol === 'jefe') && <option value="jefe">Jefe de equipo</option>}
              <option value="agente">Agente de viajes</option>
            </select></div>
          <button className="btn btn-primary" type="submit">Crear usuario</button>
        </form>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Mis subordinados</div></div>
        {subordinados.length === 0 && <div className="empty">Aún no has dado de alta a nadie.</div>}
        {subordinados.map((u) => (
          <div key={u.id} className="list-item">
            <div><b>{u.nombre}</b><div className="hint">{u.email}</div></div>
            <span className="pill">{u.rol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentClientModule({ user, clientes, setClientes }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const [error, setError] = useState('');

  const crear = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setError('El nombre es obligatorio.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Escribe un correo válido.');
    if (clientes.some((c) => c.email === form.email)) return setError('Ya hay un cliente con ese correo.');
    setClientes([...clientes, { idCliente: Date.now(), ...form, idAgente: user.id }]);
    setForm({ nombre: '', email: '', telefono: '' });
    setError('');
  };
  const mios = clientes.filter((c) => c.idAgente === user.id);

  return (
    <div className="grid-2">
      <div className="card">
        <div className="card-head"><div className="card-title">Nuevo cliente</div></div>
        {error && <div className="alert err">{error}</div>}
        <form onSubmit={crear}>
          <div className="field"><label>Nombre completo</label>
            <input className="input" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
          <div className="field"><label>Correo</label>
            <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Teléfono (opcional)</label>
            <input className="input" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></div>
          <button className="btn btn-primary" type="submit">Registrar cliente</button>
        </form>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Mis clientes ({mios.length})</div></div>
        {mios.length === 0 && <div className="empty">Registra a tu primer cliente para poder cotizar.</div>}
        {mios.map((c) => (
          <div key={c.idCliente} className="list-item">
            <div><b>{c.nombre}</b><div className="hint">{c.telefono || 'Sin teléfono'}</div></div>
            <span className="hint">{c.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   6. FLUJO DE COTIZACIÓN (los 4 procesos del DFD Nivel 1)
   ============================================================ */
function Rail({ step, subDone }) {
  const cur = subDone.findIndex((d) => !d);
  return (
    <nav className="rail card" aria-label="Pasos de la cotización" style={{ padding: 20 }}>
      {PASOS.map((p) => {
        const state = step > p.n ? 'done' : step === p.n ? 'now' : '';
        return (
          <div key={p.n} className={`rail-step ${state}`}>
            <div className="rail-dot">{state === 'done' ? '✓' : p.n}</div>
            <div className="rail-title">{p.titulo}</div>
            {step === p.n && (
              <ul className="rail-subs">
                {p.subs.map((s, i) => (
                  <li key={s} className={subDone[i] ? 'ok' : i === cur ? 'cur' : ''}>
                    <span>{subDone[i] ? '✓' : '•'}</span><span>{p.n}.{i + 1} {s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function LiveSummary({ c, pax, plan }) {
  return (
    <aside className="card live" aria-label="Presupuesto en vivo">
      <h3>Presupuesto en vivo</h3>
      <div className="live-line"><span>Vuelos ({pax} pax)</span><span className="num">{fmt(c.vueloPersona * pax)}</span></div>
      <div className="live-line"><span>Hospedaje ({c.habitaciones || 0} hab. × {plan.noches} n.)</span><span className="num">{fmt(c.hospedaje)}</span></div>
      <div className="live-line"><span>Transporte</span><span className="num">{fmt(c.transpPersona * pax + c.compartidoTransp)}</span></div>
      <div className="live-line"><span>Atracciones</span><span className="num">{fmt(c.atraccionesPersona * pax)}</span></div>
      <div className="live-line"><span>Gastos extras</span><span className="num">{fmt(c.totalGastos)}</span></div>
      <div className="live-line"><span>Comisión (10%)</span><span className="num">{fmt(c.comision)}</span></div>
      <div className="live-total"><span>Total</span><b className="num">{fmt(c.total)}</b></div>
    </aside>
  );
}

function QuoteWizardModule({ user, clientes, nextFolio, onSave, onUpdate, onNew, goTo }) {
  const misClientes = clientes.filter((c) => c.idAgente === user.id);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  // Paso 1 · Solicitud de viaje (flujo "Solicitud de Viaje" del diccionario de datos)
  const [plan, setPlan] = useState({
    idCliente: '', origen: 'Ciudad de México', destino: '', pais: 'Francia',
    fechaInicio: sumarDias(hoy(), 30), noches: 5, numViajeros: 2,
  });
  const [buscado, setBuscado] = useState(false);
  const [vuelo, setVuelo] = useState(null);
  const [hotel, setHotel] = useState(null);
  // Paso 2
  const [atracciones, setAtracciones] = useState([]);
  const [transportes, setTransportes] = useState([]);
  // Paso 3
  const [viajeros, setViajeros] = useState([]);
  const [itinerario, setItinerario] = useState([]);
  // Paso 4
  const [cot, setCot] = useState(null);
  const [pagando, setPagando] = useState(false);
  const [metodo, setMetodo] = useState('Tarjeta');

  if (misClientes.length === 0) {
    return (
      <div className="card empty">
        <b>Todavía no tienes clientes.</b>
        <p style={{ margin: '6px 0 14px' }}>Cada cotización se hace para un cliente registrado.</p>
        <button className="btn btn-primary" onClick={() => goTo('clientes')}>Registrar un cliente</button>
      </div>
    );
  }

  const cliente = misClientes.find((c) => c.idCliente === Number(plan.idCliente));
  const fechaFin = sumarDias(plan.fechaInicio, plan.noches);
  const dias = plan.noches + 1;
  const pax = viajeros.length || plan.numViajeros;
  const internacional = plan.pais !== 'México';
  const calc = calcular({ pax, vuelo, hotel, noches: plan.noches, transportes, atracciones, viajeros });

  const setCampo = (campo, valor) => {
    // Cambiar de país invalida lo apartado en Amadeus (se libera)
    if (campo === 'pais') { setVuelo(null); setHotel(null); setAtracciones([]); setBuscado(false); setItinerario([]); }
    setPlan({ ...plan, [campo]: valor });
  };
  const alternar = (lista, setLista, item, clave) =>
    setLista(lista.some((x) => x[clave] === item[clave]) ? lista.filter((x) => x[clave] !== item[clave]) : [...lista, item]);

  // ---- 1.2 y 1.4: apartar en Amadeus (el apartado vence en 2 días)
  const apartarVuelo = (v) => setVuelo({ ...v, orderId: nuevoOrderId('V'), fechaExpiracion: sumarDias(hoy(), 2), estado: 'apartado' });
  const apartarHotel = (h) => setHotel({ ...h, orderId: nuevoOrderId('H'), fechaExpiracion: sumarDias(hoy(), 2), estado: 'apartado' });

  const irPaso2 = () => {
    if (!cliente) return setError('Selecciona un cliente.');
    if (!plan.origen.trim() || !plan.destino.trim()) return setError('Escribe la ciudad de origen y la de destino.');
    if (!plan.fechaInicio || plan.fechaInicio < hoy()) return setError('La fecha de inicio no puede ser anterior a hoy.');
    if (!buscado) return setError('Presiona "Buscar vuelos y hospedajes" para continuar.');
    if (!vuelo) return setError('Aparta un vuelo (paso 1.2).');
    if (!hotel) return setError('Aparta un hospedaje (paso 1.4).');
    setError('');
    // Sincroniza la lista de viajeros con la cantidad indicada en la solicitud
    setViajeros((prev) => Array.from({ length: plan.numViajeros }, (_, i) =>
      prev[i] || { idViajero: Date.now() + i, nombre: '', email: '', pasaporteVigente: false, gastos: [] }));
    setStep(2);
  };
  const irPaso3 = () => {
    if (atracciones.length === 0) return setError('Selecciona al menos una atracción (paso 2.2).');
    if (transportes.length === 0) return setError('Selecciona al menos un transporte (paso 2.4).');
    setError(''); setStep(3);
  };
  const irPaso4 = () => {
    if (viajeros.some((v) => !v.nombre.trim())) return setError('Escribe el nombre de cada viajero.');
    if (itinerario.length === 0) return setError('Agrega al menos una actividad al itinerario (paso 3.1).');
    setError(''); setStep(4);
  };

  // ---- 3.1 Itinerario
  const autoItinerario = () => {
    const base = [
      { dia: 1, hora: '08:00', notas: `Vuelo ${vuelo.aerolinea} a ${plan.destino}` },
      { dia: 1, hora: '15:00', notas: `Check-in en ${hotel.nombre}` },
    ];
    atracciones.forEach((a, i) => base.push({ dia: 2 + (i % Math.max(dias - 1, 1)), hora: '10:00', notas: `Visita: ${a.nombre}` }));
    base.push({ dia: dias, hora: '10:00', notas: 'Check-out y regreso' });
    setItinerario(base.map((x, i) => ({ ...x, id: Date.now() + i })));
  };
  const agregarActividad = (dia, hora, notas) =>
    setItinerario([...itinerario, { id: Date.now(), dia, hora: hora || '09:00', notas }]);

  // ---- 3.2 Viajeros y gastos extras
  const editarViajero = (id, patch) => setViajeros(viajeros.map((v) => (v.idViajero === id ? { ...v, ...patch } : v)));
  const alternarGasto = (v, g) => editarViajero(v.idViajero, {
    gastos: v.gastos.some((x) => x.tipo === g.tipo) ? v.gastos.filter((x) => x.tipo !== g.tipo) : [...v.gastos, g],
  });

  // ---- 4.3 Generar PDF y enviarlo al cliente
  const generarYEnviar = () => {
    const folio = folioCot(nextFolio);
    const nueva = {
      idCotizacion: nextFolio, folio, fechaGeneracion: hoy(), idAgente: user.id, cliente,
      origen: plan.origen, destino: plan.destino, pais: plan.pais, fechaInicio: plan.fechaInicio, fechaFin,
      noches: plan.noches, viajeros, vuelo, hotel, transportes, atracciones, itinerario, calc,
      rutaPDF: `/cotizaciones/${folio}.pdf`, estadoPlan: 'enviado', pago: null,
    };
    setCot(nueva); onSave(nueva);
  };

  // ---- 4.4 Respuesta del cliente
  const aceptar = () => {
    const aprobado = metodo === 'Tarjeta';
    const estadoRes = aprobado ? 'pagado' : 'apartado';
    const patch = {
      estadoPlan: aprobado ? 'confirmado' : 'aceptado',
      vuelo: { ...cot.vuelo, estado: estadoRes }, hotel: { ...cot.hotel, estado: estadoRes },
      pago: { idPago: cot.idCotizacion, metodo, monto: cot.calc.total, estado: aprobado ? 'aprobado' : 'pendiente', fecha: hoy() },
    };
    setCot({ ...cot, ...patch }); onUpdate(cot.idCotizacion, patch); setPagando(false);
  };
  const rechazar = () => {
    const patch = { estadoPlan: 'cancelado', vuelo: { ...cot.vuelo, estado: 'liberado' }, hotel: { ...cot.hotel, estado: 'liberado' } };
    setCot({ ...cot, ...patch }); onUpdate(cot.idCotizacion, patch);
  };

  const respondido = cot && (cot.estadoPlan === 'confirmado' || cot.estadoPlan === 'aceptado' || cot.estadoPlan === 'cancelado');
  const viajerosOk = viajeros.length > 0 && viajeros.every((v) => v.nombre.trim());
  const subDone = [
    [buscado, !!vuelo, !!vuelo, !!hotel],
    [true, atracciones.length > 0, true, transportes.length > 0],
    [itinerario.length > 0, viajerosOk],
    [true, true, !!cot, respondido],
  ][step - 1].map(Boolean);

  return (
    <div className="wizard">
      <Rail step={step} subDone={subDone} />

      <div>
        {error && <div className="alert err" role="alert">{error}</div>}

        {/* ===== PASO 1: REGISTRAR SOLICITUD (1.1 – 1.4) ===== */}
        {step === 1 && (
          <>
            <div className="card">
              <div className="card-head"><div><div className="card-title">Solicitud de viaje</div>
                <div className="card-sub">Datos básicos para buscar en Amadeus.</div></div></div>
              <div className="row">
                <div className="field"><label>Cliente</label>
                  <select className="input" value={plan.idCliente} onChange={(e) => setCampo('idCliente', e.target.value)}>
                    <option value="">Selecciona un cliente…</option>
                    {misClientes.map((c) => <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>)}
                  </select></div>
                <div className="field"><label>País de destino</label>
                  <select className="input" value={plan.pais} onChange={(e) => setCampo('pais', e.target.value)}>
                    {PAISES.map((p) => <option key={p}>{p}</option>)}
                  </select></div>
              </div>
              <div className="row">
                <div className="field"><label>Ciudad de origen</label>
                  <input className="input" value={plan.origen} onChange={(e) => setCampo('origen', e.target.value)} /></div>
                <div className="field"><label>Ciudad de destino</label>
                  <input className="input" placeholder="Ej. París" value={plan.destino} onChange={(e) => setCampo('destino', e.target.value)} /></div>
              </div>
              <div className="row-3">
                <div className="field"><label>Fecha de inicio</label>
                  <input className="input" type="date" min={hoy()} value={plan.fechaInicio} onChange={(e) => setCampo('fechaInicio', e.target.value)} /></div>
                <div className="field"><label>Noches</label>
                  <input className="input" type="number" min="1" max="60" value={plan.noches}
                    onChange={(e) => setCampo('noches', Math.min(60, Math.max(1, Number(e.target.value) || 1)))} />
                  <div className="hint">Regreso: {fechaLarga(fechaFin)}</div></div>
                <div className="field"><label>Viajeros</label>
                  <input className="input" type="number" min="1" max="20" value={plan.numViajeros}
                    onChange={(e) => setCampo('numViajeros', Math.min(20, Math.max(1, Number(e.target.value) || 1)))} /></div>
              </div>
              <button className="btn btn-primary" onClick={() => { setBuscado(true); setError(''); }}>Buscar vuelos y hospedajes</button>
            </div>

            {buscado && (
              <div className="card">
                <div className="card-head"><div><div className="card-title">1.1 · 1.2 Vuelos a {plan.pais}</div>
                  <div className="card-sub">Al apartar, Amadeus entrega un Order ID y el apartado vence en 2 días.</div></div></div>
                <div className="grid">
                  {AMADEUS_VUELOS.filter((v) => v.pais === plan.pais).map((v) => {
                    const elegido = vuelo?.idVuelo === v.idVuelo;
                    return (
                      <div key={v.idVuelo} className={`option ${elegido ? 'picked' : ''}`}>
                        <div className="name">{v.aerolinea}</div>
                        <div className="meta">{v.duracion} · {v.escalas === 0 ? 'Directo' : `${v.escalas} escala`}</div>
                        <div className="price num">{fmt(v.precioMXN)} <span className="meta">por persona</span></div>
                        {elegido ? (
                          <>
                            <div className="order-id">Order ID {vuelo.orderId} · vence {fechaLarga(vuelo.fechaExpiracion)}</div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setVuelo(null)}>Liberar y cambiar</button>
                          </>
                        ) : <button className="btn btn-primary btn-sm" onClick={() => apartarVuelo(v)}>Apartar vuelo</button>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {buscado && vuelo && (
              <div className="card">
                <div className="card-head"><div><div className="card-title">1.3 · 1.4 Hospedajes en {plan.pais}</div>
                  <div className="card-sub">Se calcula una habitación por cada grupo que cabe en las camas del hotel.</div></div></div>
                <div className="grid">
                  {AMADEUS_HOSPEDAJES.filter((h) => h.pais === plan.pais).map((h) => {
                    const elegido = hotel?.idHotel === h.idHotel;
                    return (
                      <div key={h.idHotel} className={`option ${elegido ? 'picked' : ''}`}>
                        <div className="name">{h.nombre}</div>
                        <div className="meta">{h.camas} camas por habitación · {Math.ceil(plan.numViajeros / h.camas)} hab. para {plan.numViajeros} viajero(s)</div>
                        <div className="price num">{fmt(h.precioNocheMXN)} <span className="meta">por noche</span></div>
                        {elegido ? (
                          <>
                            <div className="order-id">Order ID {hotel.orderId} · vence {fechaLarga(hotel.fechaExpiracion)}</div>
                            <button className="btn btn-ghost btn-sm" onClick={() => setHotel(null)}>Liberar y cambiar</button>
                          </>
                        ) : <button className="btn btn-primary btn-sm" onClick={() => apartarHotel(h)}>Apartar hospedaje</button>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="actions"><button className="btn btn-primary" onClick={irPaso2}>Continuar a atracciones y transporte</button></div>
          </>
        )}

        {/* ===== PASO 2: ATRACCIONES Y TRANSPORTE (2.1 – 2.4) ===== */}
        {step === 2 && (
          <>
            <div className="grid-2">
              <div className="card">
                <div className="card-head"><div><div className="card-title">2.1 · 2.2 Atracciones en {plan.pais}</div>
                  <div className="card-sub">Costo por persona. Elige las que quiera el cliente.</div></div></div>
                {ATRACCIONES_DB.filter((a) => a.pais === plan.pais).map((a) => {
                  const on = atracciones.some((x) => x.idAtraccion === a.idAtraccion);
                  return (
                    <button key={a.idAtraccion} className={`toggle ${on ? 'picked' : ''}`} aria-pressed={on}
                      onClick={() => alternar(atracciones, setAtracciones, a, 'idAtraccion')}>
                      <span><b>{a.nombre}</b></span><span className="num">{a.precioMXN === 0 ? 'Gratis' : fmt(a.precioMXN)} {on && '✓'}</span>
                    </button>
                  );
                })}
              </div>
              <div className="card">
                <div className="card-head"><div><div className="card-title">2.3 · 2.4 Transporte local</div>
                  <div className="card-sub">El taxi se cobra una vez para todo el grupo.</div></div></div>
                {TRANSPORTE_DB.map((t) => {
                  const on = transportes.some((x) => x.idTransporte === t.idTransporte);
                  return (
                    <button key={t.idTransporte} className={`toggle ${on ? 'picked' : ''}`} aria-pressed={on}
                      onClick={() => alternar(transportes, setTransportes, t, 'idTransporte')}>
                      <span><b>{t.tipo}</b><small>{t.modo === 'persona' ? 'Por persona' : 'Compartido por el grupo'}</small></span>
                      <span className="num">{fmt(t.precioMXN)} {on && '✓'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-ghost" onClick={() => { setError(''); setStep(1); }}>Volver</button>
              <button className="btn btn-primary" onClick={irPaso3}>Continuar a itinerario y viajeros</button>
            </div>
          </>
        )}

        {/* ===== PASO 3: ITINERARIO Y VIAJEROS (3.1 – 3.2) ===== */}
        {step === 3 && (
          <>
            <div className="card">
              <div className="card-head">
                <div><div className="card-title">3.1 Itinerario por día</div><div className="card-sub">{dias} días · del {fechaLarga(plan.fechaInicio)} al {fechaLarga(fechaFin)}</div></div>
                <button className="btn btn-ghost btn-sm" onClick={autoItinerario}>Generar borrador</button>
              </div>
              {Array.from({ length: dias }, (_, i) => i + 1).map((d) => (
                <DiaItinerario key={d} dia={d} fecha={sumarDias(plan.fechaInicio, d - 1)}
                  items={itinerario.filter((x) => x.dia === d).sort((a, b) => a.hora.localeCompare(b.hora))}
                  atracciones={atracciones} onAdd={agregarActividad}
                  onRemove={(id) => setItinerario(itinerario.filter((x) => x.id !== id))} />
              ))}
            </div>

            <div className="card">
              <div className="card-head"><div><div className="card-title">3.2 Viajeros y gastos extras</div>
                <div className="card-sub">Cada gasto extra se cobra al viajero que lo necesita.</div></div></div>
              {internacional && <div className="alert info">Viaje internacional: confirma que cada viajero tenga pasaporte vigente.</div>}
              {viajeros.map((v, i) => (
                <div key={v.idViajero} className="day">
                  <div className="row">
                    <div className="field"><label>Viajero {i + 1}</label>
                      <input className="input" placeholder="Nombre completo" value={v.nombre} onChange={(e) => editarViajero(v.idViajero, { nombre: e.target.value })} /></div>
                    <div className="field"><label>Correo (opcional)</label>
                      <input className="input" value={v.email} onChange={(e) => editarViajero(v.idViajero, { email: e.target.value })} /></div>
                  </div>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
                    <input type="checkbox" checked={v.pasaporteVigente} onChange={(e) => editarViajero(v.idViajero, { pasaporteVigente: e.target.checked })} />
                    Pasaporte vigente
                  </label>
                  {internacional && !v.pasaporteVigente && <div className="hint" style={{ color: '#8A5300' }}>Sin pasaporte vigente no podrá viajar.</div>}
                  <div className="chips">
                    {GASTOS_DB.map((g) => {
                      const on = v.gastos.some((x) => x.tipo === g.tipo);
                      return <button key={g.tipo} className="chip" aria-pressed={on} onClick={() => alternarGasto(v, g)}
                        style={on ? { background: 'var(--signal-bg)', borderColor: 'var(--signal)' } : null}>
                        {on ? '✓ ' : '+ '}{g.tipo} · {fmt(g.costoMXN)}</button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-ghost" onClick={() => { setError(''); setStep(2); }}>Volver</button>
              <button className="btn btn-primary" onClick={irPaso4}>Calcular presupuesto</button>
            </div>
          </>
        )}

        {/* ===== PASO 4: PRESUPUESTO Y CONFIRMACIÓN (4.1 – 4.4) ===== */}
        {step === 4 && (
          <>
            {!cot && (
              <>
                <div className="card">
                  <div className="card-head"><div><div className="card-title">4.1 Presupuesto</div>
                    <div className="card-sub">Costo compartido del grupo y costo por persona.</div></div></div>
                  <div className="list-item"><span>Costo compartido (hospedaje: {calc.habitaciones} hab. × {plan.noches} noches{calc.compartidoTransp ? ' + taxi' : ''})</span><b className="num">{fmt(calc.compartido)}</b></div>
                  <table className="tbl" style={{ marginTop: 12 }}>
                    <thead><tr><th>Viajero</th><th className="r">Vuelo + transporte + atracciones</th><th className="r">Extras</th><th className="r">Parte del compartido</th><th className="r">Total persona</th></tr></thead>
                    <tbody>
                      {calc.porViajero.map((v) => (
                        <tr key={v.idViajero}><td>{v.nombre}</td><td className="r num">{fmt(calc.basePersona)}</td><td className="r num">{fmt(v.gastos)}</td>
                          <td className="r num">{fmt(calc.compartido / pax)}</td><td className="r num"><b>{fmt(v.total)}</b></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card">
                  <div className="card-head"><div className="card-title">4.2 Comisión de la agencia</div></div>
                  <div className="list-item"><span>Subtotal</span><b className="num">{fmt(calc.subtotal)}</b></div>
                  <div className="list-item"><span>Comisión (10%)</span><b className="num">{fmt(calc.comision)}</b></div>
                  <div className="list-item"><span><b>Total a pagar</b></span><b className="num" style={{ fontSize: 22 }}>{fmt(calc.total)}</b></div>
                </div>
                <div className="actions">
                  <button className="btn btn-ghost" onClick={() => { setError(''); setStep(3); }}>Volver</button>
                  <button className="btn btn-primary" onClick={generarYEnviar}>Generar PDF y enviar a {cliente?.nombre}</button>
                </div>
              </>
            )}

            {cot && (
              <>
                <QuoteTicket cot={cot} />
                <div className="card">
                  <div className="card-head"><div><div className="card-title">4.3 Cotización enviada</div>
                    <div className="card-sub">PDF {cot.rutaPDF} enviado a {cot.cliente.email}.</div></div>
                    <button className="btn btn-ghost btn-sm" onClick={() => window.print()}>Imprimir / guardar PDF</button></div>

                  {!respondido && !pagando && (
                    <>
                      <div className="alert warn">Los apartados vencen el {fechaLarga(cot.vuelo.fechaExpiracion)}. Registra la respuesta del cliente antes de esa fecha.</div>
                      <div className="card-title" style={{ fontSize: 16, marginBottom: 10 }}>4.4 Respuesta del cliente</div>
                      <div className="actions">
                        <button className="btn btn-ok" onClick={() => setPagando(true)}>El cliente acepta</button>
                        <button className="btn btn-danger" onClick={rechazar}>El cliente rechaza (liberar apartados)</button>
                      </div>
                    </>
                  )}

                  {pagando && (
                    <div style={{ maxWidth: 360 }}>
                      <div className="field"><label>Método de pago</label>
                        <select className="input" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                          <option>Tarjeta</option><option>Transferencia</option></select>
                        <div className="hint">Con tarjeta el pago se aprueba y se confirman los apartados. Con transferencia queda pendiente.</div></div>
                      <div className="actions">
                        <button className="btn btn-ok" onClick={aceptar}>Registrar pago de {fmt(cot.calc.total)}</button>
                        <button className="btn btn-ghost" onClick={() => setPagando(false)}>Cancelar</button>
                      </div>
                    </div>
                  )}

                  {respondido && (
                    <>
                      <div className={`alert ${cot.estadoPlan === 'cancelado' ? 'err' : 'info'}`}>
                        {cot.estadoPlan === 'cancelado' && 'Apartados liberados en Amadeus. La cotización quedó cancelada.'}
                        {cot.estadoPlan === 'confirmado' && 'Pago aprobado. Vuelo y hospedaje confirmados en Amadeus.'}
                        {cot.estadoPlan === 'aceptado' && 'Cotización aceptada. Los apartados siguen vigentes hasta recibir la transferencia.'}
                      </div>
                      <button className="btn btn-primary" onClick={onNew}>Nueva cotización</button>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <LiveSummary c={calc} pax={pax} plan={plan} />
    </div>
  );
}

function DiaItinerario({ dia, fecha, items, atracciones, onAdd, onRemove }) {
  const [hora, setHora] = useState('09:00');
  const [notas, setNotas] = useState('');
  const agregar = () => { if (notas.trim()) { onAdd(dia, hora, notas.trim()); setNotas(''); } };
  return (
    <div className="day">
      <div className="day-head"><span>Día {dia}</span><span style={{ color: 'var(--ink-3)', fontWeight: 500 }}>{fechaLarga(fecha)}</span></div>
      {items.length === 0 && <div className="hint">Sin actividades.</div>}
      {items.map((x) => (
        <div key={x.id} className="act"><time>{x.hora}</time><span>{x.notas}</span>
          <button className="x" aria-label="Quitar actividad" onClick={() => onRemove(x.id)}>×</button></div>
      ))}
      <div className="act-form">
        <input className="input" type="time" value={hora} onChange={(e) => setHora(e.target.value)} aria-label="Hora" />
        <input className="input" placeholder="Actividad o nota" value={notas} onChange={(e) => setNotas(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregar()} />
        <button className="btn btn-ghost btn-sm" onClick={agregar}>Agregar</button>
      </div>
      {atracciones.length > 0 && (
        <div className="chips">{atracciones.map((a) => (
          <button key={a.idAtraccion} className="chip" onClick={() => setNotas(`Visita: ${a.nombre}`)}>{a.nombre}</button>))}</div>
      )}
    </div>
  );
}

/* ============================================================
   7. COTIZACIONES GUARDADAS Y DASHBOARD
   ============================================================ */
function CotizacionesModule({ cotizaciones }) {
  const [abierta, setAbierta] = useState(null);
  const sel = cotizaciones.find((c) => c.idCotizacion === abierta);
  return (
    <>
      {sel && <><QuoteTicket cot={sel} /><button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => setAbierta(null)}>Cerrar detalle</button></>}
      <div className="card">
        <div className="card-head"><div className="card-title">Cotizaciones generadas</div></div>
        {cotizaciones.length === 0 && <div className="empty">Aún no hay cotizaciones enviadas.</div>}
        {cotizaciones.length > 0 && (
          <table className="tbl">
            <thead><tr><th>Folio</th><th>Cliente</th><th>Destino</th><th>Estado</th><th className="r">Total</th><th /></tr></thead>
            <tbody>
              {cotizaciones.map((c) => (
                <tr key={c.idCotizacion}><td>{c.folio}</td><td>{c.cliente.nombre}</td><td>{c.destino}, {c.pais}</td>
                  <td><EstadoPill estado={c.estadoPlan} /></td><td className="r num">{fmt(c.calc.total)}</td>
                  <td className="r"><button className="btn btn-ghost btn-sm" onClick={() => setAbierta(c.idCotizacion)}>Ver</button></td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Dashboard({ user, cotizaciones, goTo }) {
  const conf = cotizaciones.filter((c) => c.estadoPlan === 'confirmado');
  const pend = cotizaciones.filter((c) => c.estadoPlan === 'enviado' || c.estadoPlan === 'aceptado');
  const ventas = conf.reduce((s, c) => s + c.calc.total, 0);
  const comisiones = conf.reduce((s, c) => s + c.calc.comision, 0);
  return (
    <>
      <div className="stats">
        <div className="stat"><b>{cotizaciones.length}</b><span>Cotizaciones generadas</span></div>
        <div className="stat"><b>{pend.length}</b><span>Esperando al cliente</span></div>
        <div className="stat"><b className="num">{fmt(ventas)}</b><span>Ventas confirmadas</span></div>
        <div className="stat"><b className="num">{fmt(comisiones)}</b><span>Comisión ganada</span></div>
      </div>
      {user.rol === 'agente' && (
        <div className="card">
          <div className="card-title">¿Un nuevo viaje?</div>
          <p className="card-sub" style={{ margin: '4px 0 14px' }}>Registra la solicitud, aparta en Amadeus y envía la cotización.</p>
          <button className="btn btn-primary" onClick={() => goTo('cotizar')}>Cotizar viaje</button>
        </div>
      )}
    </>
  );
}

/* ============================================================
   8. APP PRINCIPAL
   ============================================================ */
const TITULOS = { dashboard: 'Panel de control', personal: 'Gestión de personal', clientes: 'Cartera de clientes', cotizar: 'Nueva cotización', cotizaciones: 'Cotizaciones' };

function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('dashboard');
  const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
  const [clientes, setClientes] = useState([{ idCliente: 1, nombre: 'Juan Pérez', email: 'j@e.com', telefono: '', idAgente: 3 }]);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [wizardKey, setWizardKey] = useState(0);

  if (!user) return <LoginScreen onLogin={(u) => { setUser(u); setTab('dashboard'); }} usuarios={usuarios} />;

  const visibles = user.rol === 'agente' ? cotizaciones.filter((c) => c.idAgente === user.id) : cotizaciones;
  const guardar = (c) => setCotizaciones((prev) => [...prev, c]);
  const actualizar = (id, patch) => setCotizaciones((prev) => prev.map((c) => (c.idCotizacion === id ? { ...c, ...patch } : c)));
  const nueva = () => { setWizardKey((k) => k + 1); setTab('cotizar'); };

  const menu = [
    ['dashboard', '▦', 'Panel'],
    ...(user.rol !== 'agente' ? [['personal', '☻', 'Personal']] : [['clientes', '☺', 'Clientes'], ['cotizar', '✈', 'Cotizar viaje']]),
    ['cotizaciones', '☰', 'Cotizaciones'],
  ];

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="brand">TravelPro<small>Portal de agencia</small></div>
          <nav className="nav">
            {menu.map(([id, ico, txt]) => (
              <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}><span aria-hidden>{ico}</span>{txt}</button>
            ))}
          </nav>
          <div className="side-user"><b>{user.nombre}</b>{user.rol}
            <div><button className="btn-exit" onClick={() => setUser(null)}>Cerrar sesión</button></div></div>
        </aside>

        <main className="main">
          <header className="topbar"><h1>{TITULOS[tab]}</h1></header>
          <div className="content">
            {tab === 'dashboard' && <Dashboard user={user} cotizaciones={visibles} goTo={setTab} />}
            {tab === 'personal' && <AdminUsersModule user={user} usuarios={usuarios} setUsuarios={setUsuarios} />}
            {tab === 'clientes' && <AgentClientModule user={user} clientes={clientes} setClientes={setClientes} />}
            {tab === 'cotizar' && (
              <QuoteWizardModule key={wizardKey} user={user} clientes={clientes} nextFolio={cotizaciones.length + 1}
                onSave={guardar} onUpdate={actualizar} onNew={nueva} goTo={setTab} />
            )}
            {tab === 'cotizaciones' && <CotizacionesModule cotizaciones={visibles} />}
          </div>
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);