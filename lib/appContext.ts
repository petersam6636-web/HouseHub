"use client";

import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";



export type AppContextType =  {
projecs: ProjectWithRelations[];
  setProjects: Dispatch<SetStateAction<ProjectWithRelations[]>>;

};

export const appContext = createContext<AppContextType | undefined>(
  undefined
);