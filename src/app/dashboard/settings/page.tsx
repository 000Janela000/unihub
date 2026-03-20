"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, LogOut, Github, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserGroup } from "@/hooks/use-user-group";
import { decodeGroupCode, buildGroupCode, getFacultyByPrefix } from "@/lib/group-decoder";
import { useEmis } from "@/hooks/use-emis";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "ნათელი", icon: Sun },
  { value: "dark", label: "მუქი", icon: Moon },
  { value: "system", label: "სისტემა", icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { group, setGroup } = useUserGroup();
  const { callEmis } = useEmis();
  const [mounted, setMounted] = useState(false);
  const [emisGroup, setEmisGroup] = useState<string | null>(null);
  const [emisProgram, setEmisProgram] = useState<string | null>(null);
  const [emisSemester, setEmisSemester] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Auto-correct group from EMIS
  useEffect(() => {
    async function syncEmis() {
      try {
        const tokenRes = await fetch("/api/emis/token");
        const tokenData = await tokenRes.json();
        if (!tokenData.connected) return;

        const data = await callEmis("/student/students/getDetails", {
          studentId: undefined, // extracted from JWT by backend
        });

        if (data?.result === "yes" && data.data) {
          const realGroup = data.data.group;
          if (realGroup) {
            setEmisGroup(realGroup);
            // Auto-correct localStorage if different
            if (group?.groupCode !== realGroup) {
              const decoded = decodeGroupCode(realGroup);
              if (decoded) {
                setGroup({
                  university: "agruni",
                  facultyId: decoded.faculty.id,
                  year: decoded.groupNumber,
                  groupNumber: decoded.groupNumber,
                  groupCode: realGroup,
                });
              }
            }
          }
        }

        // Get program/semester from JWT
        try {
          const cookies = document.cookie.split(";").map((c) => c.trim());
          const emisCookie = cookies.find((c) => c.startsWith("emis_token="));
          if (emisCookie) {
            const token = emisCookie.split("=")[1];
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.currentProgram?.nameEng) setEmisProgram(payload.currentProgram.nameEng);
            if (payload.view?.semester) setEmisSemester(payload.view.semester);
          }
        } catch {}
      } catch {}
    }
    syncEmis();
  }, []);

  const currentTheme = mounted ? theme : "system";
  const displayGroup = emisGroup || group?.groupCode;
  const decoded = displayGroup ? decodeGroupCode(displayGroup) : null;

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-4 lg:px-8">
          <h1 className="text-xl font-semibold text-foreground lg:text-2xl">პარამეტრები</h1>
          <p className="text-sm text-muted-foreground">პროფილი და აპლიკაციის პარამეტრები</p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-8">
        {/* Profile */}
        <Card className="border-border bg-card overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
          <CardContent className="relative pt-0 pb-6">
            <div className="-mt-12 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
              <Avatar className="size-24 border-4 border-card shadow-lg">
                <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {session?.user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-foreground">{session?.user?.name || "სტუდენტი"}</h2>
                <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">@agruni.edu.ge</Badge>
                </div>
              </div>
            </div>

            {decoded && (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">ფაკულტეტი</p>
                  <p className="mt-1 text-sm font-medium text-foreground line-clamp-2">{decoded.faculty.nameKa}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{emisSemester ? "სემესტრი" : "ჩარიცხვის წელი"}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {emisSemester ? `${emisSemester} სემესტრი` : `${decoded.entryYear} წელი`}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">აკად. ჯგუფი</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{displayGroup?.toUpperCase()}</p>
                </div>
              </div>
            )}
            {emisProgram && (
              <div className="mt-3 rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">პროგრამა</p>
                <p className="mt-1 text-sm font-medium text-foreground">{emisProgram}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">თემა</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex rounded-lg bg-muted p-1">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const isActive = currentTheme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="hidden sm:inline">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">შესახებ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ვერსია</span>
              <span className="text-sm font-medium text-foreground">2.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">შექმნილია</span>
              <span className="text-sm font-medium text-foreground">agruni.edu.ge-სთვის</span>
            </div>
            <a
              href="https://github.com/000Janela000/unihub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Github className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">GitHub</span>
              </div>
              <ExternalLink className="size-4 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          გასვლა
        </Button>
      </div>
    </div>
  );
}
