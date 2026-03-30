"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { WeddingTemplate } from "@/types";

interface TemplateContextType {
  selectedTemplate: WeddingTemplate | null;
  selectTemplate: (template: WeddingTemplate | null) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function TemplateProvider({ children }: { children: React.ReactNode }) {
  const [selectedTemplate, setSelectedTemplate] = useState<WeddingTemplate | null>(null);

  const selectTemplate = useCallback((template: WeddingTemplate | null) => {
    setSelectedTemplate(template);
  }, []);

  return (
    <TemplateContext.Provider value={{ selectedTemplate, selectTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useSelectedTemplate() {
  const ctx = useContext(TemplateContext);
  if (!ctx) throw new Error("useSelectedTemplate must be used within TemplateProvider");
  return ctx;
}
