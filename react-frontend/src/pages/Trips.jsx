// src/pages/Blank1.jsx  →  Trip Planner
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTrip } from "../context/TripContext";
import "../planner.css";

export default function Blank1() {
  const { currentUser } = useAuth();
  const { trips, activeTrip, activeTripId, setActiveTripId, addTrip, deleteTrip } = useTrip();

  const [form, setForm] = useState({ destination: "", startDate: "", endDate: "", notes: "" });
  const [saveStatus, setSaveStatus] = useState("");
  const [newTripName, setNewTripName] = useState("");
  const [showNewTrip, setShowNewTrip] = useState(false);

  // Sync form when active trip changes
  useEffect(() => {
    if (activeTrip) {
      setForm({
        destination: activeTrip.destination || "",
        startDate:   activeTrip.startDate   || "",
        endDate:     activeTrip.endDate     || "",
        notes:       activeTrip.notes       || "",
      });
    }
  }, [activeTripId, activeTrip]);

  async function handleSave() {
    if (!activeTripId || !currentUser) return;
    setSaveStatus("Saving...");
    await updateDoc(doc(db, "users", currentUser.uid, "trips", activeTripId), form);
    setSaveStatus("Saved ✓");
    setTimeout(() => setSaveStatus(""), 2500);
  }

  async function handleAddTrip() {
    const name = newTripName.trim();
    if (!name) return;
    await addTrip(name);
    setNewTripName("");
    setShowNewTrip(false);
  }

  return (
    <div className="planner-page">
      <h1 className="planner-heading"><span>✈️</span> Trip Planner</h1>

      {/* Trip selector */}
      <div className="trip-bar">
        {trips.map((t) => (
          <button
            key={t.id}
            className={`trip-chip ${t.id === activeTripId ? "active" : ""}`}
            onClick={() => setActiveTripId(t.id)}
          >
            {t.name}
          </button>
        ))}
        {showNewTrip ? (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <input
              className="planner-input"
              style={{ width: "160px", padding: "0.35rem 0.7rem" }}
              placeholder="Trip name..."
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTrip()}
              autoFocus
            />
            <button className="planner-btn" style={{ padding: "0.35rem 0.9rem" }} onClick={handleAddTrip}>Add</button>
            <button className="planner-btn-ghost" style={{ padding: "0.35rem 0.9rem" }} onClick={() => setShowNewTrip(false)}>Cancel</button>
          </div>
        ) : (
          <button className="trip-chip-add" onClick={() => setShowNewTrip(true)}>+ New Trip</button>
        )}
      </div>

      {!activeTrip ? (
        <div className="planner-empty">No trips yet — create one above to get started 🌍</div>
      ) : (
        <>
          {/* Trip details card */}
          <div className="planner-card">
            <div className="planner-card-title"><span>📍</span> {activeTrip.name}</div>
            <div className="planner-grid">
              <div className="planner-field full">
                <label className="planner-label">Destination</label>
                <input
                  className="planner-input"
                  placeholder="e.g. Tokyo, Japan"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                />
              </div>
              <div className="planner-field">
                <label className="planner-label">Start Date</label>
                <input
                  className="planner-input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div className="planner-field">
                <label className="planner-label">End Date</label>
                <input
                  className="planner-input"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="planner-field full">
                <label className="planner-label">Notes</label>
                <textarea
                  className="planner-textarea"
                  placeholder="Trip notes, reminders, packing list..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="planner-row-actions">
              <button className="planner-btn" onClick={handleSave}>Save</button>
              <button
                className="planner-btn-danger"
                onClick={() => {
                  if (window.confirm(`Delete "${activeTrip.name}"?`)) deleteTrip(activeTripId);
                }}
              >
                Delete Trip
              </button>
              {saveStatus && <span className={`save-status ${saveStatus.includes("✓") ? "saved" : ""}`}>{saveStatus}</span>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
