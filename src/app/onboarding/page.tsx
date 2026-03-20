"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FacultyGrid } from "@/components/onboarding/faculty-grid";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { YearPicker } from "@/components/onboarding/year-picker";
import { GroupPicker } from "@/components/onboarding/group-picker";
import { buildGroupCode, getAcademicYear, AGRUNI_FACULTIES, FIRST_YEAR_FACULTY } from "@/lib/group-decoder";
import { setItem, STORAGE_KEYS } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { UserGroup } from "@/types";

const TOTAL_STEPS = 2;

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="absolute top-6 right-6 text-foreground/70 hover:text-foreground hover:bg-foreground/5"
      suppressHydrationWarning
    >
      {mounted ? (
        resolvedTheme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />
      ) : (
        <span className="size-5" />
      )}
    </Button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [entryYear, setEntryYear] = useState<number | null>(null);
  const [groupNumber, setGroupNumber] = useState<number | null>(null);

  const canGoNext = useMemo(() => {
    switch (step) {
      case 1: return facultyId !== null;
      case 2: return entryYear !== null && groupNumber !== null;
      default: return false;
    }
  }, [step, facultyId, entryYear, groupNumber]);

  const selectedFaculty = useMemo(() => {
    if (!facultyId) return null;
    if (facultyId === "first-year") return FIRST_YEAR_FACULTY;
    return AGRUNI_FACULTIES.find((f) => f.id === facultyId) || null;
  }, [facultyId]);

  const groupCodePreview = useMemo(() => {
    if (!selectedFaculty || !entryYear || !groupNumber) return "";
    const academicYear = getAcademicYear();
    const isFirstYear = entryYear === academicYear || entryYear === academicYear + 1;
    const prefix = isFirstYear ? "" : selectedFaculty.prefix;
    return buildGroupCode(prefix, entryYear, groupNumber);
  }, [selectedFaculty, entryYear, groupNumber]);

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setDirection("forward");
      setAnimating(true);
      setTimeout(() => {
        setStep(step + 1);
        setAnimating(false);
      }, 150);
      return;
    }

    if (!facultyId || !entryYear || !groupNumber || !selectedFaculty) return;

    const academicYear = getAcademicYear();
    const isFirstYear = entryYear === academicYear || entryYear === academicYear + 1;
    const prefix = isFirstYear ? "" : selectedFaculty.prefix;
    const groupCode = buildGroupCode(prefix, entryYear, groupNumber);
    const studentYear = academicYear - entryYear + 1;

    const userGroup: UserGroup = {
      university: "agruni",
      facultyId,
      year: studentYear,
      groupNumber,
      groupCode,
    };

    setItem(STORAGE_KEYS.USER_GROUP, userGroup);
    router.push("/dashboard");
  }

  function handleBack() {
    if (step > 1) {
      setDirection("back");
      setAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setAnimating(false);
      }, 150);
    }
  }

  const stepTitles = ["აირჩიეთ ფაკულტეტი", "აირჩიეთ კურსი და ჯგუფი"];

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-[spin_30s_linear_infinite] rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] animate-[spin_25s_linear_infinite_reverse] rounded-full bg-gradient-to-l from-accent/20 via-primary/20 to-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/5 blur-3xl" />
      </div>

      <ThemeToggle />

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-2xl shadow-primary/5 backdrop-blur-xl dark:bg-card/60 dark:shadow-primary/10 sm:p-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
            <p className="mt-4 text-lg font-semibold text-foreground">{stepTitles[step - 1]}</p>
          </div>

          {/* Step content */}
          <div
            className="transition-all duration-300 ease-out"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === "forward" ? "24px" : "-24px"})`
                : "translateX(0)",
            }}
          >
            {step === 1 && (
              <FacultyGrid
                university="agruni"
                value={facultyId}
                onChange={setFacultyId}
              />
            )}
            {step === 2 && (
              <div className="space-y-4">
                <YearPicker value={entryYear} onChange={setEntryYear} />
                {entryYear !== null && (
                  <GroupPicker
                    value={groupNumber}
                    onChange={setGroupNumber}
                    groupCodePreview={groupCodePreview}
                  />
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 rounded-xl border border-border/50 bg-secondary/50 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
              >
                უკან
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="flex-1 rounded-xl bg-foreground px-4 py-3.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {step === TOTAL_STEPS ? "დასრულება" : "შემდეგი"}
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground/60">
          საქართველოს აგრარული უნივერსიტეტი
        </p>
      </div>
    </main>
  );
}
