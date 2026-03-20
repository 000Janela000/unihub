"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Chrome } from "lucide-react";
import Link from "next/link";

export function ExtensionBanner() {
  const [visible, setVisible] = useState(false);
  const [connected, setConnected] = useState(true);

  const checkConnection = useCallback(() => {
    fetch("/api/emis/token")
      .then((r) => r.json())
      .then((d) => {
        if (d.connected) {
          setConnected(true);
          setVisible(false);
        } else {
          setConnected(false);
          setVisible(true);
        }
      })
      .catch(() => {
        setConnected(false);
        setVisible(true);
      });
  }, []);

  useEffect(() => {
    checkConnection();

    // Re-check when user returns to UniHub tab (after visiting EMIS)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkConnection();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [checkConnection]);

  if (connected || !visible) return null;

  return (
    <div className="relative flex items-center gap-3 border-b border-primary/20 bg-primary/5 px-4 py-2.5 text-sm">
      <Chrome className="size-4 flex-shrink-0 text-primary" />
      <p className="flex-1 text-foreground/80">
        <Link href="/setup" className="font-medium text-primary hover:underline">
          Chrome გაფართოების
        </Link>
        {" "}დაყენებით მიიღეთ ნიშნები, GPA და სრული ფუნქციონალი
      </p>
      <button
        onClick={() => setVisible(false)}
        className="flex-shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
