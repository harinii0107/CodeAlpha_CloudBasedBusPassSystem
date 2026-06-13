import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Bus,
  CalendarDays,
  CheckCircle2,
  Cloud,
  CreditCard,
  Download,
  Gauge,
  LockKeyhole,
  MapPin,
  QrCode,
  RefreshCw,
  Route,
  ShieldCheck,
  TicketCheck,
  Users,
  Zap
} from "lucide-react";
import { saveBookingToCloud } from "./services/cloudStore";
import "./styles.css";

const ROUTES = [
  {
    id: "metro-loop",
    from: "Central Terminal",
    to: "Tech Park",
    distance: 18,
    baseFare: 55,
    duration: "42 min",
    demand: "High"
  },
  {
    id: "airport-link",
    from: "City Center",
    to: "Airport",
    distance: 32,
    baseFare: 95,
    duration: "58 min",
    demand: "Medium"
  },
  {
    id: "college-express",
    from: "North Campus",
    to: "Railway Station",
    distance: 14,
    baseFare: 40,
    duration: "35 min",
    demand: "Low"
  },
  {
    id: "suburban-pass",
    from: "Old Market",
    to: "Green Valley",
    distance: 25,
    baseFare: 70,
    duration: "51 min",
    demand: "Medium"
  }
];

const PASS_TYPES = {
  oneWay: { label: "One Way", multiplier: 1, validity: "Valid for selected date" },
  weekly: { label: "Weekly Pass", multiplier: 5.5, validity: "7 days unlimited rides" },
  monthly: { label: "Monthly Pass", multiplier: 18, validity: "30 days unlimited rides" },
  student: { label: "Student Pass", multiplier: 0.7, validity: "ID verification required" }
};

function getLocalDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const today = getLocalDateInputValue();

function calculateFare(route, passType) {
  const raw = route.baseFare * PASS_TYPES[passType].multiplier;
  return Math.round(raw);
}

