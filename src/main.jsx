// main.jsx
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

/* ============================================================
   DATOS SIMULADOS (MOCK DATA)
   ============================================================ */
const FLIGHTS = [
  {
    id: 'F1', airline: 'Westyet', origin: 'Ciudad de México (MEX)', destination: 'París (ORY)',
    priceMXN: 11697, priceEUR: 558, durationIda: '27h 15min', durationVuelta: '17h 55min',
    scales: 1, scaleWhere: 'Canadá', requiresVisa: true, visaCost: 100, visaTime: '2-8 semanas',
    bagaje: 'Equipaje de mano'
  },
  {
    id: 'F2', airline: 'Iberia / Transavia', origin: 'Ciudad de México (MEX)', destination: 'París (ORY)',
    priceMXN: 13790, priceEUR: 658, durationIda: '15h 35min', durationVuelta: '16h 15min',
    scales: 1, scaleWhere: 'Madrid', requiresVisa: false, visaCost: 0, visaTime: 'N/A',
    bagaje: 'Equipaje de mano'
  }
];

const LODGINGS = [
  { id: 'L1', name: 'Airbnb Saint-Ouen', district: 'Suburbio (93)', address: 'Saint-Ouen-sur-Seine', priceMXN: 18032, priceEUR: 911, beds: 4, baths: 1, sharedBath: false, hasKitchen: true, hasWifi: true, distanceLouvre: '8 km', timeLouvre: '11-14 min metro', timeOrlyPublic: '35-56 min', timeOrlyTaxi: '36-52 min', rating: 4.2 },
  { id: 'L2', name: 'Rivoli Central Apartment', district: '1 (Louvre)', address: '8 Rue de Rivoli, 75001', priceMXN: 8814, priceEUR: 421, beds: 3, baths: 2, sharedBath: false, hasKitchen: true, hasWifi: true, distanceLouvre: '< 1 km', timeLouvre: '6-8 min a pie', timeOrlyPublic: '25-44 min', timeOrlyTaxi: '20-40 min', rating: 4.7 },
  { id: 'L3', name: 'Airbnb Bagnolet', district: 'Suburbio (93)', address: 'Bagnolet', priceMXN: 12461, priceEUR: 595, beds: 3, baths: 1, sharedBath: false, hasKitchen: true, hasWifi: true, distanceLouvre: '8 km', timeLouvre: '20-25 min', timeOrlyPublic: '52 min - 1h 13 min', timeOrlyTaxi: '21 min', rating: 4.0 },
  { id: 'L4', name: 'Champs Elysée Arc de Triomphe', district: '8', address: 'Cerca del Arco del Triunfo', priceMXN: 24230, priceEUR: 1157, beds: 4, baths: 1, sharedBath: false, hasKitchen: true, hasWifi: true, distanceLouvre: '4 km', timeLouvre: '15-20 min metro', timeOrlyPublic: '35 min - 1h 21 min', timeOrlyTaxi: '27 min', rating: 4.5 },
  { id: 'L5', name: 'UCPA Sport Station Hostel', district: '19', address: '28 allée Rose Dieng, 75019', priceMXN: 11847, priceEUR: 566, beds: 5, baths: 0, sharedBath: true, hasKitchen: false, hasWifi: true, distanceLouvre: '5 km', timeLouvre: '15 min RER', timeOrlyPublic: '42 min - 1h 20 min', timeOrlyTaxi: '29-37 min', rating: 4.1 }
];

const TRANSPORT = [
  { id: 'T1', name: 'Boleto sencillo', priceMXN: 53, priceEUR: 2.55, desc: 'Por viaje (metro, RER, bus)', zones: '1-5', includesAirport: false, days: 1, perPerson: true },
  { id: 'T2', name: 'Pase Semanal Navigo', priceMXN: 679, priceEUR: 32.40, desc: 'Viajes ilimitados, 7 días', zones: 'Todas', includesAirport: true, days: 7, perPerson: true },
  { id: 'T3', name: 'Paris Visite (5 días)', priceMXN: 1634, priceEUR: 78, desc: 'Viajes ilimitados zonas 1-5', zones: '1-5', includesAirport: true, days: 5, perPerson: true },
  { id: 'T4', name: 'Taxi Orly → Centro', priceMXN: 850, priceEUR: 40, desc: 'Trayecto único (hasta 5 personas)', zones: 'Aeropuerto-Centro', includesAirport: true, days: 1, perPerson: false }
];

