import type { NightEvent } from "./db";

export function todayName(d = new Date()) {
  return d.toLocaleDateString("en-US", { weekday: "long", timeZone: "Africa/Kampala" });
}

export function tonightEvent(events: NightEvent[]) {
  const day = todayName();
  return events.find((e) => e.day === day) ?? null;
}

export function nextEvent(events: NightEvent[]) {
  const order = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const t = order.indexOf(todayName());
  return [...events].sort(
    (a, b) => ((order.indexOf(a.day) - t + 7) % 7 || 7) - ((order.indexOf(b.day) - t + 7) % 7 || 7)
  )[0];
}
