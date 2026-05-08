// src/context/TripContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const TripContext = createContext();

export function TripProvider({ children }) {
  const { currentUser } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to user's trips in Firestore
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "users", currentUser.uid, "trips"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTrips(data);
      if (data.length > 0 && !activeTripId) {
        setActiveTripId(data[0].id);
      }
      setLoading(false);
    });
    return unsub;
  }, [currentUser]);

  const activeTrip = trips.find((t) => t.id === activeTripId) || null;

  async function addTrip(name) {
    if (!currentUser) return;
    const ref = await addDoc(
      collection(db, "users", currentUser.uid, "trips"),
      { name, destination: "", startDate: "", endDate: "", notes: "", createdAt: serverTimestamp() }
    );
    setActiveTripId(ref.id);
  }

  async function deleteTrip(tripId) {
    if (!currentUser) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "trips", tripId));
    setActiveTripId(trips.find((t) => t.id !== tripId)?.id || null);
  }

  return (
    <TripContext.Provider value={{ trips, activeTrip, activeTripId, setActiveTripId, addTrip, deleteTrip, loading }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  return useContext(TripContext);
}
