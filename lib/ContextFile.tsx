"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ProjectWithRelations } from "@/types";
import { appContext } from "./appContext";
import { supabase } from "./supabase-client";

export default function ContextFile({
  children,
}: {
  children: ReactNode;
}) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
  const [authenticatedId, setAuthenticatedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let authEventsReceived = 0;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      authEventsReceived += 1;
      setAuthenticatedId(session?.user.id ?? null);
    });

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!mounted || authEventsReceived > 0) return;

        if (error) {
          console.error("Unable to read the current auth session.", error);
          return;
        }

        setAuthenticatedId(data.session?.user.id ?? null);
      })
      .catch((error: unknown) => {
        if (mounted) {
          console.error("Unable to read the current auth session.", error);
        }
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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