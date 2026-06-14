"use client";

import { SessionLog } from "@/lib/types";
import { SessionRepository } from "./sessionRepository";

const KEY = "maddox-training-os:sessions";

function read(): SessionLog[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as SessionLog[];
  } catch {
    return [];
  }
}

function write(sessions: SessionLog[]) {
  window.localStorage.setItem(KEY, JSON.stringify(sessions));
}

export const localSessionRepository: SessionRepository = {
  getActive(workoutId) {
    return read().find((session) => session.workoutId === workoutId && session.status === "active") || null;
  },
  save(session) {
    const sessions = read();
    const index = sessions.findIndex((item) => item.id === session.id);
    if (index >= 0) sessions[index] = session;
    else sessions.unshift(session);
    write(sessions);
  },
  getAll: read,
  getCompleted() {
    return read().filter((session) => session.status === "completed");
  },
  delete(sessionId) {
    write(read().filter((session) => session.id !== sessionId));
  },
};
