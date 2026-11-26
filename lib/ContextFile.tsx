"use client";

import { useState, type ReactNode } from "react";
import { ProjectWithRelations } from "@/types";
import { appContext } from "./appContext";

export default function ContextFile({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);

  return (
    <appContext.Provider
      value={{
        projects,
        setProjects,
      }}
    >
      {children}
    </appContext.Provider>
  );
}