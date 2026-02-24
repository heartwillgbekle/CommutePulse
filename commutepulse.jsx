import { useState } from "react";

const routes = [
  { id: "r1", name: "Colby Shuttle — Downtown Loop", short: "Downtown", status: "delayed", delay: 11, crowding: "high", confidence: 87, reports: 14, riders: 9, ontime: 62 },
  { id: "r2", name: "Colby Shuttle — Hospital Run", short: "Hospital", status: "on-time", delay: 0, crowding: "low", confidence: 91, reports: 6, riders: 5, ontime: 88 },
  { id: "r3", name: "Colby Evening Express", short: "Evening", status: "delayed", delay: 7, crowding: "medium", confidence: 64, reports: 4, riders: 3, ontime: 71 },
  { id: "r4", name: "Waterville City Bus — Rte 6", short: "City Rte 6", status: "not-running", delay: null, crowding: null, confidence: 93, reports: 3, riders: 3, ontime: 45 },
  { id: "r5", name: "Waterville City Bus — Rte 2", short: "City Rte 2", status: "on-time", delay: 2, crowding: "low", confidence: 78, reports: 2, riders: 2, ontime: 81 },
];

const recentReports = [
  { route: "Downtown", type: "late", delay: 12, stop: "Mayflower Hill Dr", mins: 3, user: "cs_major" },
  { route: "Downtown", type: "full", delay: null, stop: "Johnson Pond Rd", mins: 6, user: "anon_7x2" },
  { route: "Hospital", type: "arrived", delay: 0, stop: "Eustis Pkwy", mins: 8, user: "anon_3f9" },
  { route: "Evening", type: "late", delay: 8, stop: "Main St & Silver", mins: 11, user: "faculty_42" },
  { route: "City Rte 6", type: "not_running", delay: null, stop: "Kennedy Memorial Dr", mins: 14, user: "anon_k8q" },
];

const reliability = [
  { day: "Mon", pct: 72 }, { day: "Tue", pct: 68 }, { day: "Wed", pct: 55 },
  { day: "Thu", pct: 80 }, { day: "Fri", pct: 61 }, { day: "Sat", pct: 90 }, { day: "Sun", pct: 88 },
];

const statusMeta = {
  "on-time":    { label: "On Time",     bg: "#0e7a45", dot: "#2dde8f", text: "#fff" },
  "delayed":    { label: "Delayed",     bg: "#7c2d12", dot: "#fb923c", text: "#fff" },
  "not-running":{ label: "Not Running", bg: "#1e1b4b", dot: "#818cf8", text: "#fff" },
};

const reportTypes = [
  { id: "arrived",     emoji: "✅", label: "Arrived on time" },
  { id: "late",        emoji: "⏱️", label: "Running late" },
  { id: "full",        emoji: "🚌", label: "Bus is full" },
  { id: "skipped",     emoji: "⏩", label: "Skipped my stop" },
  { id: "not_running", emoji: "🚫", label: "Not running" },
];

const delays = [5, 10, 15, 20, 30];

const stops = ["Mayflower Hill Dr", "Roberts Union", "Johnson Pond Rd", "Dana Hall", "Eustis Pkwy", "Main St & Silver"];

function ConfidenceBar({ value }) {
  const color = value >= 80 ? "#2dde8f" : value >= 55 ? "#fb923c" : "#f87171";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, background: "#1e293b", borderRadius: 99, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 99, transition: "width .5s" }} />
      </div>
      <span style={{ fontSize: 11, color, fontFamily: "monospace", minWidth: 34 }}>{value}%</span>
    </div>
  );
}

