"use client";

import { useState, type ReactNode } from "react";
import type { ProjectWithRelations } from "@/types";
import { appContext } from "./appContext";

export default function ContextFile({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [authenticatedId, setAuthenticatedId] = useState<string | null>(null);

  return (
    <appContext.Provider
      value={{
        projects,
        setProjects,
        authenticatedId,
        setAuthenticatedId,
      }}
    >
      {children}
    </appContext.Provider>
  );
}