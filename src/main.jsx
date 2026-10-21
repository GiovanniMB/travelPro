// main.jsx
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

/* ============================================================
   DATOS SIMULADOS (MOCK DATA)
   ============================================================ */
const USUARIOS = [
  { id: 1, nombre: 'Carlos Gerente', email: 'gerente@travelpro.com', password: '123', rol: 'gerente' },
  { id: 2, nombre: 'Laura Jefa', email: 'jefa@travelpro.com', password: '123', rol: 'jefe' },
  { id: 3, nombre: 'Misael Agente', email: 'agente@travelpro.com', password: '123', rol: 'agente' },
];

const CLIENTES = [
  { idCliente: 101, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '555-1234' },
  { idCliente: 102, nombre: 'María López', email: 'maria@email.com', telefono: '555-5678' },
];

// Simulación de catálogo de Amadeus
const AMADEUS_VUELOS = [
  { idVuelo: 'AM-V1', aerolinea: 'Iberia', precioMXN: 13790, duracionIda: '15h 35m', escalas: 1, requiereVisa: false },
  { idVuelo: 'AM-V2', aerolinea: 'Westyet', precioMXN: 11697, duracionIda: '27h 15m', escalas: 1, requiereVisa: true },
];

const AMADEUS_HOSPEDAJES = [
  { idHotel: 'AM-H1', nombre: 'Rivoli Central Apartment', precioMXN: 8814, camas: 3, banios: 2 },
  { idHotel: 'AM-H2', nombre: 'UCPA Sport Station Hostel', precioMXN: 11847, camas: 5, banios: 1 },
];

const TRANSPORTE_LOCAL = [
  { idTransporte: 'T1', tipo: 'Pase Semanal Navigo', precioMXN: 679 },
  { idTransporte: 'T2', tipo: 'Paris Visite (5 días)', precioMXN: 1634 },
];

const ATRACCIONES = [
  { idAtraccion: 'A1', nombre: 'Museo del Louvre', precioMXN: 400 },
  { idAtraccion: 'A2', nombre: 'Torre Eiffel', precioMXN: 500 },
];

const GASTOS_CATALOGO = [
  { tipo: 'eSIM', descripcion: 'Orange Holiday', costoMXN: 337.60 },
  { tipo: 'Adaptador', descripcion: 'Adaptador Universal', costoMXN: 253.37 },
  { tipo: 'Visa', descripcion: 'Visa Canadá', costoMXN: 1400.00 },
];

/* ============================================================
   ESTILOS GLOBALES
   ============================================================ */
const globalCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f0f4f8; color: #1a202c; }
  button { font-family: inherit; cursor: pointer; }
  input, select { font-family: inherit; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; }
  .header h1 { font-size: 20px; font-weight: 700; }
  .user-info { display: flex; align-items: center; gap: 12px; font-size: 14px; }
  .badge-rol { background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 12px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
  .logout-btn { background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px 20px; width: 100%; flex: 1; }
  .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; background: white; padding: 8px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .tab { padding: 10px 18px; border-radius: 8px; border: none; background: transparent; color: #4a5568; font-weight: 600; font-size: 14px; }
  .tab.active { background: #1e3a8a; color: white; }
  .tab-badge { background: #f59e0b; color: white; border-radius: 10px; padding: 1px 7px; font-size: 11px; margin-left: 6px; }
  .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #edf2f7; padding-bottom: 12px; }
  .card-title { font-size: 16px; font-weight: 700; color: #1e3a8a; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  .btn { padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; }
  .btn-primary { background: #1e3a8a; color: white; }
  .btn-secondary { background: #edf2f7; color: #2d3748; }
  .btn-danger { background: #fed7d7; color: #c53030; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; }
  .form-input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .row-data { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #edf2f7; font-size: 14px; }
  .row-data:last-child { border-bottom: none; }
  .price { font-size: 20px; font-weight: 800; color: #1e3a8a; }
  .badge-info { background: #bee3f8; color: #2a4365; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
  .highlight { border: 2px solid #3b82f6; background: #ebf8ff; }
  .summary-total { background: #1e3a8a; color: white; padding: 24px; border-radius: 12px; margin: 16px 0; }
  .summary-total .amount { font-size: 32px; font-weight: 800; }
  .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #1e3a8a; }
  .login-card { background: white; padding: 40px; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
  .error-msg { color: #c53030; font-size: 13px; margin-bottom: 10px; }
`;

/* ============================================================
   LOGIN (CON SELECCIÓN DE ROL)
   ============================================================ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('agente@travelpro.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = USUARIOS.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Credenciales incorrectas. Usa: gerente@travelpro.com, jefa@travelpro.com o agente@travelpro.com (pass: 123)');
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="login-screen">
        <div className="login-card">
          <h2 style={{ color: '#1e3a8a', marginBottom: '8px' }}>✈️ TravelPro Agency</h2>
          <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>Sistema Interno de Cotización</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo Corporativo</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p className="error-msg">{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar al Sistema</button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#718096', background: '#f7fafc', padding: '10px', borderRadius: '8px' }}>
            <strong>Roles de prueba:</strong><br/>
            gerente@travelpro.com<br/>
            jefa@travelpro.com<br/>
            agente@travelpro.com<br/>
            (Contraseña: 123)
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   DASHBOARD JERÁRQUICO (Para Gerente y Jefe)
   ============================================================ */
function DashboardModule({ user }) {
  return (
    <div>
      <div className="card" style={{ background: '#1e3a8a', color: 'white' }}>
        <h2>Bienvenido, {user.nombre}</h2>
        <p>Rol: {user.rol.toUpperCase()}</p>
      </div>
      
      {user.rol === 'gerente' && (
        <div className="grid">
          <div className="card">
            <div className="card-header"><span className="card-title">Jefes de Equipo a cargo</span></div>
            <p>Laura Jefa (jefa@travelpro.com)</p>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Métricas Globales</span></div>
            <p>Cotizaciones generadas: 45</p>
            <p>Ingresos por comisiones: $45,000 MXN</p>
          </div>
        </div>
      )}

      {user.rol === 'jefe' && (
        <div className="grid">
          <div className="card">
            <div className="card-header"><span className="card-title">Agentes a cargo</span></div>
            <p>Misael Agente (agente@travelpro.com)</p>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Métricas de Equipo</span></div>
            <p>Cotizaciones del equipo: 12</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MÓDULO CLIENTES (Agente selecciona o crea)
   ============================================================ */
function ClientesModule({ clientes, setClientes, selectedCliente, onSelect }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });

  const add = () => {
    if (!form.nombre) return;
    const nuevo = { idCliente: Date.now(), ...form };
    setClientes([...clientes, nuevo]);
    setForm({ nombre: '', email: '', telefono: '' });
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Registrar Nuevo Cliente</span></div>
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Teléfono</label>
          <input className="form-input" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
        </div>
        <button className="btn btn-primary" onClick={add}>Guardar Cliente</button>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Seleccionar Cliente Activo</span></div>
        {clientes.map(c => (
          <div key={c.idCliente} className={`row-data ${selectedCliente?.idCliente === c.idCliente ? 'highlight' : ''}`} style={{ padding: '12px', cursor: 'pointer' }} onClick={() => onSelect(c)}>
            <div>
              <strong>{c.nombre}</strong><br/>
              <span style={{ fontSize: '12px', color: '#718096' }}>{c.email}</span>
            </div>
            {selectedCliente?.idCliente === c.idCliente && <span className="badge-info">Seleccionado</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MÓDULO PLAN DE VIAJE (Cabecera)
   ============================================================ */
function PlanModule({ selectedCliente, plan, setPlan }) {
  if (!selectedCliente) return <div className="card">Por favor, selecciona un cliente en la pestaña anterior.</div>;

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Plan de Viaje para: {selectedCliente.nombre}</span>
        {plan && <span className="badge-info">ID Plan: {plan.idPlan}</span>}
      </div>
      
      {!plan ? (
        <div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Destino</label>
              <input className="form-input" placeholder="Ej. París" id="destino" />
            </div>
            <div className="form-group">
              <label className="form-label">Noches</label>
              <input className="form-input" type="number" placeholder="5" id="noches" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => {
            const destino = document.getElementById('destino').value;
            const noches = document.getElementById('noches').value;
            if (destino && noches) setPlan({ idPlan: Date.now(), destino, noches });
          }}>Generar Plan e Iniciar Búsqueda</button>
        </div>
      ) : (
        <div>
          <p><strong>Destino:</strong> {plan.destino}</p>
          <p><strong>Noches:</strong> {plan.noches}</p>
          <button className="btn btn-secondary btn-sm" onClick={() => setPlan(null)}>Modificar Datos</button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MÓDULO VUELOS (Simulando Amadeus)
   ============================================================ */
function VuelosModule({ plan, reservaVuelo, onSelect }) {
  if (!plan) return <div className="card">Primero debes generar el Plan de Viaje.</div>;

  return (
    <div className="grid">
      {AMADEUS_VUELOS.map(v => {
        const isSelected = reservaVuelo?.idVuelo === v.idVuelo;
        return (
          <div key={v.idVuelo} className={`card ${isSelected ? 'highlight' : ''}`}>
            <div className="card-header">
              <span className="card-title">{v.aerolinea}</span>
              <span className="badge-info">Amadeus ID</span>
            </div>
            <div className="price">${v.precioMXN.toLocaleString()} MXN</div>
            <div className="row-data"><span>Duración:</span> <span>{v.duracionIda}</span></div>
            <div className="row-data"><span>Escalas:</span> <span>{v.escalas}</span></div>
            <div className="row-data"><span>Visa:</span> <span>{v.requiereVisa ? 'Sí (Canadá)' : 'No'}</span></div>
            
            {isSelected ? (
              <div style={{ marginTop: '15px', background: '#c6f6d5', padding: '10px', borderRadius: '8px' }}>
                <strong>✓ Apartado con Amadeus</strong><br/>
                <small>Order ID: {reservaVuelo.orderId}</small><br/>
                <small>Expira: {reservaVuelo.fechaExpiracion}</small>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }} onClick={() => onSelect(v)}>
                Apartar Vuelo (Amadeus)
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MÓDULO HOSPEDAJES (Simulando Amadeus)
   ============================================================ */
function HospedajesModule({ plan, reservaHospedaje, onSelect }) {
  if (!plan) return <div className="card">Primero debes generar el Plan de Viaje.</div>;

  return (
    <div className="grid">
      {AMADEUS_HOSPEDAJES.map(h => {
        const isSelected = reservaHospedaje?.idHotel === h.idHotel;
        return (
          <div key={h.idHotel} className={`card ${isSelected ? 'highlight' : ''}`}>
            <div className="card-header">
              <span className="card-title">{h.nombre}</span>
            </div>
            <div className="price">${h.precioMXN.toLocaleString()} MXN</div>
            <div className="row-data"><span>Camas:</span> <span>{h.camas}</span></div>
            <div className="row-data"><span>Baños:</span> <span>{h.banios}</span></div>
            
            {isSelected ? (
              <div style={{ marginTop: '15px', background: '#c6f6d5', padding: '10px', borderRadius: '8px' }}>
                <strong>✓ Apartado con Amadeus</strong><br/>
                <small>Order ID: {reservaHospedaje.orderId}</small><br/>
                <small>Expira: {reservaHospedaje.fechaExpiracion}</small>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }} onClick={() => onSelect(h)}>
                Apartar Hospedaje (Amadeus)
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MÓDULO ITINERARIO / ATRACCIONES Y TRANSPORTE
   ============================================================ */
function ItinerarioModule({ plan, atracciones, setAtracciones, transporte, setTransporte }) {
  if (!plan) return <div className="card">Primero debes generar el Plan de Viaje.</div>;

  const toggleAtraccion = (atr) => {
    if (atracciones.find(a => a.idAtraccion === atr.idAtraccion)) {
      setAtracciones(atracciones.filter(a => a.idAtraccion !== atr.idAtraccion));
    } else {
      setAtracciones([...atracciones, atr]);
    }
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Atracciones Turísticas</span></div>
        {ATRACCIONES.map(a => {
          const isSelected = atracciones.find(x => x.idAtraccion === a.idAtraccion);
          return (
            <div key={a.idAtraccion} className="row-data">
              <div>
                <strong>{a.nombre}</strong><br/>
                <small>${a.precioMXN} MXN</small>
              </div>
              <button className={`btn btn-sm ${isSelected ? 'btn-danger' : 'btn-secondary'}`} onClick={() => toggleAtraccion(a)}>
                {isSelected ? 'Quitar' : 'Agregar'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Transporte Local</span></div>
        {TRANSPORTE_LOCAL.map(t => (
          <div key={t.idTransporte} className={`row-data ${transporte?.idTransporte === t.idTransporte ? 'highlight' : ''}`} style={{ padding: '10px' }}>
            <div>
              <strong>{t.tipo}</strong><br/>
              <small>${t.precioMXN} MXN (por persona)</small>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => setTransporte(t)}>
              {transporte?.idTransporte === t.idTransporte ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MÓDULO VIAJEROS Y GASTOS EXTRAS
   ============================================================ */
function ViajerosModule({ viajeros, setViajeros, gastosExtras, setGastosExtras }) {
  const [form, setForm] = useState({ nombre: '', email: '' });

  const addViajero = () => {
    if (!form.nombre) return;
    setViajeros([...viajeros, { idViajero: Date.now(), ...form }]);
    setForm({ nombre: '', email: '' });
  };

  const addGasto = (idViajero, cat) => {
    setGastosExtras([...gastosExtras, { idGasto: Date.now(), idViajero, ...cat }]);
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Registrar Viajero</span></div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={addViajero}>Añadir Viajero</button>

        <div style={{ marginTop: '20px' }}>
          {viajeros.map(v => (
            <div key={v.idViajero} style={{ background: '#f7fafc', padding: '10px', marginBottom: '10px', borderRadius: '8px' }}>
              <strong>{v.nombre}</strong>
              <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                {GASTOS_CATALOGO.map((g, i) => (
                  <button key={i} className="btn btn-secondary btn-sm" onClick={() => addGasto(v.idViajero, g)}>
                    + {g.tipo} (${g.costoMXN})
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Gastos Extras Registrados</span></div>
        {gastosExtras.length === 0 ? <p style={{ color: '#718096' }}>No hay gastos.</p> : null}
        {gastosExtras.map(g => {
          const v = viajeros.find(x => x.idViajero === g.idViajero);
          return (
            <div key={g.idGasto} className="row-data">
              <span>{v?.nombre}: {g.tipo} - {g.descripcion}</span>
              <strong>${g.costoMXN}</strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MÓDULO COTIZACIÓN FINAL
   ============================================================ */
function CotizacionModule({ plan, reservaVuelo, reservaHospedaje, transporte, atracciones, viajeros, gastosExtras }) {
  if (!plan) return <div className="card">Falta generar el Plan de Viaje.</div>;

  const n = viajeros.length || 1;
  
  const totalVuelos = reservaVuelo ? reservaVuelo.precioMXN * n : 0;
  const totalHospedaje = reservaHospedaje ? reservaHospedaje.precioMXN : 0;
  const totalTransporte = transporte ? transporte.precioMXN * n : 0;
  const totalAtracciones = atracciones.reduce((sum, a) => sum + (a.precioMXN * n), 0);
  
  const totalCompartido = totalVuelos + totalHospedaje + totalTransporte + totalAtracciones;
  const compartidoPorPersona = totalCompartido / n;

  const totalGastosExtras = gastosExtras.reduce((sum, g) => sum + g.costoMXN, 0);
  const totalGrupo = totalCompartido + totalGastosExtras;
  
  const comision = totalGrupo * 0.10; // 10% comisión agencia
  const totalFinal = totalGrupo + comision;

  return (
    <div>
      <div className="card">
        <div className="card-header"><span className="card-title">Resumen de Reservas (Amadeus)</span></div>
        <div className="row-data"><span>Vuelo ({reservaVuelo?.aerolinea || 'No seleccionado'})</span><strong>${totalVuelos.toLocaleString()}</strong></div>
        <div className="row-data"><span>Hospedaje ({reservaHospedaje?.nombre || 'No seleccionado'})</span><strong>${totalHospedaje.toLocaleString()}</strong></div>
        <div className="row-data"><span>Transporte ({transporte?.tipo || 'No seleccionado'})</span><strong>${totalTransporte.toLocaleString()}</strong></div>
        <div className="row-data"><span>Atracciones ({atracciones.length} seleccionadas)</span><strong>${totalAtracciones.toLocaleString()}</strong></div>
        <div className="row-data" style={{ borderTop: '2px solid #1e3a8a', marginTop: '10px', paddingTop: '10px' }}>
          <strong>Costo Compartido</strong><strong>${totalCompartido.toLocaleString()}</strong>
        </div>
        <div className="row-data"><span>Costo por persona (Compartido)</span><span>${compartidoPorPersona.toFixed(2)}</span></div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Gastos Extras (Individuales)</span></div>
        {gastosExtras.length === 0 ? <p>Sin gastos extras.</p> : null}
        {gastosExtras.map(g => (
          <div key={g.idGasto} className="row-data"><span>{g.tipo} - {g.descripcion}</span><strong>${g.costoMXN}</strong></div>
        ))}
      </div>

      <div className="summary-total">
        <div style={{ fontSize: '14px', opacity: 0.9 }}>COTIZACIÓN FINAL (CON 10% COMISIÓN)</div>
        <div className="amount">${totalFinal.toLocaleString()} MXN</div>
        <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '5px' }}>Subtotal: ${totalGrupo.toLocaleString()} + Comisión: ${comision.toLocaleString()}</div>
      </div>
      
      <button className="btn btn-primary" onClick={() => window.print()} style={{ width: '100%', padding: '15px', fontSize: '16px' }}>
        🖨️ Exportar Cotización a PDF
      </button>
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Datos del Plan
  const [clientes, setClientes] = useState(CLIENTES);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [plan, setPlan] = useState(null);
  
  // Reservas Amadeus
  const [reservaVuelo, setReservaVuelo] = useState(null);
  const [reservaHospedaje, setReservaHospedaje] = useState(null);
  
  // Itinerario
  const [atracciones, setAtracciones] = useState([]);
  const [transporte, setTransporte] = useState(null);
  
  // Viajeros
  const [viajeros, setViajeros] = useState([]);
  const [gastosExtras, setGastosExtras] = useState([]);

  // Handlers para simular Amadeus
  const handleApartarVuelo = (vuelo) => {
    const orderId = 'AMD-V' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const exp = new Date();
    exp.setDate(exp.getDate() + 2); // Expira en 2 días
    setReservaVuelo({ ...vuelo, orderId, fechaExpiracion: exp.toLocaleDateString(), estado: 'apartado' });
  };

  const handleApartarHospedaje = (hotel) => {
    const orderId = 'AMD-H' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const exp = new Date();
    exp.setDate(exp.getDate() + 2);
    setReservaHospedaje({ ...hotel, orderId, fechaExpiracion: exp.toLocaleDateString(), estado: 'apartado' });
  };

  const tabs = [
    { id: 'dashboard', label: '🏢 Dashboard', roles: ['gerente', 'jefe'] },
    { id: 'clientes', label: '👤 1. Clientes', roles: ['agente'] },
    { id: 'plan', label: '🗺️ 2. Plan de Viaje', roles: ['agente'] },
    { id: 'vuelos', label: '✈️ 3. Vuelos', roles: ['agente'] },
    { id: 'hospedajes', label: '🏨 4. Hospedaje', roles: ['agente'] },
    { id: 'itinerario', label: '🎢 5. Itinerario', roles: ['agente'] },
    { id: 'viajeros', label: '👥 6. Viajeros/Gastos', roles: ['agente'] },
    { id: 'cotizacion', label: '📄 7. Cotización', roles: ['agente'] },
  ];

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app">
        <header className="header">
          <h1>✈️ TravelPro - Agencia de Viajes</h1>
          <div className="user-info">
            <span>{user.nombre}</span>
            <span className="badge-rol">{user.rol}</span>
            <button className="logout-btn" onClick={() => { setUser(null); setActiveTab('dashboard'); }}>Salir</button>
          </div>
        </header>

        <div className="container">
          <div className="tabs">
            {tabs.filter(t => t.roles.includes(user.rol)).map(t => (
              <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'dashboard' && <DashboardModule user={user} />}
          
          {/* Flujo del Agente */}
          {activeTab === 'clientes' && <ClientesModule clientes={clientes} setClientes={setClientes} selectedCliente={selectedCliente} onSelect={setSelectedCliente} />}
          {activeTab === 'plan' && <PlanModule selectedCliente={selectedCliente} plan={plan} setPlan={setPlan} />}
          {activeTab === 'vuelos' && <VuelosModule plan={plan} reservaVuelo={reservaVuelo} onSelect={handleApartarVuelo} />}
          {activeTab === 'hospedajes' && <HospedajesModule plan={plan} reservaHospedaje={reservaHospedaje} onSelect={handleApartarHospedaje} />}
          {activeTab === 'itinerario' && <ItinerarioModule plan={plan} atracciones={atracciones} setAtracciones={setAtracciones} transporte={transporte} setTransporte={setTransporte} />}
          {activeTab === 'viajeros' && <ViajerosModule viajeros={viajeros} setViajeros={setViajeros} gastosExtras={gastosExtras} setGastosExtras={setGastosExtras} />}
          {activeTab === 'cotizacion' && <CotizacionModule plan={plan} reservaVuelo={reservaVuelo} reservaHospedaje={reservaHospedaje} transporte={transporte} atracciones={atracciones} viajeros={viajeros} gastosExtras={gastosExtras} />}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   RENDER
   ============================================================ */
const root = createRoot(document.getElementById('root'));
root.render(<App />);