function RouteCard({ route, onClick, selected }) {
  const meta = statusMeta[route.status];
  return (
    <div onClick={() => onClick(route)} style={{
      cursor: "pointer",
      background: selected ? "#0f172a" : "#0b1220",
      border: `1.5px solid ${selected ? meta.dot : "#1e293b"}`,
      borderRadius: 14,
      padding: "16px 18px",
      transition: "all .2s",
      boxShadow: selected ? `0 0 0 3px ${meta.dot}22` : "none",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 3, fontFamily: "'Syne', sans-serif", letterSpacing: 1, textTransform: "uppercase", fontSize: 10 }}>
            {route.name.includes("Colby") ? "Colby Shuttle" : "Waterville City Bus"}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>{route.short}</div>
        </div>
        <span style={{
          background: meta.bg,
          color: meta.text,
          borderRadius: 99,
          padding: "3px 10px",
          fontSize: 11,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: "monospace",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot, display: "inline-block" }} />
          {meta.label}{route.delay > 0 ? ` +${route.delay}m` : ""}
        </span>
      </div>
      <ConfidenceBar value={route.confidence} />
      <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
        {[
          ["📋", `${route.reports} reports`],
          ["👥", `${route.riders} riders`],
          ["📈", `${route.ontime}% on-time`],
        ].map(([icon, val]) => (
          <span key={val} style={{ fontSize: 11, color: "#64748b" }}>{icon} {val}</span>
        ))}
      </div>
    </div>
  );
}

