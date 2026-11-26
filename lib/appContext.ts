"use client";

import { ProjectWithRelations } from "@/types";
import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";



export type AppContextType =  {
  projects: ProjectWithRelations[];
  setProjects: Dispatch<SetStateAction<ProjectWithRelations[]>>;

};

export const appContext = createContext<AppContextType | undefined>(
  undefined
);