/**
 * Firestore session helpers for ZionCore frequency observations
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "./config";
import type { FrequencyObservation } from "@/types/zioncore";

export async function saveFrequencySession(
  userId: string,
  observation: Partial<FrequencyObservation>
): Promise<string> {
  const db = getFirestoreDb();
  const sessionsRef = collection(db, "users", userId, "frequency_sessions");
  const newDoc = doc(sessionsRef);

  const payload = {
    ...observation,
    userId,
    createdAt: observation.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    savedAt: serverTimestamp(),
  };

  await setDoc(newDoc, payload);
  return newDoc.id;
}

export async function listRecentSessions(
  userId: string,
  max: number = 20
): Promise<(FrequencyObservation & { id: string })[]> {
  const db = getFirestoreDb();
  const sessionsRef = collection(db, "users", userId, "frequency_sessions");
  const q = query(sessionsRef, orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...(data as FrequencyObservation),
    };
  });
}
