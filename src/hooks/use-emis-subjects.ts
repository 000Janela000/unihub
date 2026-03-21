"use client";

import { useState, useEffect } from "react";
import { useEmis } from "./use-emis";

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
  const { callEmis } = useEmis();

  useEffect(() => {
    async function load() {
      try {
        const tokenRes = await fetch("/api/emis/token");
        const tokenData = await tokenRes.json();
        if (!tokenData.connected) {
          setLoading(false);
          return;
        }

        const data = await callEmis(
          "/student/arch/getMyChoosdBooks/?page=1&limit=100",
          { filter: { bookName: "" } }
        );

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
  }, [callEmis]);

  return { subjects, subjectNames, loading };
}