function ReliabilityChart({ data }) {
  const max = 100;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60, marginTop: 8 }}>
      {data.map(d => (
        <div key={d.day} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <div style={{
            width: "100%", borderRadius: "4px 4px 0 0",
            background: d.pct >= 75 ? "#2dde8f" : d.pct >= 55 ? "#fb923c" : "#f87171",
            height: `${(d.pct / max) * 52}px`,
            transition: "height .4s",
          }} />
          <span style={{ fontSize: 9, color: "#475569", marginTop: 4, fontFamily: "monospace" }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function ReportTypeIcon({ type }) {
  const icons = { arrived: "✅", late: "⏱️", full: "🚌", skipped: "⏩", not_running: "🚫" };
  return <span>{icons[type] || "📋"}</span>;
}

const pages = ["home", "detail", "report", "alerts", "admin"];

export default function CommutePulse() {
  const [page, setPage] = useState("home");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [reportStep, setReportStep] = useState(1);
  const [reportType, setReportType] = useState(null);
  const [reportDelay, setReportDelay] = useState(null);
  const [reportStop, setReportStop] = useState(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [subscribedRoutes, setSubscribedRoutes] = useState(["r1"]);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const openRoute = (route) => { setSelectedRoute(route); setPage("detail"); };

  const startReport = () => {
    setReportStep(1); setReportType(null); setReportDelay(null);
    setReportStop(null); setReportSubmitted(false); setPage("report");
  };

  const toggleSub = (id) => {
    setSubscribedRoutes(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    showToast(subscribedRoutes.includes(id) ? "Alert removed." : "Alert set! We'll notify you.");
  };

  const submitReport = () => {
    setReportSubmitted(true);
    showToast("Report submitted. Thanks! 🚌");
    setTimeout(() => { setPage("home"); setReportSubmitted(false); }, 1600);
  };

  const nav = (p) => setPage(p);

  const NAV = [
    { id: "home",   label: "Routes",  icon: "🚏" },
    { id: "report", label: "Report",  icon: "📋", action: startReport },
    { id: "alerts", label: "Alerts",  icon: "🔔" },
    { id: "admin",  label: "Admin",   icon: "🛡️" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060c17",
      color: "#f1f5f9",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      display: "flex",
      flexDirection: "column",
      maxWidth: 440,
      margin: "0 auto",
      position: "relative",
    }}>
      {/* Import fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060c17; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 99px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "20px 20px 14px",
        borderBottom: "1px solid #0f1e33",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "#060c17",
        zIndex: 10,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #2dde8f, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>🚌</div>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: -0.5 }}>CommutePulse</span>
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 3, marginLeft: 40 }}>Colby + Waterville Transit · Live</div>
        </div>
        <div style={{
          background: "#0e7a45",
          borderRadius: 99, padding: "4px 10px",
          fontSize: 11, fontWeight: 700, color: "#2dde8f",
          fontFamily: "monospace",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2dde8f", display: "inline-block", animation: "none" }} />
          LIVE
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 90px" }}>

        {/* HOME */}
        {page === "home" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Live Routes</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Updated 47 sec ago · 5 routes</div>
              </div>
              <button onClick={startReport} style={{
                background: "linear-gradient(135deg, #2dde8f22, #0ea5e922)",
                border: "1px solid #2dde8f55",
                borderRadius: 10, padding: "8px 14px",
                color: "#2dde8f", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>+ Report</button>
            </div>

            {/* Summary strip */}
            <div style={{
              background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12,
              padding: "12px 16px", marginBottom: 16,
              display: "flex", gap: 20,
            }}>
              {[
                ["2", "Delayed", "#fb923c"],
                ["1", "Not Running", "#818cf8"],
                ["2", "On Time", "#2dde8f"],
              ].map(([n, label, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Syne', sans-serif" }}>{n}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{label}</div>
                </div>
              ))}
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif" }}>29</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Reports today</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {routes.map(r => <RouteCard key={r.id} route={r} onClick={openRoute} selected={false} />)}
            </div>

            <div style={{ marginTop: 20, background: "#0b1220", border: "1px dashed #1e293b", borderRadius: 12, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#64748b" }}>📢 Share live status</div>
              <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>
                "Downtown Loop is 11 min late right now — commutepulse.colby"
              </div>
              <button style={{
                marginTop: 10, background: "#1e293b", border: "none",
                borderRadius: 8, padding: "6px 16px", color: "#94a3b8",
                fontSize: 11, cursor: "pointer",
              }}>📋 Copy share link</button>
            </div>
          </div>
        )}

        {/* DETAIL */}
        {page === "detail" && selectedRoute && (
          <div>
            <button onClick={() => setPage("home")} style={{
              background: "none", border: "none", color: "#64748b",
              fontSize: 13, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6,
            }}>← Back</button>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'Syne', sans-serif" }}>
                {selectedRoute.name.includes("Colby") ? "Colby Shuttle" : "Waterville City Bus"}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", marginTop: 2 }}>{selectedRoute.short}</div>
            </div>

            {/* Status hero */}
            <div style={{
              background: statusMeta[selectedRoute.status].bg,
              borderRadius: 14, padding: "18px 20px", marginBottom: 16,
              border: `1px solid ${statusMeta[selectedRoute.status].dot}44`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, color: statusMeta[selectedRoute.status].dot, fontWeight: 600, marginBottom: 4 }}>
                    Current Status
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>
                    {selectedRoute.status === "delayed" ? `+${selectedRoute.delay} min` :
                     selectedRoute.status === "on-time" ? "On Time ✓" : "Not Running"}
                  </div>
                  {selectedRoute.crowding && (
                    <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 4 }}>
                      Crowding: {selectedRoute.crowding} · {selectedRoute.reports} reports from {selectedRoute.riders} riders
                    </div>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 5 }}>Confidence</div>
                <ConfidenceBar value={selectedRoute.confidence} />
              </div>
            </div>

            {/* 7-day reliability */}
            <div style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>7-Day Reliability</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#2dde8f", fontFamily: "'Syne', sans-serif" }}>{selectedRoute.ontime}%</div>
              </div>
              <ReliabilityChart data={reliability} />
            </div>

            {/* Recent reports */}
            <div style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Recent Reports</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recentReports.filter(r => r.route === selectedRoute.short).map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 10, borderBottom: i < 1 ? "1px solid #0f1e33" : "none" }}>
                    <span style={{ fontSize: 18 }}><ReportTypeIcon type={r.type} /></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 500 }}>
                        {r.type === "late" ? `Running ~${r.delay} min late` :
                         r.type === "full" ? "Bus is full" :
                         r.type === "arrived" ? "Arrived on time" :
                         r.type === "not_running" ? "Not running" : r.type}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>
                        {r.stop} · {r.mins} min ago · @{r.user}
                      </div>
                    </div>
                  </div>
                ))}
                {recentReports.filter(r => r.route === selectedRoute.short).length === 0 && (
                  <div style={{ fontSize: 13, color: "#475569", textAlign: "center", padding: "10px 0" }}>No recent reports. Be the first!</div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={startReport} style={{
                flex: 1, background: "linear-gradient(135deg, #2dde8f, #0ea5e9)",
                border: "none", borderRadius: 10, padding: "12px 0",
                color: "#060c17", fontWeight: 700, fontSize: 14, cursor: "pointer",
                fontFamily: "'Syne', sans-serif",
              }}>+ Submit Report</button>
              <button onClick={() => toggleSub(selectedRoute.id)} style={{
                flex: 1,
                background: subscribedRoutes.includes(selectedRoute.id) ? "#0e7a4533" : "#1e293b",
                border: `1px solid ${subscribedRoutes.includes(selectedRoute.id) ? "#2dde8f" : "#334155"}`,
                borderRadius: 10, padding: "12px 0",
                color: subscribedRoutes.includes(selectedRoute.id) ? "#2dde8f" : "#94a3b8",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{subscribedRoutes.includes(selectedRoute.id) ? "🔔 Subscribed" : "🔔 Set Alert"}</button>
            </div>
          </div>
        )}

        {/* REPORT */}
        {page === "report" && !reportSubmitted && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Submit Report</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Help fellow riders with real-time info</div>
            </div>

            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[1,2,3].map(s => (
                <div key={s} style={{
                  flex: 1, height: 4, borderRadius: 99,
                  background: reportStep >= s ? "#2dde8f" : "#1e293b",
                  transition: "background .3s",
                }} />
              ))}
            </div>

            {reportStep === 1 && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Step 1 — What happened?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {reportTypes.map(rt => (
                    <button key={rt.id} onClick={() => { setReportType(rt.id); setReportStep(2); }} style={{
                      background: "#0b1220",
                      border: `1.5px solid ${reportType === rt.id ? "#2dde8f" : "#1e293b"}`,
                      borderRadius: 12, padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 14,
                      cursor: "pointer", color: "#f1f5f9", textAlign: "left",
                    }}>
                      <span style={{ fontSize: 22 }}>{rt.emoji}</span>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{rt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {reportStep === 2 && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Step 2 — Which stop?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {stops.map(s => (
                    <button key={s} onClick={() => setReportStop(s)} style={{
                      background: "#0b1220",
                      border: `1.5px solid ${reportStop === s ? "#2dde8f" : "#1e293b"}`,
                      borderRadius: 10, padding: "12px 16px",
                      cursor: "pointer", color: reportStop === s ? "#2dde8f" : "#f1f5f9",
                      fontSize: 13, textAlign: "left", fontWeight: reportStop === s ? 600 : 400,
                    }}>{s}</button>
                  ))}
                </div>
                {reportType === "late" && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 10 }}>How late? (minutes)</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {delays.map(d => (
                        <button key={d} onClick={() => setReportDelay(d)} style={{
                          background: reportDelay === d ? "#2dde8f" : "#1e293b",
                          border: "none", borderRadius: 8, padding: "8px 16px",
                          color: reportDelay === d ? "#060c17" : "#94a3b8",
                          fontSize: 13, fontWeight: 600, cursor: "pointer",
                        }}>+{d}m</button>
                      ))}
                    </div>
                  </div>
                )}
                <button disabled={!reportStop} onClick={() => setReportStep(3)} style={{
                  width: "100%", background: reportStop ? "linear-gradient(135deg, #2dde8f, #0ea5e9)" : "#1e293b",
                  border: "none", borderRadius: 10, padding: "13px 0",
                  color: reportStop ? "#060c17" : "#475569",
                  fontWeight: 700, fontSize: 14, cursor: reportStop ? "pointer" : "default",
                  fontFamily: "'Syne', sans-serif",
                }}>Next →</button>
              </div>
            )}

            {reportStep === 3 && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Step 3 — Confirm</div>
                <div style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                  {[
                    ["Type", reportTypes.find(r => r.id === reportType)?.label],
                    ["Stop", reportStop],
                    ["Delay", reportDelay ? `+${reportDelay} min` : "—"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0f1e33" }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={submitReport} style={{
                  width: "100%", background: "linear-gradient(135deg, #2dde8f, #0ea5e9)",
                  border: "none", borderRadius: 10, padding: "14px 0",
                  color: "#060c17", fontWeight: 800, fontSize: 15, cursor: "pointer",
                  fontFamily: "'Syne', sans-serif",
                }}>Submit Report 🚌</button>
              </div>
            )}
          </div>
        )}

        {/* ALERTS */}
        {page === "alerts" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Alert Subscriptions</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Get notified when routes are delayed or full</div>
            </div>
            {routes.map(r => {
              const sub = subscribedRoutes.includes(r.id);
              const meta = statusMeta[r.status];
              return (
                <div key={r.id} style={{
                  background: "#0b1220", border: "1px solid #1e293b",
                  borderRadius: 12, padding: "14px 16px", marginBottom: 10,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.short}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.dot }} />
                      <span style={{ fontSize: 11, color: "#64748b" }}>{meta.label}</span>
                    </div>
                  </div>
                  <button onClick={() => toggleSub(r.id)} style={{
                    background: sub ? "#0e7a4533" : "#1e293b",
                    border: `1px solid ${sub ? "#2dde8f55" : "#334155"}`,
                    borderRadius: 8, padding: "7px 14px",
                    color: sub ? "#2dde8f" : "#64748b",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>{sub ? "🔔 On" : "Enable"}</button>
                </div>
              );
            })}
            <div style={{ background: "#0b1220", border: "1px dashed #1e293b", borderRadius: 12, padding: 14, marginTop: 10 }}>
              <div style={{ fontSize: 12, color: "#475569" }}>📧 Alerts sent to your .edu email · Push notifications coming soon</div>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {page === "admin" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Admin Dashboard</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Transit ops view · Moderation & analytics</div>
            </div>

            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                ["29", "Reports today", "#2dde8f"],
                ["7", "Active riders", "#0ea5e9"],
                ["2", "Flagged reports", "#fb923c"],
                ["74%", "Avg confidence", "#a78bfa"],
              ].map(([val, label, color]) => (
                <div key={label} style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "'Syne', sans-serif" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Hot delay spots */}
            <div style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Delay Hotspots (7 days)</div>
              {[
                ["Downtown Loop", "Mayflower Hill Dr", "8:05–8:35am", 14],
                ["Evening Express", "Main St & Silver", "6:00–7:00pm", 7],
                ["City Rte 6", "Kennedy Memorial Dr", "All day", 11],
              ].map(([route, stop, time, n]) => (
                <div key={stop} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0f1e33" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{route}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{stop} · {time}</div>
                  </div>
                  <span style={{ color: "#fb923c", fontWeight: 700, fontSize: 14, fontFamily: "monospace" }}>{n}×</span>
                </div>
              ))}
            </div>

            {/* Moderation queue */}
            <div style={{ background: "#0b1220", border: "1px solid #1e293b", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Moderation Queue</div>
              {[
                { user: "anon_zz1", type: "not_running", route: "Downtown", flag: "duplicate", trust: 0.3 },
                { user: "anon_q72", type: "late", route: "Evening", flag: "spam", trust: 0.1 },
              ].map((r, i) => (
                <div key={i} style={{ padding: "10px 0", borderBottom: i === 0 ? "1px solid #0f1e33" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>@{r.user} · {r.route}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{r.type} · Flag: {r.flag}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>Trust: {r.trust}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ background: "#0e7a4533", border: "1px solid #2dde8f55", borderRadius: 6, padding: "4px 10px", color: "#2dde8f", fontSize: 11, cursor: "pointer" }}>✓ Keep</button>
                      <button style={{ background: "#7c2d1233", border: "1px solid #fb923c55", borderRadius: 6, padding: "4px 10px", color: "#fb923c", fontSize: 11, cursor: "pointer" }}>✕ Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)",
          background: "#0e7a45", color: "#fff", borderRadius: 10, padding: "10px 20px",
          fontSize: 13, fontWeight: 600, zIndex: 100, whiteSpace: "nowrap",
          boxShadow: "0 4px 20px #2dde8f44",
        }}>{toast}</div>
      )}

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 440,
        background: "#0a1120",
        borderTop: "1px solid #0f1e33",
        display: "flex",
        padding: "10px 0 16px",
        zIndex: 20,
      }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={n.action || (() => nav(n.id))} style={{
              flex: 1, background: "none", border: "none",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              cursor: "pointer", padding: "6px 0",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: active ? "linear-gradient(135deg, #2dde8f22, #0ea5e922)" : "transparent",
                border: active ? "1.5px solid #2dde8f55" : "1.5px solid transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, transition: "all .2s",
              }}>{n.icon}</div>
              <span style={{ fontSize: 10, color: active ? "#2dde8f" : "#475569", fontWeight: active ? 600 : 400 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