function buildTicketId() {
  const body = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CBP-${new Date().getFullYear()}-${body}`;
}

function App() {
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0].id);
  const [passType, setPassType] = useState("oneWay");
  const [travelDate, setTravelDate] = useState(today);
  const [passenger, setPassenger] = useState("Aarav Sharma");
  const [email, setEmail] = useState("aarav@example.com");
  const [bookings, setBookings] = useState([]);
  const [cloudStatus, setCloudStatus] = useState("Ready");
  const [load, setLoad] = useState(62);

  const selectedRoute = useMemo(
    () => ROUTES.find((route) => route.id === selectedRouteId),
    [selectedRouteId]
  );

  const fare = calculateFare(selectedRoute, passType);
  const requiredServers = Math.max(2, Math.ceil(load / 28));
  const loadState = load > 75 ? "Scaling up" : load < 30 ? "Optimized" : "Balanced";

  async function handleBooking(event) {
    event.preventDefault();
    const booking = {
      id: buildTicketId(),
      passenger: passenger.trim(),
      email: email.trim(),
      route: `${selectedRoute.from} to ${selectedRoute.to}`,
      routeId: selectedRoute.id,
      passType,
      passLabel: PASS_TYPES[passType].label,
      travelDate,
      fare,
      issuedAt: new Date().toISOString(),
      checksum: btoa(`${selectedRoute.id}-${passType}-${travelDate}-${fare}`).slice(0, 12)
    };

    setBookings((current) => [booking, ...current]);
    setCloudStatus("Syncing");
    const result = await saveBookingToCloud(booking);
    setCloudStatus(result.ok ? "Cloud saved" : "Offline backup saved");
  }

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div className="hero-copy">
          <div className="eyebrow">
            <Cloud size={18} />
            Cloud hosted digital bus pass system
          </div>
          <h1>CodeAlpha Cloud Based Bus Pass System</h1>
          <p>
            Book verified digital passes, prevent ticket loss with QR records, lock pricing to
            route rules, and scale capacity automatically during high traffic.
          </p>
          <div className="hero-actions">
            <a href="#booking" className="primary-action">
              <TicketCheck size={18} />
              Book Pass
            </a>
            <a href="#operations" className="ghost-action">
              <Gauge size={18} />
              View Cloud Load
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Bus pass system preview">
          <div className="transit-map">
            <span className="station station-a" />
            <span className="station station-b" />
            <span className="station station-c" />
            <span className="station station-d" />
            <Bus className="map-bus" size={44} />
          </div>
          <div className="hero-pass">
            <QrCode size={56} />
            <div>
              <strong>Digital Pass</strong>
              <span>Encrypted QR validation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-strip" aria-label="System benefits">
        <Metric icon={ShieldCheck} label="Loss prevention" value="Cloud QR pass" />
        <Metric icon={LockKeyhole} label="Fare protection" value="Rule checked" />
        <Metric icon={Zap} label="Provisioning" value={`${requiredServers} live servers`} />
        <Metric icon={Activity} label="Reliability" value="99.9% target" />
      </section>

      <section className="workspace-grid">
        <form className="booking-panel" id="booking" onSubmit={handleBooking}>
          <div className="section-heading">
            <span>Passenger Booking</span>
            <CheckCircle2 size={20} />
          </div>

          <label>
            Passenger Name
            <input
              required
              value={passenger}
              onChange={(event) => setPassenger(event.target.value)}
              placeholder="Enter passenger name"
            />
          </label>

          <label>
            Email for Digital Pass
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="passenger@example.com"
            />
          </label>

          <label>
            Route
            <select value={selectedRouteId} onChange={(event) => setSelectedRouteId(event.target.value)}>
              {ROUTES.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.from} to {route.to}
                </option>
              ))}
            </select>
          </label>

          <div className="pass-options">
            {Object.entries(PASS_TYPES).map(([key, pass]) => (
              <button
                type="button"
                className={passType === key ? "active" : ""}
                key={key}
                onClick={() => setPassType(key)}
              >
                {pass.label}
              </button>
            ))}
          </div>

          <label>
            Travel Date
            <input
              required
              type="date"
              min={today}
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
            />
          </label>

          <div className="fare-box">
            <div>
              <span>Validated fare</span>
              <strong>₹{fare}</strong>
            </div>
            <p>{PASS_TYPES[passType].validity}. Pricing is calculated from protected route rules.</p>
          </div>

          <button className="submit-button" type="submit">
            <CreditCard size={18} />
            Generate Secure Pass
          </button>
        </form>

        <section className="route-panel">
          <div className="section-heading">
            <span>Route Intelligence</span>
            <Route size={20} />
          </div>
          <div className="route-card">
            <MapPin size={22} />
            <div>
              <h2>{selectedRoute.from}</h2>
              <p>Starting point</p>
            </div>
          </div>
          <div className="route-line" />
          <div className="route-card">
            <MapPin size={22} />
            <div>
              <h2>{selectedRoute.to}</h2>
              <p>{selectedRoute.distance} km, {selectedRoute.duration}</p>
            </div>
          </div>
          <div className="route-data">
            <span>Demand</span>
            <strong>{selectedRoute.demand}</strong>
            <span>Base fare</span>
            <strong>₹{selectedRoute.baseFare}</strong>
          </div>
        </section>
      </section>

      <section className="operations-band" id="operations">
        <div>
          <div className="section-heading">
            <span>Cloud Operations</span>
            <RefreshCw size={20} />
          </div>
          <p>
            The app is prepared for Firebase Hosting and Vercel free deployment. Bookings sync to
            Firestore when Firebase environment values are added, with local backup during setup.
          </p>
        </div>
        <div className="load-control">
          <label htmlFor="traffic-load">Simulated traffic load</label>
          <input
            id="traffic-load"
            type="range"
            min="10"
            max="100"
            value={load}
            onChange={(event) => setLoad(Number(event.target.value))}
          />
          <div className="cloud-grid">
            <StatusCard icon={Users} label="Current Load" value={`${load}%`} />
            <StatusCard icon={Zap} label="Provisioned Servers" value={requiredServers} />
            <StatusCard icon={Activity} label="Auto Scaling" value={loadState} />
            <StatusCard icon={Cloud} label="Cloud Sync" value={cloudStatus} />
          </div>
        </div>
      </section>

      <section className="ticket-history">
        <div className="section-heading">
          <span>Issued Digital Passes</span>
          <CalendarDays size={20} />
        </div>
        {bookings.length === 0 ? (
          <div className="empty-state">
            <QrCode size={46} />
            <p>No passes generated yet. Create a booking to issue a secure QR ticket.</p>
          </div>
        ) : (
          <div className="ticket-grid">
            {bookings.map((booking) => (
              <article className="ticket-card" key={booking.id}>
                <div className="ticket-top">
                  <div>
                    <strong>{booking.id}</strong>
                    <span>{booking.passLabel}</span>
                  </div>
                  <QrCode size={42} />
                </div>
                <p>{booking.route}</p>
                <div className="ticket-meta">
                  <span>{booking.passenger}</span>
                  <span>{booking.travelDate}</span>
                  <span>₹{booking.fare}</span>
                </div>
                <button type="button" onClick={() => window.print()}>
                  <Download size={16} />
                  Save Pass
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="metric">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value }) {
  return (
    <div className="status-card">
      <Icon size={22} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
