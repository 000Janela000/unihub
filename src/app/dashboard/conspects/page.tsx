"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Upload,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Download,
  Plus,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Conspect {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  upvotes: number;
  downvotes: number;
  downloads: number;
  faculty: string | null;
  semester: number | null;
  createdAt: string;
  authorName: string | null;
  authorImage: string | null;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileTypeIcon(type: string): string {
  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || type.includes("document")) return "DOC";
  if (type.includes("presentation") || type.includes("powerpoint")) return "PPT";
  if (type.includes("image")) return "IMG";
  return "FILE";
}

function fileTypeBadgeColor(type: string): string {
  if (type.includes("pdf")) return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (type.includes("word") || type.includes("document")) return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  if (type.includes("presentation") || type.includes("powerpoint")) return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-muted text-muted-foreground";
}

export default function ConspectsPage() {
  const [conspects, setConspects] = useState<Conspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchConspects = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/conspects?${params}`);
      const data = await res.json();
      setConspects(data.conspects || []);
    } catch {
      console.error("Failed to fetch conspects");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchConspects, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchConspects, search]);

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground lg:text-2xl">კონსპექტები</h1>
              <Badge variant="secondary" className="font-mono">{conspects.length}</Badge>
            </div>
            <Link href="/dashboard/conspects/upload">
              <Button size="sm" className="gap-2">
                <Plus className="size-4" />
                <span className="hidden sm:inline">ატვირთვა</span>
              </Button>
            </Link>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="საგანი ან სათაური..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 lg:px-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        ) : conspects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <BookOpen className="size-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-medium text-foreground">
              {search ? "კონსპექტი ვერ მოიძებნა" : "კონსპექტები ჯერ არ არის"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ? "შეცვალეთ ძებნა" : "იყავით პირველი — ატვირთეთ კონსპექტი!"}
            </p>
            {!search && (
              <Link href="/dashboard/conspects/upload" className="mt-4">
                <Button className="gap-2">
                  <Upload className="size-4" />
                  ატვირთვა
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {conspects.map((c) => (
              <Card key={c.id} className="border-border transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* File type badge */}
                    <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-lg text-xs font-bold", fileTypeBadgeColor(c.fileType))}>
                      {fileTypeIcon(c.fileType)}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.subject}</p>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {/* Author */}
                        <div className="flex items-center gap-1.5">
                          <Avatar className="size-4">
                            <AvatarImage src={c.authorImage || undefined} />
                            <AvatarFallback className="text-[8px]">
                              {c.authorName?.[0] || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <span>{c.authorName || "ანონიმი"}</span>
                        </div>

                        <span>{formatFileSize(c.fileSize)}</span>

                        {/* Votes */}
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="size-3" />
                          <span>{c.upvotes}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Download className="size-3" />
                          <span>{c.downloads}</span>
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0">
                      <span className={cn(
                        "text-lg font-bold",
                        c.upvotes - c.downvotes > 0 ? "text-primary" :
                        c.upvotes - c.downvotes < 0 ? "text-destructive" : "text-muted-foreground"
                      )}>
                        {c.upvotes - c.downvotes > 0 ? "+" : ""}{c.upvotes - c.downvotes}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
