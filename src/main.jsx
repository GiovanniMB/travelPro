// main.jsx
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

/* ============================================================
   DATOS SIMULADOS GLOBALES (AMADEUS)
   ============================================================ */
const PAISES = ['Todos', 'Francia', 'España', 'Japón', 'Estados Unidos'];

const AMADEUS_VUELOS = [
  { idVuelo: 'AM-V1', pais: 'Francia', aerolinea: 'Air France', precioMXN: 15000, duracion: '12h 00m', escalas: 0 },
  { idVuelo: 'AM-V2', pais: 'Francia', aerolinea: 'Iberia', precioMXN: 13500, duracion: '15h 30m', escalas: 1 },
  { idVuelo: 'AM-V3', pais: 'España', aerolinea: 'Iberia', precioMXN: 12000, duracion: '10h 15m', escalas: 0 },
  { idVuelo: 'AM-V4', pais: 'Japón', aerolinea: 'ANA', precioMXN: 28000, duracion: '18h 45m', escalas: 1 },
  { idVuelo: 'AM-V5', pais: 'Estados Unidos', aerolinea: 'American Airlines', precioMXN: 8500, duracion: '4h 30m', escalas: 0 },
];

const AMADEUS_HOSPEDAJES = [
  { idHotel: 'AM-H1', pais: 'Francia', nombre: 'Hotel Ritz Paris', precioMXN: 25000, camas: 2 },
  { idHotel: 'AM-H2', pais: 'Francia', nombre: 'Generator Paris Hostel', precioMXN: 4500, camas: 4 },
  { idHotel: 'AM-H3', pais: 'España', nombre: 'Hotel Riu Madrid', precioMXN: 8000, camas: 3 },
  { idHotel: 'AM-H4', pais: 'Japón', nombre: 'Shinjuku Granbell Hotel', precioMXN: 12000, camas: 2 },
  { idHotel: 'AM-H5', pais: 'Estados Unidos', nombre: 'The Manhattan at Times Square', precioMXN: 18000, camas: 2 },
];

/* ============================================================
   ESTADO INICIAL DE USUARIOS Y CLIENTES
   ============================================================ */
const INITIAL_USUARIOS = [
  { id: 1, nombre: 'Carlos Gerente', email: 'gerente@travelpro.com', password: '123', rol: 'gerente', creadoPor: null },
  { id: 2, nombre: 'Laura Jefa', email: 'jefa@travelpro.com', password: '123', rol: 'jefe', creadoPor: 1 },
  { id: 3, nombre: 'Misael Agente', email: 'agente@travelpro.com', password: '123', rol: 'agente', creadoPor: 2 },
  { id: 4, nombre: 'Pedro Agente', email: 'pedro@travelpro.com', password: '123', rol: 'agente', creadoPor: 2 },
];

const INITIAL_CLIENTES = [
  { idCliente: 101, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '555-1234', idAgente: 3 },
  { idCliente: 102, nombre: 'María López', email: 'maria@email.com', telefono: '555-5678', idAgente: 4 },
];

