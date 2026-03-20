"use client";

import { useState, useEffect } from "react";

interface EmisSubject {
  name: string;
  code: string;
  credits: number;
  groupName: string;
}

/**
 * Fetches student's currently registered subjects from EMIS.
 * Uses getMyChoosdBooks which returns book names + group assignments.
 * Returns null if EMIS not connected (caller should fall back to group-based filtering).
 */
export function useEmisSubjects() {
  const [subjects, setSubjects] = useState<EmisSubject[] | null>(null);
  const [subjectNames, setSubjectNames] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const tokenRes = await fetch("/api/emis/token");
        const tokenData = await tokenRes.json();
        if (!tokenData.connected) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/emis/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: "/student/arch/getMyChoosdBooks/?page=1&limit=100",
            method: "POST",
            body: { filter: { bookName: "" } },
          }),
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
          const parsed: EmisSubject[] = data.data.map((item: any) => ({
            name: item.book?.name || "",
            code: item.book?.code || "",
            credits: item.book?.credit || 0,
            groupName: item.group_sibling?.name || "",
          }));
          setSubjects(parsed);
          setSubjectNames(parsed.map((s) => s.name).filter(Boolean));
        }
      } catch {
        // EMIS not available — subjects stay null
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { subjects, subjectNames, loading };
}
