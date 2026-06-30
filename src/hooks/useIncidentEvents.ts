"use client";

import { useEffect } from "react";
import { useIncidentEventContext } from "@/context/IncidentEventsContext";

export function useIncidentEvents() {
  const { setLastEvent } = useIncidentEventContext();

  useEffect(() => {
    const events =
      new EventSource("/api/events");

    events.onmessage = (event) => {
      setLastEvent(JSON.parse(event.data));
    };

    return () => {
      events.close();
    };
  }, [setLastEvent]);
}