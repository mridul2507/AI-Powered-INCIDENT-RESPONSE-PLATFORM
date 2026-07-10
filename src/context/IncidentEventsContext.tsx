"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type IncidentPayload = {
  id: string;
  title?: string;
  serviceId?: string;
};  

type IncidentEvent =
  | {
      type: "INCIDENT_CREATED";
      incident: IncidentPayload;
    }
  | {
      type: "INCIDENT_UPDATED";
      incident: IncidentPayload;
    }
  | {
      type: "INCIDENT_DELETED";
      incidentId: string;
    };

type ContextType = {
  lastEvent: IncidentEvent | null;
  setLastEvent: (event: IncidentEvent) => void;
};

const IncidentEventsContext =
  createContext<ContextType | null>(null);

export function IncidentEventsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lastEvent, setLastEvent] =
    useState<IncidentEvent | null>(null);

  return (
    <IncidentEventsContext.Provider
      value={{
        lastEvent,
        setLastEvent,
      }}
    >
      {children}
    </IncidentEventsContext.Provider>
  );
}

export function useIncidentEventContext() {
  const context = useContext(
    IncidentEventsContext
  );

  if (!context) {
    throw new Error(
      "IncidentEventsProvider missing"
    );
  }

  return context;
}