const ESIMS = [
  { id: 'E1', provider: 'Orange Holiday Europe', priceMXN: 337.60, priceEUR: 17.21, data: '10 GB', days: 14, hasNumber: true, support: false, notes: 'Mejor calidad-precio' },
  { id: 'E2', provider: 'Airalo (Bonbon Mobile)', priceMXN: 489.80, priceEUR: 24.95, data: 'Ilimitado', days: 10, hasNumber: false, support: false, notes: 'Datos ilimitados, más económico' },
  { id: 'E3', provider: 'Holafly Francia', priceMXN: 616.50, priceEUR: 31.40, data: 'Ilimitado', days: 10, hasNumber: false, support: true, notes: 'Soporte 24/7 en español' }
];

const ADAPTERS = [
  { id: 'A1', name: 'Adaptador Básico', priceMXN: 253.37, priceEUR: 12.91, ports: 1, usbC: false, fastCharge: false, notes: 'Ligero y compacto' },
  { id: 'A2', name: 'Lencent', priceMXN: 449.00, priceEUR: 22.88, ports: 4, usbC: true, fastCharge: true, notes: 'Carga varios equipos a la vez' },
  { id: 'A3', name: 'Adaptador Desmontable', priceMXN: 659.00, priceEUR: 33.59, ports: 3, usbC: true, fastCharge: true, notes: 'USB-C PD ultrarrápida' }
];

/* ============================================================
   ESTILOS GLOBALES (APP PRINCIPAL)
   ============================================================ */
const globalCSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background: #f0f4f8; color: #1a202c; }
  button { font-family: inherit; cursor: pointer; }
  input, select { font-family: inherit; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px 32px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  .header h1 { font-size: 22px; font-weight: 700; }
  .header .user-info { display: flex; align-items: center; gap: 12px; }
  .header .avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .logout-btn { background: rgba(255,255,255,0.15); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 6px 14px; border-radius: 8px; font-size: 13px; transition: all 0.2s; }
  .logout-btn:hover { background: rgba(255,255,255,0.25); }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px 20px; width: 100%; flex: 1; }
  .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; background: white; padding: 8px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
  .tab { padding: 10px 18px; border-radius: 8px; border: none; background: transparent; color: #4a5568; font-weight: 600; font-size: 14px; transition: all 0.2s; }
  .tab:hover { background: #f7fafc; }
  .tab.active { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; }
  .tab-badge { display: inline-block; background: #f59e0b; color: white; border-radius: 10px; padding: 1px 7px; font-size: 11px; margin-left: 6px; }
  .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); margin-bottom: 16px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #edf2f7; }
  .card-title { font-size: 16px; font-weight: 700; color: #1e3a8a; }
  .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  .btn { padding: 10px 18px; border-radius: 8px; border: none; font-weight: 600; font-size: 14px; transition: all 0.2s; }
  .btn-primary { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-secondary { background: #edf2f7; color: #2d3748; }
  .btn-secondary:hover { background: #e2e8f0; }
  .btn-danger { background: #fed7d7; color: #c53030; }
  .btn-danger:hover { background: #feb2b2; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .badge-success { background: #c6f6d5; color: #22543d; }
  .badge-warning { background: #feebc8; color: #7b341e; }
  .badge-danger { background: #fed7d7; color: #742a2a; }
  .badge-info { background: #bee3f8; color: #2a4365; }
  .price { font-size: 22px; font-weight: 800; color: #1e3a8a; }
  .price-small { font-size: 13px; color: #718096; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #edf2f7; font-size: 14px; }
  .row:last-child { border-bottom: none; }
  .row .label { color: #4a5568; }
  .row .value { font-weight: 600; color: #1a202c; }
  .highlight { background: linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%); border: 2px solid #3b82f6; }
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; }
  .form-input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e0; border-radius: 8px; font-size: 14px; transition: border 0.2s; }
  .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .empty-state { text-align: center; padding: 40px 20px; color: #718096; }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
  .summary-total { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 24px; border-radius: 12px; margin: 16px 0; }
  .summary-total .label { font-size: 14px; opacity: 0.9; }
  .summary-total .amount { font-size: 36px; font-weight: 800; margin-top: 4px; }
  .summary-total .amount-small { font-size: 16px; opacity: 0.9; }
  .traveler-row { display: grid; grid-template-columns: 2fr 2fr auto; gap: 12px; align-items: center; padding: 12px; background: #f7fafc; border-radius: 8px; margin-bottom: 8px; }
  .expense-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 8px; align-items: center; padding: 10px; background: #f7fafc; border-radius: 8px; margin-bottom: 8px; font-size: 13px; }
  @media (max-width: 640px) {
    .header { padding: 16px; }
    .header h1 { font-size: 16px; }
    .traveler-row { grid-template-columns: 1fr; }
    .expense-row { grid-template-columns: 1fr 1fr; }
  }
  @media print {
    .header, .tabs, .btn, .logout-btn, .no-print { display: none !important; }
    .card { box-shadow: none; border: 1px solid #e2e8f0; page-break-inside: avoid; }
  }
`;

/* ============================================================
   ESTILOS DEL LOGIN (SEPARADOS PARA EVITAR CONFLICTOS)
   Prefijo: lp- (login page)
   ============================================================ */
const loginCSS = `
  .lp-screen { min-height: 100vh; display: grid; grid-template-columns: 1.1fr 1fr; background: #ffffff; }
  .lp-left { background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%); padding: 60px 48px; display: flex; flex-direction: column; justify-content: space-between; color: white; position: relative; overflow: hidden; }
  .lp-left::before { content: ""; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%); border-radius: 50%; top: -250px; right: -250px; }
  .lp-left::after { content: ""; position: absolute; width: 450px; height: 450px; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); border-radius: 50%; bottom: -180px; left: -180px; }
  .lp-brand { display: flex; align-items: center; gap: 14px; position: relative; z-index: 1; }
  .lp-brand-icon { font-size: 30px; background: rgba(255,255,255,0.18); width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
  .lp-brand-name { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
  .lp-hero { position: relative; z-index: 1; max-width: 480px; }
  .lp-hero h1 { font-size: 42px; font-weight: 800; line-height: 1.15; margin-bottom: 20px; letter-spacing: -1px; }
  .lp-hero p { font-size: 16px; line-height: 1.65; opacity: 0.92; margin-bottom: 36px; }
  .lp-features { display: flex; flex-direction: column; gap: 16px; }
  .lp-feature { display: flex; align-items: center; gap: 14px; font-size: 14px; opacity: 0.95; }
  .lp-feature-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.15); }
  .lp-footer-left { position: relative; z-index: 1; font-size: 12px; opacity: 0.7; }
  .lp-right { display: flex; align-items: center; justify-content: center; padding: 40px; background: #f7fafc; }
  .lp-form { width: 100%; max-width: 420px; }
  .lp-form-header { margin-bottom: 32px; }
  .lp-form-header h2 { font-size: 28px; font-weight: 800; color: #1a202c; margin-bottom: 8px; letter-spacing: -0.5px; }
  .lp-form-header p { color: #718096; font-size: 15px; }
  .lp-input-group { margin-bottom: 20px; }
  .lp-input-label { display: block; font-size: 13px; font-weight: 600; color: #2d3748; margin-bottom: 8px; }
  .lp-input-wrapper { position: relative; display: flex; align-items: center; }
  .lp-input-icon { position: absolute; left: 14px; font-size: 16px; color: #a0aec0; pointer-events: none; z-index: 1; }
  .lp-input { width: 100%; padding: 14px 14px 14px 46px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.2s; color: #1a202c; }
  .lp-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
  .lp-input::placeholder { color: #a0aec0; }
  .lp-toggle-password { position: absolute; right: 14px; background: none; border: none; font-size: 16px; color: #a0aec0; cursor: pointer; padding: 4px; transition: color 0.2s; }
  .lp-toggle-password:hover { color: #4a5568; }
  .lp-options { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-size: 13px; }
  .lp-checkbox { display: flex; align-items: center; gap: 8px; color: #4a5568; cursor: pointer; user-select: none; }
  .lp-checkbox input { width: 16px; height: 16px; accent-color: #3b82f6; cursor: pointer; }
  .lp-forgot { color: #3b82f6; text-decoration: none; font-weight: 600; transition: color 0.2s; }
  .lp-forgot:hover { color: #1e3a8a; }
  .lp-error { background: #fff5f5; border: 1px solid #feb2b2; color: #c53030; padding: 12px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
  .lp-submit { width: 100%; padding: 15px; border: none; border-radius: 10px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(59,130,246,0.35); letter-spacing: 0.3px; }
  .lp-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.45); }
  .lp-submit:active:not(:disabled) { transform: translateY(0); }
  .lp-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .lp-divider { display: flex; align-items: center; gap: 12px; margin: 24px 0; color: #a0aec0; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .lp-divider::before, .lp-divider::after { content: ""; flex: 1; height: 1px; background: #e2e8f0; }
  .lp-demo { background: #ebf8ff; border: 1px dashed #90cdf4; border-radius: 10px; padding: 14px 16px; font-size: 13px; color: #2c5282; line-height: 1.7; }
  .lp-demo strong { color: #1e3a8a; }
  .lp-demo code { background: white; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; font-size: 12px; color: #c53030; font-weight: 600; }
  @media (max-width: 900px) {
    .lp-screen { grid-template-columns: 1fr; }
    .lp-left { display: none; }
    .lp-right { padding: 24px; }
  }
`;

/* ============================================================
   COMPONENTES REUTILIZABLES
   ============================================================ */
function Card({ children, highlight, className = '' }) {
  return <div className={`card ${highlight ? 'highlight' : ''} ${className}`}>{children}</div>;
}

function EmptyState({ icon, message }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <p>{message}</p>
    </div>
  );
}

/* ============================================================
   LOGIN MEJORADO
   ============================================================ */
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('agente@viajes.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Completa todos los campos');
      return;
    }
    if (!email.includes('@')) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({
        email,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        rememberMe
      });
    }, 800);
  };

  return (
    <>
      <style>{loginCSS}</style>
      <div className="lp-screen">
        {/* LADO IZQUIERDO: BRANDING */}
        <div className="lp-left">
          <div className="lp-brand">
            <div className="lp-brand-icon">✈️</div>
            <span className="lp-brand-name">TravelPro</span>
          </div>

          <div className="lp-hero">
            <h1>Gestiona presupuestos de viaje en minutos.</h1>
            <p>
              Compara vuelos, hospedajes y transporte de cualquier destino del mundo.
              Genera cotizaciones profesionales para tus clientes sin hojas de cálculo.
            </p>

            <div className="lp-features">
              <div className="lp-feature">
                <div className="lp-feature-icon">🌍</div>
                <span>Búsqueda global de vuelos y hospedajes</span>
              </div>
              <div className="lp-feature">
                <div className="lp-feature-icon">💰</div>
                <span>Cálculo automático de costos por persona</span>
              </div>
              <div className="lp-feature">
                <div className="lp-feature-icon">📄</div>
                <span>Cotizaciones profesionales en PDF</span>
              </div>
              <div className="lp-feature">
                <div className="lp-feature-icon">🔒</div>
                <span>Datos seguros y respaldados</span>
              </div>
            </div>
          </div>

          <div className="lp-footer-left">
            © 2026 TravelPro · Todos los derechos reservados
          </div>
        </div>

        {/* LADO DERECHO: FORMULARIO */}
        <div className="lp-right">
          <div className="lp-form">
            <div className="lp-form-header">
              <h2>Bienvenido de vuelta</h2>
              <p>Ingresa a tu cuenta para comenzar a planificar viajes</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="lp-input-group">
                <label className="lp-input-label">Correo electrónico</label>
                <div className="lp-input-wrapper">
                  <span className="lp-input-icon">📧</span>
                  <input
                    type="email"
                    className="lp-input"
                    placeholder="tu@agencia.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="lp-input-group">
                <label className="lp-input-label">Contraseña</label>
                <div className="lp-input-wrapper">
                  <span className="lp-input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="lp-input"
                    placeholder="........"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lp-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="lp-options">
                <label className="lp-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  Recordarme
                </label>
                <a
                  href="#forgot"
                  className="lp-forgot"
                  onClick={e => { e.preventDefault(); alert('Función de recuperación de contraseña (simulada)'); }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {error && (
                <div className="lp-error">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="lp-submit" disabled={loading}>
                {loading ? '⏳ Iniciando sesión...' : '→ Iniciar sesión'}
              </button>
            </form>

            <div className="lp-divider">CREDENCIALES DEMO</div>

            <div className="lp-demo">
              <strong>Usuario:</strong> <code>agente@viajes.com</code><br />
              <strong>Contraseña:</strong> <code>demo1234</code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   MÓDULO VUELOS
   ============================================================ */
function FlightsModule({ tripData, selected, onSelect }) {
  const [filters, setFilters] = useState({ maxPrice: '', maxDuration: '' });
  const results = FLIGHTS.filter(f => {
    if (filters.maxPrice && f.priceMXN > Number(filters.maxPrice)) return false;
    return true;
  });

  return (
    <div>
      <Card>
        <div className="card-header"><span className="card-title">🔍 Filtros de búsqueda</span></div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Precio máximo (MXN)</label>
            <input className="form-input" type="number" placeholder="Ej. 15000" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Duración máxima</label>
            <input className="form-input" type="text" placeholder="Ej. 20h" value={filters.maxDuration} onChange={e => setFilters({...filters, maxDuration: e.target.value})} />
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#718096' }}>Ruta: {tripData.origin} → {tripData.destination} · {tripData.travelers} viajeros</p>
      </Card>

      <div className="grid">
        {results.map(f => (
          <Card key={f.id} highlight={selected?.id === f.id}>
            <div className="card-header">
              <span className="card-title">{f.airline}</span>
              {f.requiresVisa ? <span className="badge badge-warning">Requiere visa</span> : <span className="badge badge-success">Sin visa</span>}
            </div>
            <div className="price">${f.priceMXN.toLocaleString()} MXN</div>
            <div className="price-small">≈ €{f.priceEUR} por persona</div>
            <div style={{ marginTop: 12 }}>
              <div className="row"><span className="label">Ida</span><span className="value">{f.durationIda}</span></div>
              <div className="row"><span className="label">Vuelta</span><span className="value">{f.durationVuelta}</span></div>
              <div className="row"><span className="label">Escala en</span><span className="value">{f.scaleWhere}</span></div>
              <div className="row"><span className="label">Equipaje</span><span className="value">{f.bagaje}</span></div>
              {f.requiresVisa && (
                <div className="row"><span className="label">Visa</span><span className="value">{f.visaCost} CAD · {f.visaTime}</span></div>
              )}
            </div>
            <button className={`btn ${selected?.id === f.id ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', marginTop: 14 }} onClick={() => onSelect(f)}>
              {selected?.id === f.id ? '✓ Seleccionado' : 'Seleccionar vuelo'}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   MÓDULO HOSPEDAJES
   ============================================================ */
function LodgingsModule({ tripData, selected, onSelect }) {
  return (
    <div className="grid">
      {LODGINGS.map(l => {
        const costPerBed = Math.round(l.priceMXN / l.beds);
        const costPerPerson = Math.round(l.priceMXN / tripData.travelers);
        return (
          <Card key={l.id} highlight={selected?.id === l.id}>
            <div className="card-header">
              <span className="card-title">{l.name}</span>
              <span className="badge badge-info">★ {l.rating}</span>
            </div>
            <div className="price">${l.priceMXN.toLocaleString()} MXN</div>
            <div className="price-small">≈ €{l.priceEUR} total · 5 noches</div>
            <div style={{ marginTop: 12 }}>
              <div className="row"><span className="label">Distrito</span><span className="value">{l.district}</span></div>
              <div className="row"><span className="label">Dirección</span><span className="value" style={{fontSize:12}}>{l.address}</span></div>
              <div className="row"><span className="label">Camas</span><span className="value">{l.beds}</span></div>
              <div className="row"><span className="label">Baños</span><span className="value">{l.sharedBath ? 'Compartido' : l.baths}</span></div>
              <div className="row"><span className="label">Cocina</span><span className="value">{l.hasKitchen ? 'Sí' : 'No'}</span></div>
              <div className="row"><span className="label">Al Louvre</span><span className="value">{l.distanceLouvre} · {l.timeLouvre}</span></div>
              <div className="row"><span className="label">Desde Orly (público)</span><span className="value" style={{fontSize:12}}>{l.timeOrlyPublic}</span></div>
              <div className="row"><span className="label">Desde Orly (taxi)</span><span className="value" style={{fontSize:12}}>{l.timeOrlyTaxi}</span></div>
              <div className="row"><span className="label">Costo / cama</span><span className="value">${costPerBed.toLocaleString()}</span></div>
              <div className="row"><span className="label">Costo / persona</span><span className="value">${costPerPerson.toLocaleString()}</span></div>
            </div>
            <button className={`btn ${selected?.id === l.id ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', marginTop: 14 }} onClick={() => onSelect(l)}>
              {selected?.id === l.id ? '✓ Seleccionado' : 'Seleccionar hospedaje'}
            </button>
          </Card>
        );
      })}
    </div>
  );
}

/* ============================================================
   MÓDULO TRANSPORTE
   ============================================================ */
function TransportModule({ tripData, selected, onSelect }) {
  return (
    <div className="grid">
      {TRANSPORT.map(t => {
        const total = t.perPerson ? t.priceMXN * tripData.travelers : t.priceMXN;
        return (
          <Card key={t.id} highlight={selected?.id === t.id}>
            <div className="card-header">
              <span className="card-title">{t.name}</span>
              {t.includesAirport && <span className="badge badge-success">Incluye aeropuerto</span>}
            </div>
            <div className="price">${t.priceMXN.toLocaleString()} MXN</div>
            <div className="price-small">{t.perPerson ? 'por persona' : 'por grupo'} · ≈ €{t.priceEUR}</div>
            <div style={{ marginTop: 12 }}>
              <div className="row"><span className="label">Descripción</span><span className="value" style={{fontSize:12}}>{t.desc}</span></div>
              <div className="row"><span className="label">Zonas</span><span className="value">{t.zones}</span></div>
              <div className="row"><span className="label">Validez</span><span className="value">{t.days} día(s)</span></div>
              <div className="row"><span className="label">Costo total estimado</span><span className="value">${total.toLocaleString()}</span></div>
            </div>
            <button className={`btn ${selected?.id === t.id ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '100%', marginTop: 14 }} onClick={() => onSelect(t)}>
              {selected?.id === t.id ? '✓ Seleccionado' : 'Seleccionar transporte'}
            </button>
          </Card>
        );
      })}
    </div>
  );
}

/* ============================================================
   MÓDULO VIAJEROS
   ============================================================ */
function TravelersModule({ travelers, setTravelers }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const add = () => {
    if (!name.trim()) return;
    setTravelers([...travelers, { id: Date.now(), name: name.trim(), email: email.trim() }]);
    setName(''); setEmail('');
  };

  const remove = (id) => setTravelers(travelers.filter(t => t.id !== id));

  return (
    <Card>
      <div className="card-header">
        <span className="card-title">👥 Gestión de viajeros ({travelers.length})</span>
      </div>
      <div className="form-row" style={{ marginBottom: 16 }}>
        <div className="form-group">
          <label className="form-label">Nombre completo</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Juan Pérez" />
        </div>
        <div className="form-group">
          <label className="form-label">Correo electrónico</label>
          <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="juan@email.com" />
        </div>
      </div>
      <button className="btn btn-primary btn-sm" onClick={add}>+ Agregar viajero</button>

      <div style={{ marginTop: 20 }}>
        {travelers.length === 0 ? (
          <EmptyState icon="👤" message="Aún no hay viajeros registrados" />
        ) : (
          travelers.map(t => (
            <div key={t.id} className="traveler-row">
              <div><strong>{t.name}</strong></div>
              <div style={{ color: '#718096', fontSize: 13 }}>{t.email || '—'}</div>
              <button className="btn btn-danger btn-sm" onClick={() => remove(t.id)}>Eliminar</button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

/* ============================================================
   MÓDULO GASTOS PERSONALES
   ============================================================ */
function PersonalExpensesModule({ travelers, expenses, setExpenses }) {
  const [form, setForm] = useState({ travelerId: '', type: 'eSIM', description: '', costMXN: '' });

  const add = () => {
    if (!form.travelerId || !form.costMXN) return;
    setExpenses([...expenses, { id: Date.now(), ...form, costMXN: Number(form.costMXN) }]);
    setForm({ travelerId: '', type: 'eSIM', description: '', costMXN: '' });
  };

  const remove = (id) => setExpenses(expenses.filter(e => e.id !== id));

  const addCatalogItem = (travelerId, type, description, costMXN) => {
    setExpenses([...expenses, { id: Date.now(), travelerId: Number(travelerId), type, description, costMXN }]);
  };

  return (
    <div>
      <Card>
        <div className="card-header"><span className="card-title">💰 Registrar gasto personal</span></div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Viajero</label>
            <select className="form-input" value={form.travelerId} onChange={e => setForm({...form, travelerId: e.target.value})}>
              <option value="">Selecciona...</option>
              {travelers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Tipo de gasto</label>
            <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="eSIM">eSIM / Chip de datos</option>
              <option value="Adaptador">Adaptador de corriente</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Visa">Visa</option>
              <option value="Seguro">Seguro de viaje</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Ej. Orange Holiday Europe" />
          </div>
          <div className="form-group">
            <label className="form-label">Costo (MXN)</label>
            <input className="form-input" type="number" value={form.costMXN} onChange={e => setForm({...form, costMXN: e.target.value})} placeholder="337.60" />
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={add}>+ Agregar gasto</button>
      </Card>

      {travelers.length > 0 && (
        <Card>
          <div className="card-header"><span className="card-title">📦 Catálogos rápidos</span></div>
          {travelers.map(t => (
            <div key={t.id} style={{ marginBottom: 16, padding: 12, background: '#f7fafc', borderRadius: 8 }}>
              <strong style={{ fontSize: 14 }}>{t.name}</strong>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ESIMS.map(e => (
                  <button key={e.id} className="btn btn-secondary btn-sm" onClick={() => addCatalogItem(t.id, 'eSIM', e.provider, e.priceMXN)}>
                    + {e.provider} (${e.priceMXN})
                  </button>
                ))}
                {ADAPTERS.map(a => (
                  <button key={a.id} className="btn btn-secondary btn-sm" onClick={() => addCatalogItem(t.id, 'Adaptador', a.name, a.priceMXN)}>
                    + {a.name} (${a.priceMXN})
                  </button>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={() => addCatalogItem(t.id, 'Pasaporte', 'Pasaporte 3 años', 1795)}>
                  + Pasaporte 3 años ($1,795)
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => addCatalogItem(t.id, 'Visa', 'Visa Canadá', 1400)}>
                  + Visa Canadá ($1,400)
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <div className="card-header"><span className="card-title">📋 Gastos registrados ({expenses.length})</span></div>
        {expenses.length === 0 ? (
          <EmptyState icon="💳" message="No hay gastos personales registrados" />
        ) : (
          expenses.map(e => {
            const traveler = travelers.find(t => t.id === e.travelerId);
            return (
              <div key={e.id} className="expense-row">
                <span>{traveler?.name || '—'}</span>
                <span className="badge badge-info">{e.type}</span>
                <span>{e.description || '—'}</span>
                <span><strong>${e.costMXN.toLocaleString()}</strong></span>
                <button className="btn btn-danger btn-sm" onClick={() => remove(e.id)}>×</button>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

/* ============================================================
   MÓDULO RESUMEN / PRESUPUESTO
   ============================================================ */
function SummaryModule({ tripData, flight, lodging, transport, travelers, expenses }) {
  const n = travelers.length || tripData.travelers;

  const flightTotal = flight ? flight.priceMXN * n : 0;
  const lodgingTotal = lodging ? lodging.priceMXN : 0;
  const transportTotal = transport ? (transport.perPerson ? transport.priceMXN * n : transport.priceMXN) : 0;

  const sharedTotal = flightTotal + lodgingTotal + transportTotal;
  const sharedPerPerson = n > 0 ? sharedTotal / n : 0;

  const personalTotals = travelers.map(t => {
    const total = expenses.filter(e => e.travelerId === t.id).reduce((sum, e) => sum + e.costMXN, 0);
    return { ...t, personalTotal: total, grandTotal: sharedPerPerson + total };
  });

  const personalGrandTotal = personalTotals.reduce((sum, t) => sum + t.personalTotal, 0);
  const groupGrandTotal = sharedTotal + personalGrandTotal;

  const missing = [];
  if (!flight) missing.push('vuelo');
  if (!lodging) missing.push('hospedaje');
  if (!transport) missing.push('transporte');
  if (travelers.length === 0) missing.push('al menos un viajero');

  return (
    <div>
      {missing.length > 0 && (
        <Card>
          <div style={{ padding: 12, background: '#fffaf0', border: '1px solid #f6ad55', borderRadius: 8 }}>
            <strong>⚠️ Faltan datos:</strong> {missing.join(', ')}.
          </div>
        </Card>
      )}

      <Card>
        <div className="card-header"><span className="card-title">📊 Desglose de costos compartidos</span></div>
        <div className="row"><span className="label">Vuelos ({n} × ${flight?.priceMXN.toLocaleString() || 0})</span><span className="value">${flightTotal.toLocaleString()}</span></div>
        <div className="row"><span className="label">Hospedaje (5 noches)</span><span className="value">${lodgingTotal.toLocaleString()}</span></div>
        <div className="row"><span className="label">Transporte local</span><span className="value">${transportTotal.toLocaleString()}</span></div>
        <div className="row" style={{ borderTop: '2px solid #1e3a8a', marginTop: 8, paddingTop: 12 }}>
          <span className="label" style={{ fontWeight: 700 }}>Total compartido</span>
          <span className="value" style={{ fontSize: 18 }}>${sharedTotal.toLocaleString()}</span>
        </div>
        <div className="row">
          <span className="label">Costo compartido por persona</span>
          <span className="value">${sharedPerPerson.toFixed(2)}</span>
        </div>
      </Card>

      <Card>
        <div className="card-header"><span className="card-title">👤 Costos individuales por viajero</span></div>
        {personalTotals.length === 0 ? (
          <EmptyState icon="👥" message="Agrega viajeros para ver el desglose individual" />
        ) : (
          personalTotals.map(t => (
            <div key={t.id} style={{ padding: 12, background: '#f7fafc', borderRadius: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <strong>{t.name}</strong>
                <strong style={{ color: '#1e3a8a' }}>${t.grandTotal.toFixed(2)} MXN</strong>
              </div>
              <div className="row"><span className="label">Compartido</span><span className="value">${sharedPerPerson.toFixed(2)}</span></div>
              <div className="row"><span className="label">Gastos personales</span><span className="value">${t.personalTotal.toFixed(2)}</span></div>
            </div>
          ))
        )}
      </Card>

      <div className="summary-total">
        <div className="label">TOTAL DEL GRUPO ({n} viajeros)</div>
        <div className="amount">${groupGrandTotal.toLocaleString()} MXN</div>
        <div className="amount-small">≈ €{(groupGrandTotal / 21).toFixed(2)} EUR · Promedio por persona: ${(groupGrandTotal / n).toFixed(2)} MXN</div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }} className="no-print">
        <button className="btn btn-primary" onClick={() => window.print()} disabled={missing.length > 0}>
          📄 Exportar presupuesto a PDF
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   APP PRINCIPAL
   ============================================================ */
function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('flights');
  const [tripData] = useState({ origin: 'Ciudad de México', destination: 'París', travelers: 5, nights: 5 });
  const [flight, setFlight] = useState(null);
  const [lodging, setLodging] = useState(null);
  const [transport, setTransport] = useState(null);
  const [travelers, setTravelers] = useState([
    { id: 1, name: 'Andrés Martínez', email: 'andres@email.com' },
    { id: 2, name: 'Misael Cruz', email: 'misael@email.com' },
    { id: 3, name: 'Jesús Ayala', email: 'jesus@email.com' },
    { id: 4, name: 'David Millán', email: 'david@email.com' },
    { id: 5, name: 'Mesías Hernández', email: 'mesias@email.com' }
  ]);
  const [expenses, setExpenses] = useState([]);

  const tabs = useMemo(() => [
    { id: 'flights', label: '✈️ Vuelos', badge: flight ? '✓' : null },
    { id: 'lodgings', label: '🏨 Hospedajes', badge: lodging ? '✓' : null },
    { id: 'transport', label: '🚇 Transporte', badge: transport ? '✓' : null },
    { id: 'travelers', label: '👥 Viajeros', badge: travelers.length },
    { id: 'expenses', label: '💳 Gastos personales', badge: expenses.length || null },
    { id: 'summary', label: '📊 Presupuesto final' }
  ], [flight, lodging, transport, travelers, expenses]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app">
        <header className="header">
          <h1>✈️ TravelPro — Gestión de Presupuestos</h1>
          <div className="user-info">
            <div className="avatar">{user.name[0].toUpperCase()}</div>
            <span style={{ fontSize: 14 }}>{user.name}</span>
            <button className="logout-btn" onClick={() => setUser(null)}>Salir</button>
          </div>
        </header>

        <div className="container">
          <div className="tabs">
            {tabs.map(t => (
              <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.label}
                {t.badge !== null && t.badge !== undefined && <span className="tab-badge">{t.badge}</span>}
              </button>
            ))}
          </div>

          {activeTab === 'flights' && <FlightsModule tripData={tripData} selected={flight} onSelect={setFlight} />}
          {activeTab === 'lodgings' && <LodgingsModule tripData={tripData} selected={lodging} onSelect={setLodging} />}
          {activeTab === 'transport' && <TransportModule tripData={tripData} selected={transport} onSelect={setTransport} />}
          {activeTab === 'travelers' && <TravelersModule travelers={travelers} setTravelers={setTravelers} />}
          {activeTab === 'expenses' && <PersonalExpensesModule travelers={travelers} expenses={expenses} setExpenses={setExpenses} />}
          {activeTab === 'summary' && <SummaryModule tripData={tripData} flight={flight} lodging={lodging} transport={transport} travelers={travelers} expenses={expenses} />}
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