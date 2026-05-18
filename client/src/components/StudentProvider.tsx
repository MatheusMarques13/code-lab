import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { StudentView } from "@shared/schema";

interface StudentContextValue {
  students: StudentView[];
  currentStudent: StudentView | undefined;
  setCurrentStudentId: (id: number) => void;
  isLoading: boolean;
  hasAnyStudent: boolean;
}

const StudentContext = createContext<StudentContextValue | undefined>(undefined);

// Lightweight in-memory selection (no localStorage in sandbox)
let cachedSelectedId: number | null = null;

export function StudentProvider({ children }: { children: ReactNode }) {
  const { data: students = [], isLoading } = useQuery<StudentView[]>({
    queryKey: ["/api/students"],
  });

  const [selectedId, setSelectedId] = useState<number | null>(cachedSelectedId);

  useEffect(() => {
    if (selectedId === null && students.length > 0) {
      setSelectedId(students[0].id);
      cachedSelectedId = students[0].id;
    }
    if (selectedId !== null && students.length > 0 && !students.find((s) => s.id === selectedId)) {
      setSelectedId(students[0].id);
      cachedSelectedId = students[0].id;
    }
  }, [students, selectedId]);

  const setCurrentStudentId = (id: number) => {
    cachedSelectedId = id;
    setSelectedId(id);
  };

  const currentStudent = useMemo(
    () => students.find((s) => s.id === selectedId),
    [students, selectedId]
  );

  const value: StudentContextValue = {
    students,
    currentStudent,
    setCurrentStudentId,
    isLoading,
    hasAnyStudent: students.length > 0,
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside StudentProvider");
  return ctx;
}

// Mutation helpers
export function useCreateStudent() {
  return useMutation({
    mutationFn: async (data: { name: string; avatarEmoji: string }) => {
      const res = await apiRequest("POST", "/api/students", data);
      return (await res.json()) as StudentView;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
  });
}

export function useUpdateStudent() {
  return useMutation({
    mutationFn: async ({ id, patch }: { id: number; patch: Partial<StudentView> }) => {
      const res = await apiRequest("PATCH", `/api/students/${id}`, patch);
      return (await res.json()) as StudentView;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
  });
}

export function useResetStudent() {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/students/${id}/reset`, {});
      return (await res.json()) as StudentView;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
  });
}

export function useDeleteStudent() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/students/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
    },
  });
}
