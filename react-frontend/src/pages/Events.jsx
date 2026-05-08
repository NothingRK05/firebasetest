// src/pages/Blank3.jsx  →  Events
import { useState, useEffect } from "react";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTrip } from "../context/TripContext";
import "../planner.css";

const CATEGORIES = ["Concert", "Amusement Park", "Restaurant"];
const ICONS = { Concert: "🎵", "Amusement Park": "🎢", Restaurant: "🍽️" };

const EMPTY_FORM = {
  category: "Concert",
  name: "",
  date: "",
  time: "",
  address: "",
  notes: "",
};

export default function Blank3() {
  const { currentUser } = useAuth();
  const { activeTrip, activeTripId, trips, setActiveTripId } = useTrip();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser || !activeTripId) return;
    const q = query(
      collection(db, "users", currentUser.uid, "trips", activeTripId, "events"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [currentUser, activeTripId]);

  async function handleAdd() {
    if (!form.name.trim() || !activeTripId) return;
    setSaving(true);
    await addDoc(
      collection(db, "users", currentUser.uid, "trips", activeTripId, "events"),
      { ...form, createdAt: serverTimestamp() }
    );
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "users", currentUser.uid, "trips", activeTripId, "events", id));
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="planner-page">
      <h1 className="planner-heading"><span>🎉</span> Events</h1>

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
      </div>

      {!activeTrip ? (
        <div className="planner-empty">Create a trip in the Trip Planner tab first 🗺️</div>
      ) : (
        <>
          {/* Add form */}
          {showForm ? (
            <div className="planner-card">
              <div className="planner-card-title">Add Event</div>
              <div className="planner-grid">
                <div className="planner-field">
                  <label className="planner-label">Category</label>
                  <select
                    className="planner-select"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="planner-field">
                  <label className="planner-label">Name</label>
                  <input
                    className="planner-input"
                    placeholder="e.g. Taylor Swift Concert"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="planner-field">
                  <label className="planner-label">Date</label>
                  <input
                    className="planner-input"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="planner-field">
                  <label className="planner-label">Time</label>
                  <input
                    className="planner-input"
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
                <div className="planner-field full">
                  <label className="planner-label">Address</label>
                  <input
                    className="planner-input"
                    placeholder="e.g. 123 Main St, Chicago, IL"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="planner-field full">
                  <label className="planner-label">Notes</label>
                  <textarea
                    className="planner-textarea"
                    placeholder="Ticket info, dress code, reservations..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="planner-row-actions">
                <button className="planner-btn" onClick={handleAdd} disabled={saving}>
                  {saving ? "Saving..." : "Add"}
                </button>
                <button className="planner-btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <button className="planner-btn" style={{ marginBottom: "1.5rem" }} onClick={() => setShowForm(true)}>
              + Add Event
            </button>
          )}

          {/* Grouped items */}
          {CATEGORIES.map((cat) => (
            <div key={cat} className="planner-card">
              <div className="planner-card-title">{ICONS[cat]} {cat}</div>
              {grouped[cat].length === 0 ? (
                <div className="planner-empty" style={{ padding: "0.5rem 0" }}>No {cat.toLowerCase()} added yet</div>
              ) : (
                <div className="planner-item-list">
                  {grouped[cat].map((item) => (
                    <div key={item.id} className="planner-item">
                      <div className="planner-item-info">
                        <span className="planner-item-name">{item.name}</span>
                        {(item.date || item.time) && (
                          <span className="planner-item-detail">
                            📅 {item.date} {item.time && `at ${item.time}`}
                          </span>
                        )}
                        {item.address && (
                          <span className="planner-item-detail">📍 {item.address}</span>
                        )}
                        {item.notes && (
                          <span className="planner-item-detail">{item.notes}</span>
                        )}
                      </div>
                      <button className="planner-btn-danger" onClick={() => handleDelete(item.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
