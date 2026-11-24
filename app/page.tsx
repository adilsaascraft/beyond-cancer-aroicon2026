
"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  UserRound,
  Mail,
  Phone,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useFormDraftStore } from "@/stores/useFormDraftStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EVEventRegistrationSchema } from "@/validations/registrationSchema";
import { gradients } from "@/lib/colors";

type FormInput = z.input<typeof EVEventRegistrationSchema>;
type FormOutput = z.output<typeof EVEventRegistrationSchema>;

const REGISTRATION_OPEN = true;
const DRAFT_KEY = "aroicon-2026-participant-form";

const INITIAL_VALUES: FormInput = {
  name: "",
  email: "",
  mobile: "",
  affiliation: "",
};

interface FieldProps {
  label: string;
  error?: string;
  icon: ReactNode;
  children: ReactNode;
}

function Field({ label, error, icon, children }: FieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
        {label}
        <span className="text-red-500">*</span>
      </Label>

      <div
        className={`group flex min-h-12 items-center gap-3 rounded-xl border bg-white px-3 transition-all duration-200 ${
          error
            ? "border-red-300 ring-2 ring-red-100"
            : "border-slate-200 hover:border-sky-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100"
        }`}
      >
        <span
          className={`shrink-0 ${
            error
              ? "text-red-400"
              : "text-slate-400 group-focus-within:text-sky-600"
          }`}
        >
          {icon}
        </span>

        <div className="min-w-0 flex-1 [&_input]:h-11 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-0 [&_input]:text-sm [&_input]:text-slate-800 [&_input]:shadow-none [&_input]:outline-none [&_input]:ring-0 [&_input]:placeholder:text-slate-400 [&_input]:focus-visible:ring-0">
          {children}
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EVreadyRegistrationPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const webinarDraft = useFormDraftStore(
    (state) => state.drafts[DRAFT_KEY]
  );

  const setDraft = useFormDraftStore((state) => state.setDraft);
  const clearDraft = useFormDraftStore((state) => state.clearDraft);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInput, any, FormOutput>({
    resolver: zodResolver(EVEventRegistrationSchema),
    defaultValues: webinarDraft || INITIAL_VALUES,
  });

  const watchedValues = useWatch({ control });

  // Save form draft
  useEffect(() => {
    if (!success) {
      setDraft(DRAFT_KEY, watchedValues);
    }
  }, [watchedValues, success, setDraft]);

  // Reset form for a new participant
  const handleNewRegistration = () => {
    reset(INITIAL_VALUES);
    clearDraft(DRAFT_KEY);
    setSuccess(false);
  };

  // Submit registration
  const onSubmit = async (data: FormOutput) => {
    setSubmitting(true);

    try {
      const res = await fetch("/api/registers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let response: any = null;

      try {
        response = await res.json();
      } catch {
        // Handle non-JSON response
      }

      if (!res.ok || !response?.success) {
        throw new Error(
          response?.message ||
            "Registration failed. Please try again."
        );
      }

      if (!response?.data?.regNum) {
        throw new Error("Invalid response from server");
      }
      setSuccess(true);
      clearDraft(DRAFT_KEY);

      toast.success("Participation confirmed successfully!");
    } catch (err: any) {
      toast.error(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // SUCCESS SCREEN
  // Render separately to avoid banner/footer scrolling
  // =========================================================

  if (success) {
    return (
      <main className="flex min-h-svh w-full items-center justify-center overflow-x-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100 px-3 py-3 sm:px-5">

        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/80 bg-white/95 p-4 text-center shadow-xl shadow-sky-900/10 sm:p-6">

          {/* Decorative top gradient */}
          <div
            className="absolute left-0 top-0 h-1.5 w-full"
            style={{ background: gradients.primary }}
          />

          {/* SUCCESS ICON */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-200 shadow-inner">
            <CheckCircle2
              className="h-10 w-10 text-emerald-600"
              strokeWidth={2.5}
            />
          </div>

          {/* SUCCESS MESSAGE */}
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-sky-900 sm:text-3xl">
            Registration Successful!
          </h1>

          <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-gray-500">
            Your participation has been successfully registered.
            We look forward to welcoming you!
          </p>

          {/* CONFERENCE DETAILS */}
          <div className="mt-4 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50 p-4 text-left">

            <div className="mb-3 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-sky-600">
                Conference
              </p>

              <h2 className="mt-1 text-base font-extrabold leading-6 text-sky-950 sm:text-lg">
                46th Annual Conference AROICON 2026
              </h2>

              <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500" />

              <p className="mt-2 text-sm font-semibold text-purple-800">
                Beyond Cancer - Stories Of Courage
              </p>
            </div>

            {/* SESSION INFORMATION */}
            <div className="grid grid-cols-1 gap-2 border-t border-sky-200/70 pt-3 sm:grid-cols-3">

              <div className="flex items-center gap-2 sm:flex-col sm:items-center sm:text-center">
                <CalendarDays className="h-5 w-5 shrink-0 text-sky-600" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Date
                  </p>
                  <p className="text-xs font-semibold text-sky-950">
                    Saturday, 05 December 2026
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-center sm:text-center">
                <Clock3 className="h-5 w-5 shrink-0 text-sky-600" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Time
                  </p>
                  <p className="text-xs font-semibold text-sky-950">
                    11:00 AM - 12:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-center sm:text-center">
                <MapPin className="h-5 w-5 shrink-0 text-sky-600" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Venue
                  </p>
                  <p className="text-xs font-semibold text-sky-950">
                    HICC, Novotel Hyderabad
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* NEW PARTICIPANT BUTTON */}
          <Button
            type="button"
            onClick={handleNewRegistration}
            style={{ background: gradients.primary }}
            className="mt-4 h-11 w-full rounded-xl border-0 font-bold text-white shadow-md transition-all duration-300 hover:opacity-90 hover:shadow-lg"
          >
            Register Another Participant
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="mt-2 text-[10px] font-medium text-gray-400">
            Powered by SaaScraft Studio
          </p>

        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN REGISTRATION PAGE
  // =========================================================

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100">

      {/* ================= BANNER ================= */}
      <header className="relative w-full overflow-hidden bg-white">
        <Image
          src="/banner.webp"
          alt="46th Annual Conference AROICON 2026 - Beyond Cancer: Stories of Courage"
          width={1920}
          height={400}
          priority
          sizes="100vw"
          className="block h-auto max-h-[260px] w-full object-cover object-center sm:max-h-none"
        />
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex flex-1 items-center justify-center px-3 py-6 sm:px-5 sm:py-10">

        <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-white bg-white shadow-xl shadow-sky-900/10">

          {!REGISTRATION_OPEN ? (

            /* ================= REGISTRATION CLOSED ================= */
            <div className="flex min-h-[400px] flex-col items-center justify-center px-5 py-12 text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <CalendarCheck className="h-10 w-10 text-red-500" />
              </div>

              <h1 className="mt-5 text-2xl font-extrabold text-sky-900 sm:text-3xl">
                Registration Closed
              </h1>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                Registration is currently closed for this event.
                Thank you for your interest in AROICON 2026.
              </p>

              <p className="mt-4 text-sm font-bold text-sky-800">
                46th Annual Conference AROICON 2026
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">

              {/* ================= LEFT CONFERENCE PANEL ================= */}
              <aside className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-indigo-950 to-slate-900 p-6 text-white sm:p-8 lg:p-10">

                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-sky-400/10 blur-2xl" />

                <div className="relative z-10 flex h-full flex-col">

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-sky-100 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Official Participant Registration
                  </div>

                  <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                    Welcome to
                  </p>

                  <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                    46th Annual Conference
                    <span className="mt-1 block bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                      AROICON 2026
                    </span>
                  </h1>

                  <div className="my-5 h-1 w-16 rounded-full bg-gradient-to-r from-fuchsia-400 via-purple-400 to-sky-400" />

                  <p className="max-w-md text-lg font-semibold leading-relaxed text-white">
                    Beyond Cancer - Stories Of Courage
                  </p>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                    Join us for an inspiring session celebrating courage,
                    resilience, and stories beyond cancer.
                  </p>

                  {/* SESSION CARD */}
                  <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">

                    <div className="mb-4 flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5 text-sky-300" />
                      <h2 className="text-sm font-bold text-white">
                        Session Details
                      </h2>
                    </div>

                    <div className="space-y-4">

                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Date
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-white">
                            Saturday, 05 December 2026
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Time
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-white">
                            11:00 AM - 12:00 PM
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" />
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Venue
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-white">
                            HICC, Novotel Hyderabad
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* TRUST NOTE */}
                  <div className="mt-auto flex items-center gap-2 pt-7 text-xs text-slate-300">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-300" />
                    Your registration details are securely submitted.
                  </div>

                </div>
              </aside>

              {/* ================= RIGHT FORM PANEL ================= */}
              <section className="p-5 sm:p-8 lg:p-10">

                {/* FORM HEADER */}
                <div className="mb-7">
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700">
                    <UserRound className="h-3.5 w-3.5" />
                    Participant Form
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    Register Your
                    <span className="block text-sky-700">
                      Participation
                    </span>
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Please provide your details below to complete
                    your conference session registration.
                  </p>
                </div>

                {/* REGISTRATION FORM */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >

                  <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">

                    {/* NAME */}
                    <Field
                      label="Full Name"
                      error={errors.name?.message}
                      icon={<UserRound className="h-5 w-5" />}
                    >
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Enter your full name"
                            autoComplete="name"
                          />
                        )}
                      />
                    </Field>

                    {/* EMAIL */}
                    <Field
                      label="Email Address"
                      error={errors.email?.message}
                      icon={<Mail className="h-5 w-5" />}
                    >
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="email"
                            placeholder="Enter your email address"
                            autoComplete="email"
                            onChange={(e) => {
                              field.onChange(
                                e.target.value.toLowerCase()
                              );
                            }}
                          />
                        )}
                      />
                    </Field>

                    {/* MOBILE */}
                    <Field
                      label="Mobile Number"
                      error={errors.mobile?.message}
                      icon={<Phone className="h-5 w-5" />}
                    >
                      <Controller
                        name="mobile"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="tel"
                            inputMode="numeric"
                            maxLength={13}
                            placeholder="Enter 10–13 digit number"
                            autoComplete="tel"
                            onChange={(e) => {
                              const digits = String(
                                e.target.value ?? ""
                              )
                                .replace(/\D/g, "")
                                .slice(0, 13);

                              field.onChange(digits);
                            }}
                          />
                        )}
                      />
                    </Field>

                    {/* AFFILIATION */}
                    <Field
                      label="Affiliation / Organization"
                      error={errors.affiliation?.message}
                      icon={<Building2 className="h-5 w-5" />}
                    >
                      <Controller
                        name="affiliation"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="Enter hospital or organization"
                            autoComplete="organization"
                          />
                        )}
                      />
                    </Field>

                  </div>

                  {/* INFORMATION NOTE */}
                  <div className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                    <p className="text-xs leading-5 text-slate-600">
                      Please ensure your name, email address, and
                      mobile number are correct before submitting.
                    </p>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-1">
                    <Button
                      type="submit"
                      disabled={submitting}
                      style={{ background: gradients.primary }}
                      className="h-12 w-full rounded-xl border-0 text-sm font-bold text-white shadow-lg shadow-sky-900/10 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Submitting Registration...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="mt-3 text-center text-xs text-slate-400">
                      Powered by SaaScraft Studio
                    </p>
                  </div>

                </form>
              </section>

            </div>
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-sky-100 bg-white/70 px-4 py-4 text-center backdrop-blur">
        <p className="text-sm font-semibold text-sky-800">
          AROICON-2026 by Apollo Hospitals
        </p>

        <p className="mt-1 text-xs text-slate-500">
          46th Annual Conference AROICON 2026
        </p>

        <p className="mt-1.5 text-[11px] text-slate-400">
          Powered by SaaScraft Studio
        </p>
      </footer>

    </div>
  );
}
