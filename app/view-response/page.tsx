
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
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
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  UserRound,
  Sparkles,
  CalendarDays,
  Search,
  CheckCircle2,
  KeyRound,
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
  const [showKey, setShowKey] = useState(false);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(true);

  // =========================================================
  // FETCH PARTICIPANTS
  // =========================================================

  const fetchParticipants = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/registers", {
        method: "GET",
        headers: {
          "x-admin-key": key,
        },
        cache: "no-store",
      });

      let json: any = null;

      try {
        json = await res.json();
      } catch {
        // Non-JSON response
      }

      if (res.status === 401) {
        try {
          sessionStorage.removeItem(KEY_STORAGE);
        } catch {
          // Storage unavailable
        }

        setNeedsKey(true);
        setAdminKey("");
        setParticipants([]);
        setError("Invalid admin key. Please try again.");
        return;
      }

      if (!res.ok || !json?.success) {
        throw new Error(
          json?.message || "Failed to load participants"
        );
      }

      setParticipants(
        Array.isArray(json.data) ? json.data : []
      );

      setNeedsKey(false);
      setAdminKey(key);

      try {
        sessionStorage.setItem(KEY_STORAGE, key);
      } catch {
        // Storage unavailable
      }
    } catch (err: any) {
      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // RESTORE ADMIN KEY
  // =========================================================

  useEffect(() => {
    let saved = "";

    try {
      saved = sessionStorage.getItem(KEY_STORAGE) || "";
    } catch {
      // Storage unavailable
    }

    if (saved) {
      fetchParticipants(saved);
    } else {
      setNeedsKey(true);
    }
  }, [fetchParticipants]);

  // =========================================================
  // UNLOCK DASHBOARD
  // =========================================================

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();

    const key = keyInput.trim();

    if (key) {
      fetchParticipants(key);
    }
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100">

      {/* =====================================================
          FULL WIDTH CONFERENCE BANNER
      ===================================================== */}

      <header className="relative w-full overflow-hidden bg-slate-950">
        <Image
          src="/banner.webp"
          alt="46th Annual Conference AROICON 2026 - Beyond Cancer: Stories of Courage"
          width={1920}
          height={400}
          priority
          sizes="100vw"
          className="block h-auto max-h-[220px] w-full object-cover object-center sm:max-h-none"
        />
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-6 sm:px-6 sm:py-9 lg:px-8">

        {/* =================================================
            PAGE HEADING
        ================================================= */}

        <div className="mb-7 text-center">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-800 sm:text-xs">
              Conference Administration
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-sky-950 sm:text-3xl md:text-4xl">
            46th Annual Conference AROICON 2026
          </h1>

          <p className="mt-2 text-sm font-semibold text-purple-700 sm:text-base">
            Beyond Cancer - Stories Of Courage
          </p>

          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500" />

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-xs font-bold text-sky-800 shadow-sm">
            <Users className="h-4 w-4" />
            Registered Participants Dashboard
          </div>

        </div>

        {/* =================================================
            ADMIN ACCESS GATE
        ================================================= */}

        {needsKey && !loading && (

          <div className="mx-auto max-w-md">

            <Card className="p-0 relative overflow-hidden rounded-3xl border border-white bg-white/95 shadow-xl shadow-sky-900/10">

              {/* Gradient top line */}
              <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500" />

              <CardContent className="p-5 sm:p-7">

                {/* Lock icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 shadow-inner">
                  <ShieldCheck className="h-9 w-9 text-sky-700" />
                </div>

                <div className="mt-5 text-center">
                  <h2 className="text-xl font-extrabold text-sky-950 sm:text-2xl">
                    Admin Access Required
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter your secure admin key to access
                    the registered participants dashboard.
                  </p>
                </div>

                <form
                  onSubmit={handleUnlock}
                  className="mt-6 space-y-4"
                >

                  {/* PASSWORD INPUT */}
                  <div className="space-y-2">

                    <label className="text-sm font-semibold text-slate-700">
                      Admin Security Key
                    </label>

                    <div className="group flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 transition-all focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">

                      <KeyRound className="h-5 w-5 shrink-0 text-slate-400 group-focus-within:text-sky-600" />

                      <Input
                        type={showKey ? "text" : "password"}
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        placeholder="Enter your admin key"
                        autoComplete="current-password"
                        className="h-11 border-0 bg-transparent px-0 text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                      />

                      <button
                        type="button"
                        onClick={() => setShowKey((prev) => !prev)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-700"
                        aria-label={
                          showKey ? "Hide admin key" : "Show admin key"
                        }
                      >
                        {showKey ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* ERROR MESSAGE */}
                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      <p className="text-xs font-medium leading-5 text-red-700">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    disabled={!keyInput.trim()}
                    className="h-12 w-full rounded-xl border-0 bg-gradient-to-r from-sky-700 via-indigo-700 to-purple-700 font-bold text-white shadow-lg shadow-indigo-900/15 transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Access Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                </form>

                {/* SECURITY NOTE */}
                <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-100 pt-4">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <p className="text-[11px] font-medium text-slate-400">
                    Secure access for authorized administrators
                  </p>
                </div>

              </CardContent>
            </Card>

          </div>
        )}

        {/* =================================================
            LOADING STATE
        ================================================= */}

        {loading && (

          <div className="space-y-6">

            <div className="flex flex-col items-center justify-center rounded-3xl border border-white bg-white/80 px-5 py-10 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                <Loader2 className="h-9 w-9 animate-spin text-sky-700" />
              </div>

              <p className="mt-4 text-base font-bold text-sky-900">
                Loading Participants
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Please wait while we retrieve the registrations.
              </p>
            </div>

            {/* SKELETON CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-sky-100 bg-white p-5 shadow-sm"
                >
                  <div className="h-6 w-32 rounded-full bg-slate-100" />
                  <div className="mt-5 h-5 w-2/3 rounded bg-slate-100" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full rounded bg-slate-100" />
                    <div className="h-4 w-4/5 rounded bg-slate-100" />
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* =================================================
            ERROR STATE
        ================================================= */}

        {!loading && !needsKey && error && (

          <div className="mx-auto max-w-md">

            <Card className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-lg">
              <CardContent className="p-7 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                  <AlertCircle className="h-9 w-9 text-red-500" />
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                  Unable to Load Participants
                </h2>

                <p className="mt-2 text-sm leading-6 text-red-600">
                  {error}
                </p>

                <Button
                  onClick={() => fetchParticipants(adminKey)}
                  className="mt-6 h-11 w-full rounded-xl bg-red-600 font-bold text-white hover:bg-red-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

              </CardContent>
            </Card>

          </div>
        )}

        {/* =================================================
            PARTICIPANTS DASHBOARD
        ================================================= */}

        {!loading && !needsKey && !error && (

          <div className="space-y-6">

            {/* DASHBOARD SUMMARY */}
            <div className="grid gap-4 sm:grid-cols-2">

              {/* TOTAL PARTICIPANTS */}
              <Card className="relative overflow-hidden rounded-2xl border border-white bg-white shadow-lg shadow-sky-900/5">
                <CardContent className="relative flex items-center justify-between p-5 sm:p-6">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total Participants
                    </p>

                    <p className="mt-2 text-4xl font-extrabold tracking-tight text-sky-950">
                      {participants.length}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Successfully registered
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100">
                    <Users className="h-7 w-7 text-sky-700" />
                  </div>

                  <div className="pointer-events-none absolute -bottom-10 -right-5 h-28 w-28 rounded-full bg-sky-100/50 blur-2xl" />

                </CardContent>
              </Card>

              {/* REGISTRATION STATUS */}
              <Card className="relative overflow-hidden rounded-2xl border border-white bg-white shadow-lg shadow-sky-900/5">
                <CardContent className="relative flex items-center justify-between p-5 sm:p-6">

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Registration Status
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />

                      <p className="text-xl font-extrabold text-emerald-700">
                        Connected
                      </p>
                    </div>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Participant data loaded successfully
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>

                </CardContent>
              </Card>

            </div>

            {/* PARTICIPANTS HEADER */}
            <div className="flex flex-col gap-4 rounded-2xl border border-white bg-white/90 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100">
                  <Users className="h-5 w-5 text-sky-700" />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-sky-950">
                    Registered Participants
                  </h2>

                  <p className="text-xs text-slate-500">
                    View all conference registrations
                  </p>
                </div>

              </div>

              <Button
                onClick={() => fetchParticipants(adminKey)}
                disabled={loading}
                variant="outline"
                className="h-10 rounded-xl border-sky-200 bg-white px-4 font-semibold text-sky-800 transition-all hover:border-sky-300 hover:bg-sky-50"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>

            </div>

            {/* EMPTY STATE */}
            {participants.length === 0 ? (

              <Card className="overflow-hidden rounded-3xl border border-white bg-white shadow-sm">
                <CardContent className="flex flex-col items-center px-5 py-14 text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-indigo-100">
                    <Users className="h-10 w-10 text-sky-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-sky-950">
                    No Participants Yet
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    There are currently no registered participants.
                    New registrations will automatically appear here.
                  </p>

                  <Button
                    onClick={() => fetchParticipants(adminKey)}
                    variant="outline"
                    className="mt-5 rounded-xl border-sky-200 text-sky-800 hover:bg-sky-50"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Again
                  </Button>

                </CardContent>
              </Card>

            ) : (

              /* PARTICIPANT CARDS */
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {participants.map((p, index) => (

                  <Card
                    key={p._id}
                    className="p-0 group relative overflow-hidden rounded-2xl border border-white bg-white shadow-md shadow-sky-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-900/10"
                  >

                    {/* Card top accent */}
                    <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 opacity-70 transition-opacity group-hover:opacity-100" />

                    <CardContent className="p-5">

                      {/* REGISTRATION NUMBER */}
                      <div className="flex items-center justify-between gap-2">

                        <span className="inline-flex max-w-[75%] items-center gap-1.5 truncate rounded-lg border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-extrabold tracking-wide text-sky-800">
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{p.regNum}</span>
                        </span>

                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                          #{participants.length - index}
                        </span>

                      </div>

                      {/* PARTICIPANT NAME */}
                      <div className="mt-4 flex items-start gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100">
                          <UserRound className="h-5 w-5 text-sky-700" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-base font-extrabold leading-6 text-sky-950">
                            {p.name}
                          </h3>

                          <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                            Conference Participant
                          </p>
                        </div>

                      </div>

                      {/* PARTICIPANT INFORMATION */}
                      <div className="mt-5 space-y-3">

                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                            <Mail className="h-4 w-4 text-sky-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Email Address
                            </p>

                            <p className="mt-0.5 break-all text-sm font-medium text-slate-700">
                              {p.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                            <Phone className="h-4 w-4 text-indigo-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Mobile Number
                            </p>

                            <p className="mt-0.5 break-all text-sm font-medium text-slate-700">
                              {p.mobile}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                            <Building2 className="h-4 w-4 text-purple-600" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Affiliation / Organization
                            </p>

                            <p className="mt-0.5 break-words text-sm font-medium text-slate-700">
                              {p.affiliation}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* REGISTRATION DATE */}
                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                        <CalendarClock className="h-4 w-4 shrink-0 text-sky-500" />

                        <p className="text-xs text-slate-500">
                          <span className="font-semibold text-slate-600">
                            Registered:
                          </span>{" "}
                          {formatDate(p.createdAt)}
                        </p>
                      </div>

                    </CardContent>
                  </Card>

                ))}

              </div>
            )}

          </div>
        )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mt-auto border-t border-sky-100 bg-white/80 px-4 py-5 text-center backdrop-blur">

        <p className="text-sm font-bold text-sky-900">
          AROICON 2026
        </p>

        <p className="mt-1 text-xs text-slate-500">
          46th Annual Conference - Beyond Cancer: Stories Of Courage
        </p>

        <p className="mt-2 text-[11px] font-medium text-slate-400">
          Powered by SaaScraft Studio
        </p>

      </footer>

    </div>
  );
}