/* ============================================================
   ESTILOS GLOBALES (DISEÑO MODERNO)
   ============================================================ */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
  body { background-color: #f3f4f6; color: #1f2937; }
  
  /* LAYOUT */
  .app-container { display: flex; height: 100vh; overflow: hidden; }
  
  /* SIDEBAR */
  .sidebar { width: 260px; background: #ffffff; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; box-shadow: 2px 0 5px rgba(0,0,0,0.02); z-index: 10; }
  .sidebar-logo { padding: 24px; font-size: 20px; font-weight: 700; color: #1d4ed8; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f3f4f6; }
  .sidebar-menu { flex: 1; padding: 20px 12px; overflow-y: auto; }
  .menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 10px; color: #4b5563; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s; margin-bottom: 4px; border: none; background: transparent; width: 100%; text-align: left; }
  .menu-item:hover { background: #eff6ff; color: #1d4ed8; }
  .menu-item.active { background: #1d4ed8; color: white; box-shadow: 0 4px 12px rgba(29, 78, 216, 0.2); }
  .menu-item.disabled { opacity: 0.5; cursor: not-allowed; }
  
  /* MAIN CONTENT */
  .main-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
  .topbar { background: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 5; }
  .topbar h1 { font-size: 18px; font-weight: 600; color: #374151; }
  .user-profile { display: flex; align-items: center; gap: 16px; }
  .role-badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
  .btn-logout { background: #fee2e2; color: #b91c1c; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .btn-logout:hover { background: #fecaca; }
  
  .content-area { padding: 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
  
  /* CARDS */
  .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); margin-bottom: 24px; border: 1px solid #f3f4f6; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px; }
  .card-title { font-size: 18px; font-weight: 700; color: #111827; }
  .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
  
  /* FORMS & BUTTONS */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #4b5563; margin-bottom: 8px; }
  .form-input { width: 100%; padding: 12px 16px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 14px; transition: border 0.2s, box-shadow 0.2s; outline: none; }
  .form-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  
  .btn { padding: 12px 20px; border-radius: 10px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-primary { background: #1d4ed8; color: white; box-shadow: 0 2px 4px rgba(29, 78, 216, 0.2); }
  .btn-primary:hover { background: #1e40af; }
  .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; box-shadow: none; }
  .btn-secondary { background: #f3f4f6; color: #374151; }
  .btn-secondary:hover { background: #e5e7eb; }
  .btn-danger { background: #fee2e2; color: #b91c1c; }
  .btn-danger:hover { background: #fecaca; }
  .btn-sm { padding: 8px 14px; font-size: 13px; }
  
  /* TABLES & LISTS */
  .list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #f3f4f6; transition: background 0.2s; }
  .list-item:last-child { border-bottom: none; }
  .list-item:hover { background: #f9fafb; }
  .price-tag { font-size: 18px; font-weight: 700; color: #059669; }
  .selected-border { border: 2px solid #10b981; background: #ecfdf5; border-radius: 12px; }
  
  /* DASHBOARD KPIS */
  .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
  .kpi-card { background: white; padding: 24px; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border-left: 4px solid #3b82f6; }
  .kpi-title { font-size: 13px; color: #6b7280; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
  .kpi-value { font-size: 28px; font-weight: 800; color: #111827; }
  
  /* LOGIN */
  .login-bg { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); }
  .login-card { background: white; padding: 40px; border-radius: 20px; width: 100%; max-width: 420px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
  .error-msg { background: #fef2f2; color: #b91c1c; padding: 12px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; border: 1px solid #fecaca; }
`;

/* ============================================================
   COMPONENTES
   ============================================================ */

function LoginScreen({ onLogin, usuarios }) {
  const [email, setEmail] = useState('gerente@travelpro.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = usuarios.find(u => u.email === email && u.password === password);
    if (user) onLogin(user);
    else setError('Credenciales incorrectas. Revisa la lista de usuarios de prueba.');
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="login-bg">
        <div className="login-card">
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>✈️ TravelPro B2B</h2>
          <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px' }}>Portal de Gestión de Agencia</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo Corporativo</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar al Sistema</button>
          </form>
          
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Usuarios de prueba (pass: 123):</p>
            <ul style={{ listStyle: 'none', lineHeight: '1.8' }}>
              <li>👑 Gerente: <b>gerente@travelpro.com</b></li>
              <li>👔 Jefe: <b>jefa@travelpro.com</b></li>
              <li>💼 Agente: <b>agente@travelpro.com</b></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardModule({ user, usuarios, clientes }) {
  // Filtrar subordinados según el rol
  const misSubordinados = usuarios.filter(u => u.creadoPor === user.id);
  const misClientes = clientes.filter(c => c.idAgente === user.id);

  return (
    <div>
      <div className="kpi-grid">
        {user.rol === 'gerente' && (
          <>
            <div className="kpi-card"><div className="kpi-title">Jefes Activos</div><div className="kpi-value">{misSubordinados.length}</div></div>
            <div className="kpi-card" style={{ borderLeftColor: '#10b981' }}><div className="kpi-title">Ventas Totales</div><div className="kpi-value">$450K</div></div>
          </>
        )}
        {user.rol === 'jefe' && (
          <>
            <div className="kpi-card"><div className="kpi-title">Agentes a Cargo</div><div className="kpi-value">{misSubordinados.length}</div></div>
            <div className="kpi-card" style={{ borderLeftColor: '#10b981' }}><div className="kpi-title">Cotizaciones del Equipo</div><div className="kpi-value">24</div></div>
          </>
        )}
        {user.rol === 'agente' && (
          <>
            <div className="kpi-card"><div className="kpi-title">Mis Clientes</div><div className="kpi-value">{misClientes.length}</div></div>
            <div className="kpi-card" style={{ borderLeftColor: '#f59e0b' }}><div className="kpi-title">Planes en Curso</div><div className="kpi-value">3</div></div>
          </>
        )}
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Mi Equipo / Cartera</span></div>
        {user.rol === 'agente' ? (
          <div>
            {misClientes.length === 0 ? <p style={{ color: '#6b7280' }}>Aún no tienes clientes asignados.</p> : null}
            {misClientes.map(c => (
              <div key={c.idCliente} className="list-item">
                <div><strong>{c.nombre}</strong><br/><span style={{ fontSize: '13px', color: '#6b7280' }}>{c.email}</span></div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {misSubordinados.length === 0 ? <p style={{ color: '#6b7280' }}>No tienes subordinados directos aún.</p> : null}
            {misSubordinados.map(s => (
              <div key={s.id} className="list-item">
                <div><strong>{s.nombre}</strong><br/><span style={{ fontSize: '13px', color: '#6b7280' }}>{s.email}</span></div>
                <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', textTransform: 'uppercase' }}>{s.rol}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserManagementModule({ user, usuarios, setUsuarios }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '123' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email) return;

    let nuevoRol = '';
    if (user.rol === 'gerente') nuevoRol = 'jefe';
    else if (user.rol === 'jefe') nuevoRol = 'agente';
    else return; // Agentes no dan de alta personal

    const nuevoUsuario = {
      id: Date.now(),
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      rol: nuevoRol,
      creadoPor: user.id
    };

    setUsuarios([...usuarios, nuevoUsuario]);
    setForm({ nombre: '', email: '', password: '123' });
    alert(`${nuevoRol.toUpperCase()} creado exitosamente.`);
  };

  if (user.rol === 'agente') return null;

  const subordinados = usuarios.filter(u => u.creadoPor === user.id);

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Dar de Alta Nuevo {user.rol === 'gerente' ? 'Jefe' : 'Agente'}</span></div>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input className="form-input" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Ej. Juan Pérez" />
          </div>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="correo@travelpro.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña (por defecto: 123)</label>
            <input className="form-input" value={form.password} disabled style={{ background: '#f3f4f6' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Crear {user.rol === 'gerente' ? 'Jefe' : 'Agente'}</button>
        </form>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Personal a mi cargo</span></div>
        {subordinados.length === 0 ? <p style={{ color: '#6b7280' }}>No has dado de alta a nadie aún.</p> : null}
        {subordinados.map(s => (
          <div key={s.id} className="list-item">
            <div><strong>{s.nombre}</strong><br/><span style={{ fontSize: '13px', color: '#6b7280' }}>{s.email}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientManagementModule({ user, clientes, setClientes }) {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.nombre) return;
    const nuevo = { idCliente: Date.now(), ...form, idAgente: user.id };
    setClientes([...clientes, nuevo]);
    setForm({ nombre: '', email: '', telefono: '' });
  };

  const misClientes = clientes.filter(c => c.idAgente === user.id);

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header"><span className="card-title">Registrar Nuevo Cliente</span></div>
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
            <label className="form-label">Teléfono</label>
            <input className="form-input" value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Guardar Cliente</button>
        </form>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Mi Cartera de Clientes</span></div>
        {misClientes.length === 0 ? <p style={{ color: '#6b7280' }}>Aún no tienes clientes.</p> : null}
        {misClientes.map(c => (
          <div key={c.idCliente} className="list-item">
            <div><strong>{c.nombre}</strong><br/><span style={{ fontSize: '13px', color: '#6b7280' }}>{c.email}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MÓDULOS DE COTIZACIÓN (Agente)
   ============================================================ */
function CotizacionFlow({ user, clientes, setClientes }) {
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [planData, setPlanData] = useState({ destino: '', noches: 1, paisFiltro: 'Todos' });
  const [reservaVuelo, setReservaVuelo] = useState(null);
  const [reservaHospedaje, setReservaHospedaje] = useState(null);

  const misClientes = clientes.filter(c => c.idAgente === user.id);

  const handleApartarVuelo = (vuelo) => {
    const orderId = 'AMD-V' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setReservaVuelo({ ...vuelo, orderId });
  };

  const handleApartarHospedaje = (hotel) => {
    const orderId = 'AMD-H' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setReservaHospedaje({ ...hotel, orderId });
  };

  return (
    <div>
      {/* STEPPER VISUAL */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '6px', background: step >= s ? '#3b82f6' : '#e5e7eb', borderRadius: '10px' }}></div>
        ))}
      </div>

      {step === 1 && (
        <div className="card">
          <div className="card-header"><span className="card-title">Paso 1: Seleccionar Cliente y Destino</span></div>
          <div className="form-group">
            <label className="form-label">Cliente</label>
            <select className="form-input" onChange={e => setSelectedClient(misClientes.find(c => c.idCliente === Number(e.target.value)))}>
              <option value="">Selecciona un cliente...</option>
              {misClientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">País de Destino</label>
              <select className="form-input" onChange={e => setPlanData({...planData, paisFiltro: e.target.value})}>
                {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad / Destino</label>
              <input className="form-input" placeholder="Ej. París" onChange={e => setPlanData({...planData, destino: e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!selectedClient || !planData.destino}>Continuar a Vuelos</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)} style={{ marginBottom: '16px' }}>← Volver</button>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Paso 2: Vuelos a {planData.paisFiltro}</span>
            </div>
            <div className="grid">
              {AMADEUS_VUELOS.filter(v => planData.paisFiltro === 'Todos' || v.pais === planData.paisFiltro).map(v => {
                const isSelected = reservaVuelo?.idVuelo === v.idVuelo;
                return (
                  <div key={v.idVuelo} className={`card ${isSelected ? 'selected-border' : ''}`} style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong>{v.aerolinea}</strong>
                      <span className="price-tag">${v.precioMXN.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                      ⏱ {v.duracion} · Escalas: {v.escalas}
                    </div>
                    {isSelected ? (
                      <div style={{ background: '#ecfdf5', color: '#065f46', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                        ✓ Apartado en Amadeus<br/>Order ID: <b>{reservaVuelo.orderId}</b>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => handleApartarVuelo(v)}>Apartar Vuelo</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Paso 3: Hospedajes en {planData.paisFiltro}</span></div>
            <div className="grid">
              {AMADEUS_HOSPEDAJES.filter(h => planData.paisFiltro === 'Todos' || h.pais === planData.paisFiltro).map(h => {
                const isSelected = reservaHospedaje?.idHotel === h.idHotel;
                return (
                  <div key={h.idHotel} className={`card ${isSelected ? 'selected-border' : ''}`} style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong>{h.nombre}</strong>
                      <span className="price-tag">${h.precioMXN.toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                      🛏 {h.camas} camas
                    </div>
                    {isSelected ? (
                      <div style={{ background: '#ecfdf5', color: '#065f46', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                        ✓ Apartado en Amadeus<br/>Order ID: <b>{reservaHospedaje.orderId}</b>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" style={{ width: '100%' }} onClick={() => handleApartarHospedaje(h)}>Apartar Hospedaje</button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!reservaVuelo || !reservaHospedaje}>Continuar a Presupuesto →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setStep(2)} style={{ marginBottom: '16px' }}>← Volver</button>
          <div className="card">
            <div className="card-header"><span className="card-title">Resumen de Cotización</span></div>
            <div className="list-item">
              <span>Vuelo {reservaVuelo.aerolinea} (1 pax)</span>
              <strong>${reservaVuelo.precioMXN.toLocaleString()}</strong>
            </div>
            <div className="list-item">
              <span>Hospedaje {reservaHospedaje.nombre}</span>
              <strong>${reservaHospedaje.precioMXN.toLocaleString()}</strong>
            </div>
            
            <div style={{ marginTop: '24px', padding: '24px', background: '#1e3a8a', color: 'white', borderRadius: '16px' }}>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>TOTAL COTIZADO</div>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>${(reservaVuelo.precioMXN + reservaHospedaje.precioMXN).toLocaleString()} MXN</div>
              <div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Cliente: {selectedClient.nombre} | Destino: {planData.destino}</div>
            </div>
            
            <button className="btn btn-primary" onClick={() => window.print()} style={{ width: '100%', marginTop: '16px' }}>
              🖨️ Imprimir Cotización
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
  const [clientes, setClientes] = useState(INITIAL_CLIENTES);

  if (!user) return <LoginScreen onLogin={setUser} usuarios={usuarios} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardModule user={user} usuarios={usuarios} clientes={clientes} />;
      case 'usuarios': return <UserManagementModule user={user} usuarios={usuarios} setUsuarios={setUsuarios} />;
      case 'clientes': return <ClientManagementModule user={user} clientes={clientes} setClientes={setClientes} />;
      case 'cotizacion': return <CotizacionFlow user={user} clientes={clientes} setClientes={setClientes} />;
      default: return <DashboardModule user={user} usuarios={usuarios} clientes={clientes} />;
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            ✈️ TravelPro
          </div>
          <div className="sidebar-menu">
            <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard
            </button>
            
            {(user.rol === 'gerente' || user.rol === 'jefe') && (
              <button className={`menu-item ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
                👥 Dar de alta {user.rol === 'gerente' ? 'Jefes' : 'Agentes'}
              </button>
            )}

            {user.rol === 'agente' && (
              <>
                <button className={`menu-item ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>
                  🙋‍♂️ Mis Clientes
                </button>
                <button className={`menu-item ${activeTab === 'cotizacion' ? 'active' : ''}`} onClick={() => setActiveTab('cotizacion')}>
                  💼 Nueva Cotización
                </button>
              </>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          <header className="topbar">
            <h1>Panel de Control</h1>
            <div className="user-profile">
              <span className="role-badge">{user.rol}</span>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{user.nombre}</span>
              <button className="btn-logout" onClick={() => { setUser(null); setActiveTab('dashboard'); }}>
                Salir
              </button>
            </div>
          </header>

          <div className="content-area">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
}

/* ============================================================
   RENDER
   ============================================================ */
const root = createRoot(document.getElementById('root'));
root.render(<App />);