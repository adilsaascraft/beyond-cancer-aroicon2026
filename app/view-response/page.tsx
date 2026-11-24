"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Users,
  Mail,
  Phone,
  Building2,
  CalendarClock,
  Lock,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Participant {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  affiliation: string;
  regNum: string;
  createdAt?: string;
}

const KEY_STORAGE = "aroicon-admin-key";

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ParticipantsPage() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(true);

  const fetchParticipants = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/registers", {
        method: "GET",
        headers: { "x-admin-key": key },
        cache: "no-store",
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        // non-JSON response
      }

      if (res.status === 401) {
        try {
          sessionStorage.removeItem(KEY_STORAGE);
        } catch {}
        setNeedsKey(true);
        setAdminKey("");
        setError("Invalid admin key. Please try again.");
        return;
      }

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Failed to load participants");
      }

      setParticipants(Array.isArray(json.data) ? json.data : []);
      setNeedsKey(false);
      setAdminKey(key);
      try {
        sessionStorage.setItem(KEY_STORAGE, key);
      } catch {}
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reuse the key entered earlier in this browser session
  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem(KEY_STORAGE) || "";
    } catch {}
    if (saved) fetchParticipants(saved);
    else setNeedsKey(true);
  }, [fetchParticipants]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) fetchParticipants(keyInput.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100 px-3 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* ================= HEADING ================= */}
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-sky-800 sm:text-3xl md:text-4xl">
            46th Annual Conference AROICON 2026
          </h1>
          <p className="mt-2 text-sm font-semibold text-sky-700 sm:text-base">
            Beyond Cancer - Stories Of Courage
          </p>
          <div className="mt-4 inline-flex rounded-full bg-sky-50 px-5 py-2">
            <span className="text-sm font-bold uppercase tracking-wide text-sky-800">
              Registered Participants
            </span>
          </div>
        </header>

        {/* ================= ADMIN KEY GATE ================= */}
        {needsKey && !loading && (
          <Card className="mx-auto max-w-md rounded-2xl border border-sky-100 bg-white/95 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="flex items-center gap-2 text-sky-800">
                  <Lock className="h-5 w-5" />
                  <h2 className="font-bold">Admin access required</h2>
                </div>

                <Input
                  type="password"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter admin key"
                  className="h-12 border-sky-200 bg-white text-sky-800"
                />

                {error && (
                  <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={!keyInput.trim()}
                  className="h-12 w-full rounded-xl bg-sky-700 font-bold text-white hover:bg-sky-800"
                >
                  View Participants
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="py-12">
            <div className="flex flex-col items-center justify-center text-sky-700">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="mt-3 text-sm font-semibold">
                Loading participants...
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-2xl border border-sky-100 bg-white/70"
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= ERROR (after key accepted) ================= */}
        {!loading && !needsKey && error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>
            <Button
              onClick={() => fetchParticipants(adminKey)}
              className="mt-4 bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ================= LIST ================= */}
        {!loading && !needsKey && !error && (
          <>
            {/* COUNT BAR */}
            <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-md sm:flex-row sm:p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sky-100 p-3">
                  <Users className="h-6 w-6 text-sky-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total Participants
                  </p>
                  <p className="text-3xl font-extrabold text-sky-800">
                    {participants.length}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => fetchParticipants(adminKey)}
                variant="outline"
                className="border-sky-200 text-sky-800 hover:bg-sky-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {participants.length === 0 ? (
              <div className="rounded-2xl border border-sky-100 bg-white/95 p-12 text-center shadow-md">
                <Users className="mx-auto h-12 w-12 text-sky-300" />
                <p className="mt-3 font-semibold text-sky-800">
                  No participants registered yet
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  New registrations will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {participants.map((p, index) => (
                  <Card
                    key={p._id}
                    className="overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-md transition-shadow hover:shadow-xl"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold tracking-wide text-sky-800">
                          {p.regNum}
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          #{participants.length - index}
                        </span>
                      </div>

                      <h3 className="mt-3 break-words text-lg font-bold text-sky-900">
                        {p.name}
                      </h3>

                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p className="flex items-start gap-2">
                          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                          <span className="break-all">{p.email}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                          <span>{p.mobile}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                          <span className="break-words">{p.affiliation}</span>
                        </p>
                      </div>

                      <p className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-400">
                        <CalendarClock className="h-3.5 w-3.5" />
                        Registered {formatDate(p.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
