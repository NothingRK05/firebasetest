// src/pages/Blank2.jsx  →  Essentials
import { useState, useEffect } from "react";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTrip } from "../context/TripContext";
import "../planner.css";

const CATEGORIES = ["Flight", "Hotel", "Car Rental"];

const ICONS = { Flight: "✈️", Hotel: "🏨", "Car Rental": "🚗" };

const EMPTY_FORM = {
  category: "Flight",
  name: "",
  confirmationNo: "",
  date: "",
  details: "",
};

export default function Blank2() {
  const { currentUser } = useAuth();
  const { activeTrip, activeTripId, trips, setActiveTripId } = useTrip();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser || !activeTripId) return;
    const q = query(
      collection(db, "users", currentUser.uid, "trips", activeTripId, "essentials"),
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
      collection(db, "users", currentUser.uid, "trips", activeTripId, "essentials"),
      { ...form, createdAt: serverTimestamp() }
    );
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaving(false);
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "users", currentUser.uid, "trips", activeTripId, "essentials", id));
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="planner-page">
      <h1 className="planner-heading"><span>🧳</span> Essentials</h1>

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
              <div className="planner-card-title">Add Essential</div>
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
                  <label className="planner-label">Name / Provider</label>
                  <input
                    className="planner-input"
                    placeholder="e.g. Delta Airlines"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="planner-field">
                  <label className="planner-label">Confirmation #</label>
                  <input
                    className="planner-input"
                    placeholder="e.g. ABC123"
                    value={form.confirmationNo}
                    onChange={(e) => setForm({ ...form, confirmationNo: e.target.value })}
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
                <div className="planner-field full">
                  <label className="planner-label">Details</label>
                  <textarea
                    className="planner-textarea"
                    placeholder="Flight number, check-in time, pickup location..."
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
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
              + Add Essential
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
                        {item.confirmationNo && (
                          <span className="planner-item-detail">Confirmation: {item.confirmationNo}</span>
                        )}
                        {item.date && (
                          <span className="planner-item-detail">📅 {item.date}</span>
                        )}
                        {item.details && (
                          <span className="planner-item-detail">{item.details}</span>
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
