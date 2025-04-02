
import { OpenHouseSession } from "@/types/open-house";

export const filterFutureOpenHouses = (sessions: OpenHouseSession[]): OpenHouseSession[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to beginning of today
  return sessions.filter(session => session.date >= now);
};
