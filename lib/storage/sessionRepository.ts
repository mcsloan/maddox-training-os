import { SessionLog } from "@/lib/types";

export interface SessionRepository {
  getActive(workoutId: string): SessionLog | null;
  save(session: SessionLog): void;
  getAll(): SessionLog[];
  getCompleted(): SessionLog[];
  delete(sessionId: string): void;
}
