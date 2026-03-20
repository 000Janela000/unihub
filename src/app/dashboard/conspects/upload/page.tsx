"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx", "png", "jpg", "jpeg"];

export default function UploadConspectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setError("მხოლოდ PDF, DOCX, PPTX, PNG, JPEG ფორმატი");
      return;
    }

    if (selected.size > MAX_SIZE) {
      setError("ფაილის მაქსიმალური ზომაა 10MB");
      return;
    }

    setFile(selected);
    setError(null);

    // Auto-fill title from filename
    if (!title) {
      setTitle(selected.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " "));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file || !title.trim() || !subject.trim()) {
      setError("შეავსეთ ყველა სავალდებულო ველი");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload file
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "ატვირთვა ვერ მოხერხდა");
      }

      const { url, fileName, fileSize, fileType } = await uploadRes.json();

      // 2. Create conspect record
      const createRes = await fetch("/api/conspects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subject: subject.trim(),
          description: description.trim() || null,
          fileUrl: url,
          fileName,
          fileSize,
          fileType,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "შენახვა ვერ მოხერხდა");
      }

      router.push("/dashboard/conspects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "შეცდომა");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-4 lg:px-8">
          <h1 className="text-xl font-semibold text-foreground lg:text-2xl">კონსპექტის ატვირთვა</h1>
          <p className="text-sm text-muted-foreground">გაუზიარეთ კონსპექტი თანაკურსელებს</p>
        </div>
      </header>

      <div className="mx-auto max-w-xl p-4 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File drop zone */}
          <Card
            className={cn(
              "border-2 border-dashed cursor-pointer transition-colors",
              file ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted/30"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-10">
              {file ? (
                <div className="flex items-center gap-3">
                  <FileText className="size-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="size-10 text-muted-foreground mb-3" />
                  <p className="font-medium text-foreground">აირჩიეთ ფაილი</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    PDF, DOCX, PPTX, PNG, JPEG — მაქს. 10MB
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">სათაური *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="მაგ. მათემატიკა I — ლექცია 5"
              required
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">საგანი *</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="მაგ. მათემატიკა I"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">აღწერა</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="არასავალდებულო — რა არის ფაილში?"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={uploading || !file || !title.trim() || !subject.trim()}
            className="w-full gap-2 py-6 text-base font-medium"
          >
            {uploading ? (
              <><Loader2 className="size-4 animate-spin" />იტვირთება...</>
            ) : (
              <><Upload className="size-4" />ატვირთვა</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
