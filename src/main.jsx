// main.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

/* ============================================================
   1. DATOS GLOBALES (AMADEUS Y CATÁLOGOS)
   ============================================================ */
const AMADEUS_VUELOS = [
  { idVuelo: 'V1', pais: 'Francia', aerolinea: 'Air France', precioMXN: 15000, duracion: '11h', escalas: 0 },
  { idVuelo: 'V2', pais: 'España', aerolinea: 'Iberia', precioMXN: 13500, duracion: '10h', escalas: 0 },
  { idVuelo: 'V3', pais: 'Japón', aerolinea: 'ANA', precioMXN: 28000, duracion: '18h', escalas: 1 },
  { idVuelo: 'V4', pais: 'Estados Unidos', aerolinea: 'American Airlines', precioMXN: 8500, duracion: '4h', escalas: 0 },
  { idVuelo: 'V5', pais: 'México', aerolinea: 'Aeroméxico', precioMXN: 4500, duracion: '2h', escalas: 0 },
];

const AMADEUS_HOSPEDAJES = [
  { idHotel: 'H1', pais: 'Francia', nombre: 'Hotel Ritz Paris', precioMXN: 25000, camas: 2 },
  { idHotel: 'H2', pais: 'España', nombre: 'Hotel Riu Madrid', precioMXN: 8000, camas: 3 },
  { idHotel: 'H3', pais: 'Japón', nombre: 'Shinjuku Granbell Hotel', precioMXN: 12000, camas: 2 },
  { idHotel: 'H4', pais: 'Estados Unidos', nombre: 'The Manhattan Times Square', precioMXN: 18000, camas: 2 },
  { idHotel: 'H5', pais: 'México', nombre: 'Hotel Geneve CDMX', precioMXN: 3500, camas: 2 },
];

const ATRACCIONES_DB = [
  { idAtraccion: 'A1', pais: 'Francia', nombre: 'Museo del Louvre', precioMXN: 400 },
  { idAtraccion: 'A2', pais: 'Francia', nombre: 'Torre Eiffel', precioMXN: 500 },
  { idAtraccion: 'A3', pais: 'Japón', nombre: 'Templo Senso-ji', precioMXN: 0 },
  { idAtraccion: 'A4', pais: 'Estados Unidos', nombre: 'Estatua de la Libertad', precioMXN: 700 },
];

const TRANSPORTE_DB = [
  { idTransporte: 'T1', tipo: 'Pase Semanal Metro', precioMXN: 679 },
  { idTransporte: 'T2', tipo: 'Taxi Aeropuerto-Ciudad', precioMXN: 850 },
];

const GASTOS_DB = [
  { tipo: 'eSIM', descripcion: 'Chip de Datos', costoMXN: 337.60 },
  { tipo: 'Adaptador', descripcion: 'Enchufe Universal', costoMXN: 253.37 },
  { tipo: 'Visa', descripcion: 'Trámite Migratorio', costoMXN: 1400.00 },
];

const INITIAL_USUARIOS = [
  { id: 1, nombre: 'Carlos Gerente', email: 'gerente@travelpro.com', password: '123', rol: 'gerente', creadoPor: null },
  { id: 2, nombre: 'Laura Jefa', email: 'jefa@travelpro.com', password: '123', rol: 'jefe', creadoPor: 1 },
  { id: 3, nombre: 'Misael Agente', email: 'agente@travelpro.com', password: '123', rol: 'agente', creadoPor: 2 },
];

