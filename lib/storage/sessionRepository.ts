import { SessionLog, Workout } from "@/lib/types";

export interface SessionStorageDiagnostics {
  storageReadable: boolean;
  storageWritable: boolean;
  jsonParsed: boolean;
  keysFound: string[];
  sessionCount: number;
  backupKey: string | null;
  lastError: string;
}

export interface SessionRepository {
  getSessionsByWorkoutId(workoutId: string): SessionLog[];
  getLatestSessionByWorkoutId(workoutId: string): SessionLog | null;
  getSessionById(sessionLogId: string): SessionLog | null;
  createSessionDraft(workout: Workout): SessionLog;
  createSessionFromWorkout(workout: Workout): SessionLog;
  saveSession(session: SessionLog): SessionLog;
  updateSession(session: SessionLog): SessionLog;
  listAllSessions(): SessionLog[];
  startFreshAttempt(workoutId: string): SessionLog | null;
  reopenSession(sessionLogId: string): SessionLog | null;
  delete(sessionId: string): void;
  clearAll(): void;
  getDiagnostics(): SessionStorageDiagnostics;
}