/* ============================================================
   2. ESTILOS (DISEÑO MODERNO)
   ============================================================ */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
  body { background-color: #f3f4f6; color: #1f2937; }
  .app-container { display: flex; height: 100vh; overflow: hidden; }
  
  /* SIDEBAR */
  .sidebar { width: 260px; background: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; z-index: 10; }
  .sidebar-logo { padding: 24px; font-size: 20px; font-weight: 800; color: #1d4ed8; border-bottom: 1px solid #f3f4f6; }
  .sidebar-menu { flex: 1; padding: 20px 12px; }
  .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; color: #4b5563; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 4px; border: none; background: transparent; width: 100%; text-align: left; transition: 0.2s; }
  .menu-item:hover { background: #eff6ff; color: #1d4ed8; }
  .menu-item.active { background: #1d4ed8; color: white; }
  
  /* MAIN */
  .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
  .topbar { background: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; }
  .role-badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
  .btn-logout { background: #fee2e2; color: #b91c1c; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  .content-area { padding: 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
  
  /* UI ELEMENTS */
  .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 24px; border: 1px solid #e5e7eb; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; }
  .card-title { font-size: 18px; font-weight: 700; color: #111827; }
  .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
  
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 8px; }
  .form-input { width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; outline: none; }
  .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  
  .btn { padding: 12px 20px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 14px; }
  .btn-primary { background: #1d4ed8; color: white; }
  .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
  .btn-secondary { background: #f3f4f6; color: #374151; }
  .btn-success { background: #10b981; color: white; }
  .btn-danger { background: #ef4444; color: white; }
  .btn-sm { padding: 8px 12px; font-size: 12px; }
  
  .list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f3f4f6; }
  .price-tag { font-size: 18px; font-weight: 700; color: #059669; }
  .highlight { border: 2px solid #10b981; background: #ecfdf5; border-radius: 12px; }
  
  .stepper { display: flex; gap: 10px; margin-bottom: 30px; }
  .step { flex: 1; height: 8px; border-radius: 10px; background: #e5e7eb; }
  .step.active { background: #3b82f6; }
  
  /* LOGIN */
  .login-bg { height: 100vh; display: flex; align-items: center; justify-content: center; background: #1e3a8a; }
  .login-card { background: white; padding: 40px; border-radius: 20px; width: 400px; }
`;

/* ============================================================
   3. COMPONENTES (LOGIN Y ADMIN)
   ============================================================ */
function LoginScreen({ onLogin, usuarios }) {
  const [email, setEmail] = useState('agente@travelpro.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = usuarios.find(u => u.email === email && u.password === password);
    if (user) onLogin(user);
    else setError('Credenciales incorrectas.');
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="login-bg">
        <div className="login-card">
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>✈️ TravelPro</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>Portal B2B de Agencia</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo</label>
              <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar</button>
          </form>
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
            <b>Pruebas (pass: 123):</b><br/>
            gerente@travelpro.com<br/>
            jefa@travelpro.com<br/>
            agente@travelpro.com
          </div>
        </div>
      </div>
    </>
  );
}

function AdminUsersModule({ user, usuarios, setUsuarios }) {
  const [form, setForm] = useState({ nombre: '', email: '', rol: 'agente' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;
    setUsuarios([...usuarios, { id: Date.now(), ...form, password: '123', creadoPor: user.id }]);
    setForm({ nombre: '', email: '', rol: 'agente' });
    alert('Usuario creado con éxito');
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Dar de Alta Usuario</span></div>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Nombre</label>
            <input className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Rol</label>
            <select className="form-input" value={form.rol} onChange={e => setForm({...form, rol: e.target.value})}>
              {user.rol === 'gerente' && <option value="gerente">Gerente</option>}
              {(user.rol === 'gerente' || user.rol === 'jefe') && <option value="jefe">Jefe de Equipo</option>}
              <option value="agente">Agente de Viajes</option>
            </select>
          </div>
          <button className="btn btn-primary" type="submit">Crear Usuario</button>
        </form>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Subordinados</span></div>
        {usuarios.filter(u => u.creadoPor === user.id).map(u => (
          <div key={u.id} className="list-item">
            <div><b>{u.nombre}</b><br/><small>{u.email}</small></div>
            <span className="role-badge">{u.rol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentClientModule({ user, clientes, setClientes }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });
  const handleCreate = (e) => {
    e.preventDefault();
    setClientes([...clientes, { idCliente: Date.now(), ...form, idAgente: user.id }]);
    setForm({ nombre: '', email: '', telefono: '' });
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Nuevo Cliente</span></div>
        <form onSubmit={handleCreate}>
          <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Teléfono</label><input className="form-input" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} /></div>
          <button className="btn btn-primary" type="submit">Registrar Cliente</button>
        </form>
      </div>
      <div className="card">
        <div className="card-header"><span className="card-title">Mis Clientes</span></div>
        {clientes.filter(c => c.idAgente === user.id).map(c => (
          <div key={c.idCliente} className="list-item"><b>{c.nombre}</b><span>{c.email}</span></div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   4. FLUJO COMPLETO DE COTIZACIÓN (DFD)
   ============================================================ */
function QuoteWizardModule({ user, clientes }) {
  const [step, setStep] = useState(1);
  
  // Estado global de la cotización
  const [plan, setPlan] = useState({ idPlan: Date.now(), destino: '', pais: 'Francia', noches: 1, estado: 'borrador' });
  const [reservaVuelo, setReservaVuelo] = useState(null);
  const [reservaHospedaje, setReservaHospedaje] = useState(null);
  const [transporte, setTransporte] = useState(null);
  const [atracciones, setAtracciones] = useState([]);
  const [viajeros, setViajeros] = useState([]);
  const [gastosExtras, setGastosExtras] = useState([]);

  const paises = ['Francia', 'España', 'Japón', 'Estados Unidos', 'México'];
  const misClientes = clientes.filter(c => c.idAgente === user.id);

  // Handlers Amadeus (Simulación)
  const apartarVuelo = (v) => setReservaVuelo({ ...v, orderId: `AMD-V-${Math.random().toString(36).substr(2,5).toUpperCase()}`, expiracion: '2 días', estado: 'apartado' });
  const apartarHospedaje = (h) => setReservaHospedaje({ ...h, orderId: `AMD-H-${Math.random().toString(36).substr(2,5).toUpperCase()}`, expiracion: '2 días', estado: 'apartado' });

  // Cálculos
  const numPax = viajeros.length || 1;
  const totalVuelos = reservaVuelo ? reservaVuelo.precioMXN * numPax : 0;
  const totalHotel = reservaHospedaje ? reservaHospedaje.precioMXN : 0;
  const totalTransporte = transporte ? transporte.precioMXN * numPax : 0;
  const totalAtracciones = atracciones.reduce((sum, a) => sum + a.precioMXN, 0) * numPax;
  
  const costoCompartido = totalVuelos + totalHotel + totalTransporte + totalAtracciones;
  const costoPorPersona = costoCompartido / numPax;
  
  const totalExtras = gastosExtras.reduce((sum, g) => sum + g.costoMXN, 0);
  const subtotal = costoCompartido + totalExtras;
  const comision = subtotal * 0.10; // 10% comisión
  const totalFinal = subtotal + comision;

  return (
    <div>
      {/* BARRA DE PROGRESO */}
      <div className="stepper">
        {[1, 2, 3, 4, 5].map(s => <div key={s} className={`step ${step >= s ? 'active' : ''}`}></div>)}
      </div>

      {/* PASO 1: REGISTRAR SOLICITUD */}
      {step === 1 && (
        <div className="card">
          <div className="card-header"><span className="card-title">Paso 1: Registrar Solicitud (Plan de Viaje)</span></div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cliente</label>
              <select className="form-input" onChange={e => setPlan({...plan, cliente: misClientes.find(c => c.idCliente === Number(e.target.value))})}>
                <option value="">Selecciona...</option>
                {misClientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">País Destino</label>
              <select className="form-input" onChange={e => setPlan({...plan, pais: e.target.value})}>
                {paises.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ciudad (Destino)</label>
              <input className="form-input" placeholder="Ej. París" onChange={e => setPlan({...plan, destino: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Noches</label>
              <input className="form-input" type="number" min="1" defaultValue="1" onChange={e => setPlan({...plan, noches: e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!plan.cliente || !plan.destino}>Siguiente: Vuelos y Hoteles</button>
        </div>
      )}

      {/* PASO 2: VUELOS Y HOSPEDAJE (AMADEUS) */}
      {step === 2 && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)} style={{ marginBottom: '16px' }}>← Volver</button>
          <div className="card">
            <div className="card-header"><span className="card-title">Vuelos a {plan.pais} (Amadeus)</span></div>
            <div className="grid">
              {AMADEUS_VUELOS.filter(v => v.pais === plan.pais).map(v => (
                <div key={v.idVuelo} className={`card ${reservaVuelo?.idVuelo === v.idVuelo ? 'highlight' : ''}`}>
                  <b>{v.aerolinea}</b> <span className="price-tag">${v.precioMXN}</span>
                  {reservaVuelo?.idVuelo === v.idVuelo ? (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#065f46' }}>✓ Order ID: {reservaVuelo.orderId}</div>
                  ) : (
                    <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '10px' }} onClick={() => apartarVuelo(v)}>Apartar</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Hospedajes en {plan.pais} (Amadeus)</span></div>
            <div className="grid">
              {AMADEUS_HOSPEDAJES.filter(h => h.pais === plan.pais).map(h => (
                <div key={h.idHotel} className={`card ${reservaHospedaje?.idHotel === h.idHotel ? 'highlight' : ''}`}>
                  <b>{h.nombre}</b> <span className="price-tag">${h.precioMXN}</span>
                  {reservaHospedaje?.idHotel === h.idHotel ? (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#065f46' }}>✓ Order ID: {reservaHospedaje.orderId}</div>
                  ) : (
                    <button className="btn btn-primary btn-sm" style={{ width: '100%', marginTop: '10px' }} onClick={() => apartarHospedaje(h)}>Apartar</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!reservaVuelo || !reservaHospedaje}>Siguiente: Atracciones</button>
        </div>
      )}

      {/* PASO 3: TRANSPORTE Y ATRACCIONES */}
      {step === 3 && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)} style={{ marginBottom: '16px' }}>← Volver</button>
          <div className="grid">
            <div className="card">
              <div className="card-header"><span className="card-title">Transporte Local</span></div>
              {TRANSPORTE_DB.map(t => (
                <div key={t.idTransporte} className="list-item">
                  <div>{t.tipo} - <b>${t.precioMXN}</b></div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setTransporte(t)}>{transporte?.idTransporte === t.idTransporte ? '✓' : 'Elegir'}</button>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Atracciones en {plan.pais}</span></div>
              {ATRACCIONES_DB.filter(a => a.pais === plan.pais).map(a => (
                <div key={a.idAtraccion} className="list-item">
                  <div>{a.nombre} - <b>${a.precioMXN}</b></div>
                  <button className="btn btn-secondary btn-sm" onClick={() => {
                    if(!atracciones.find(x => x.idAtraccion === a.idAtraccion)) setAtracciones([...atracciones, a]);
                  }}>Añadir</button>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setStep(4)} disabled={!transporte}>Siguiente: Viajeros y Extras</button>
        </div>
      )}

      {/* PASO 4: VIAJEROS Y GASTOS EXTRAS */}
      {step === 4 && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setStep(3)} style={{ marginBottom: '16px' }}>← Volver</button>
          <div className="grid">
            <div className="card">
              <div className="card-header"><span className="card-title">Registrar Viajeros</span></div>
              <button className="btn btn-primary btn-sm" onClick={() => setViajeros([...viajeros, { idViajero: Date.now(), nombre: `Viajero ${viajeros.length + 1}` }])}>+ Añadir Viajero</button>
              <div style={{ marginTop: '16px' }}>
                {viajeros.map(v => (
                  <div key={v.idViajero} style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', marginBottom: '10px' }}>
                    <b>{v.nombre}</b>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {GASTOS_DB.map((g, i) => (
                        <button key={i} className="btn btn-secondary btn-sm" onClick={() => setGastosExtras([...gastosExtras, { idGasto: Date.now(), idViajero: v.idViajero, ...g }])}>+ {g.tipo}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">Gastos Extras Registrados</span></div>
              {gastosExtras.map(g => (
                <div key={g.idGasto} className="list-item"><span>{g.tipo} - {g.descripcion}</span><b>${g.costoMXN}</b></div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setStep(5)} disabled={viajeros.length === 0}>Siguiente: Cotización Final</button>
        </div>
      )}

      {/* PASO 5: COTIZACIÓN Y CONFIRMACIÓN (Paso 4 del DFD) */}
      {step === 5 && (
        <div>
          <div className="card">
            <div className="card-header"><span className="card-title">Resumen de Cotización</span></div>
            <div className="list-item"><span>Vuelos ({numPax} pax)</span><b>${totalVuelos.toLocaleString()}</b></div>
            <div className="list-item"><span>Hospedaje</span><b>${totalHotel.toLocaleString()}</b></div>
            <div className="list-item"><span>Transporte</span><b>${totalTransporte.toLocaleString()}</b></div>
            <div className="list-item"><span>Atracciones</span><b>${totalAtracciones.toLocaleString()}</b></div>
            <div className="list-item"><span>Gastos Extras</span><b>${totalExtras.toLocaleString()}</b></div>
            
            <div style={{ background: '#1e3a8a', color: 'white', padding: '24px', borderRadius: '12px', marginTop: '20px' }}>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Subtotal + Comisión (10%)</div>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>${totalFinal.toLocaleString()} MXN</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Confirmar Reserva (Amadeus)</span></div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>El cliente debe aceptar. Si acepta, se confirman los Order IDs. Si rechaza, se liberan.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-success" onClick={() => { alert('Reserva Confirmada en Amadeus. PDF Generado.'); setStep(1); }}>Aceptar y Confirmar</button>
              <button className="btn btn-danger" onClick={() => { alert('Reserva Cancelada y liberada en Amadeus.'); setStep(1); }}>Rechazar y Liberar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   5. APP PRINCIPAL
   ============================================================ */
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
  const [clientes, setClientes] = useState([{ idCliente: 1, nombre: 'Juan Perez', email: 'j@e.com', idAgente: 3 }]);

  if (!user) return <LoginScreen onLogin={setUser} usuarios={usuarios} />;

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app-container">
        <aside className="sidebar">
          <div className="sidebar-logo">✈️ TravelPro</div>
          <div className="sidebar-menu">
            <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
            {(user.rol === 'gerente' || user.rol === 'jefe') && (
              <button className={`menu-item ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>👥 Personal</button>
            )}
            {user.rol === 'agente' && (
              <>
                <button className={`menu-item ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>🙋 Clientes</button>
                <button className={`menu-item ${activeTab === 'cotizar' ? 'active' : ''}`} onClick={() => setActiveTab('cotizar')}>💼 Cotizar Viaje</button>
              </>
            )}
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <h1 style={{ fontSize: '18px', fontWeight: '600' }}>
              {activeTab === 'dashboard' ? 'Panel de Control' : activeTab === 'personal' ? 'Gestión de Personal' : activeTab === 'clientes' ? 'Cartera de Clientes' : 'Nueva Cotización'}
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span className="role-badge">{user.rol}</span>
              <b>{user.nombre}</b>
              <button className="btn-logout" onClick={() => setUser(null)}>Salir</button>
            </div>
          </header>

          <div className="content-area">
            {activeTab === 'dashboard' && <div className="card"><h2>Bienvenido, {user.nombre}</h2><p>Selecciona una opción del menú lateral para comenzar.</p></div>}
            {activeTab === 'personal' && <AdminUsersModule user={user} usuarios={usuarios} setUsuarios={setUsuarios} />}
            {activeTab === 'clientes' && <AgentClientModule user={user} clientes={clientes} setClientes={setClientes} />}
            {activeTab === 'cotizar' && <QuoteWizardModule user={user} clientes={clientes} />}
          </div>
        </main>
      </div>
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);