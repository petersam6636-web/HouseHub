
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ImagePlus,
  MapPin,
  School,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type ProjectFormData = {
  title: string;
  school_name: string;
  location: string;
  logo_image: File | null;
  start_date: string;
  academic_year: string;
};

const initialFormData: ProjectFormData = {
  title: "",
  school_name: "",
  location: "",
  logo_image: null,
  start_date: "",
  academic_year: "",
};

const steps = [
  {
    number: "01",
    title: "Project identity",
    description: "Let's start with the basic information about your project.",
  },
  {
    number: "02",
    title: "Academic details",
    description: "Complete the academic information to finish setting up.",
  },
];

export default function CreateProject() {
  const containerRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [formData, setFormData] =
    useState<ProjectFormData>(initialFormData);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!formData.logo_image) {
      setLogoPreview(null);
      return;
    }

    const url = URL.createObjectURL(formData.logo_image);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [formData.logo_image]);

  useGSAP(
    () => {
      if (!formContentRef.current || !previewRef.current) return;

      gsap.fromTo(
        formContentRef.current,
        {
          opacity: 0,
          y: 12,
          filter: "blur(3px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.3,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        previewRef.current,
        {
          opacity: 0.6,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power3.out",
        }
      );
    },
    {
      dependencies: [step],
      scope: containerRef,
      revertOnUpdate: true,
    }
  );

  const updateField = <K extends keyof ProjectFormData>(
    field: K,
    value: ProjectFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleLogo = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    updateField("logo_image", file);
  };

  const removeLogo = () => {
    updateField("logo_image", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextStep = () => {
    if (step === 0) {
      if (
        !formData.title.trim() ||
        !formData.school_name.trim() ||
        !formData.location.trim()
      ) {
        return;
      }

      setStep(1);
    }
  };

  const previousStep = () => {
    setStep(0);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.school_name.trim() ||
      !formData.location.trim() ||
      !formData.start_date ||
      !formData.academic_year.trim()
    ) {
      return;
    }

    // Connect your Supabase project insert and logo upload here.
    // user_id should come from the authenticated user.
    // id should be generated automatically by the database.
  };

  const activeStep = steps[step];

  return (
    <main
      ref={containerRef}
      className="relative min-h-full w-full overflow-hidden py-5 text-white sm:py-8"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* Page introduction */}
          <div className="mb-7 sm:mb-9">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/[0.13] bg-blue-500/[0.06] px-3 py-1.5">
              <Sparkles size={12} className="text-blue-400" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                New workspace
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.05em] text-white sm:text-3xl lg:text-[36px]">
              Start a new project<span className="text-blue-400">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm">
              Create your school workspace and bring your academic activities
              together in one organized place.
            </p>
          </div>

          {/* Main form layout */}
          <div className="grid items-stretch gap-5 md:grid-cols-[minmax(0,1fr)_230px] lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-7">
            {/* LEFT: Form */}
            <section className="min-w-0 overflow-hidden rounded-[1.5rem] border border-white/[0.07] bg-gradient-to-br from-[#0D1523]/95 via-[#090F1A]/95 to-[#070B12]/95 shadow-[0_20px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl">
              {/* Progress */}
              <div className="border-b border-white/[0.06] px-5 py-5 sm:px-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">
                      Step {step + 1} of 2
                    </p>

                    <h2 className="mt-1 text-sm font-semibold text-white">
                      {activeStep.title}
                    </h2>
                  </div>

                  <span className="text-xs font-semibold tabular-nums text-blue-300">
                    {step === 0 ? "50%" : "100%"}
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <div
                    className={`h-1 flex-1 overflow-hidden rounded-full transition-colors duration-300 ${
                      step >= 0 ? "bg-blue-500" : "bg-white/[0.08]"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 overflow-hidden rounded-full transition-colors duration-300 ${
                      step >= 1 ? "bg-blue-500" : "bg-white/[0.08]"
                    }`}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div
                  ref={formContentRef}
                  className="min-h-[390px] px-5 py-6 sm:px-7 sm:py-8"
                >
                  {step === 0 ? (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white">
                          Tell us about your project
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          Start by giving your project an identity.
                        </p>
                      </div>

                      {/* Project title */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          Project title
                        </label>

                        <div className="relative">
                          <Building2
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                          />

                          <input
                            required
                            value={formData.title}
                            onChange={(e) =>
                              updateField("title", e.target.value)
                            }
                            placeholder="e.g. 2026 Academic Project"
                            className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-10 pr-4 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/[0.08]"
                          />
                        </div>
                      </div>

                      {/* School name */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          School name
                        </label>

                        <div className="relative">
                          <School
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                          />

                          <input
                            required
                            value={formData.school_name}
                            onChange={(e) =>
                              updateField("school_name", e.target.value)
                            }
                            placeholder="Enter your school's name"
                            className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-10 pr-4 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/[0.08]"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          School location
                        </label>

                        <div className="relative">
                          <MapPin
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                          />

                          <input
                            required
                            value={formData.location}
                            onChange={(e) =>
                              updateField("location", e.target.value)
                            }
                            placeholder="e.g. Accra, Ghana"
                            className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-10 pr-4 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/[0.08]"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white">
                          Academic details
                        </h3>

                        <p className="mt-1.5 text-xs leading-5 text-slate-500">
                          Add the academic year, starting date and school logo.
                        </p>
                      </div>

                      {/* Logo upload */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          School logo
                          <span className="ml-1 text-slate-600">
                            (optional)
                          </span>
                        </label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleLogo(e.target.files?.[0])
                          }
                        />

                        {logoPreview ? (
                          <div className="flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.05] p-3">
                            <img
                              src={logoPreview}
                              alt="School logo preview"
                              className="h-12 w-12 rounded-lg border border-white/[0.08] object-cover"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium text-white">
                                {formData.logo_image?.name}
                              </p>
                              <p className="mt-1 text-[10px] text-blue-300">
                                Logo selected
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={removeLogo}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                              aria-label="Remove logo"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              handleLogo(e.dataTransfer.files?.[0]);
                            }}
                            className={`flex min-h-[100px] w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 transition ${
                              isDragging
                                ? "border-blue-400 bg-blue-500/[0.1]"
                                : "border-white/[0.12] bg-[#070C14] hover:border-blue-400/30 hover:bg-blue-500/[0.035]"
                            }`}
                          >
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
                              <ImagePlus size={17} />
                            </div>

                            <span className="text-[11px] font-semibold text-slate-200">
                              Upload school logo
                            </span>

                            <span className="mt-1 text-[9px] text-slate-500">
                              PNG, JPG or WEBP
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Start date */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          Project start date
                        </label>

                        <div className="relative">
                          <CalendarDays
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                          />

                          <input
                            required
                            type="date"
                            value={formData.start_date}
                            onChange={(e) =>
                              updateField("start_date", e.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-10 pr-4 text-xs text-white outline-none transition-all focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/[0.08] [color-scheme:dark]"
                          />
                        </div>
                      </div>

                      {/* Academic year */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          Academic year
                        </label>

                        <div className="relative">
                          <CalendarDays
                            size={15}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                          />

                          <input
                            required
                            value={formData.academic_year}
                            onChange={(e) =>
                              updateField("academic_year", e.target.value)
                            }
                            placeholder="e.g. 2026/2027"
                            className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#070C14] pl-10 pr-4 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/[0.08]"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form actions */}
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.012] px-5 py-4 sm:px-7">
                  {step === 0 ? (
                    <span className="text-[10px] text-slate-600">
                      Your project starts here.
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={previousStep}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] px-4 text-[11px] font-medium text-slate-400 transition hover:border-white/[0.15] hover:text-white"
                    >
                      <ArrowLeft size={13} />
                      Back
                    </button>
                  )}

                  {step === 0 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        !formData.title.trim() ||
                        !formData.school_name.trim() ||
                        !formData.location.trim()
                      }
                      className="group inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[11px] font-semibold text-white shadow-[0_5px_20px_rgba(37,99,235,0.2)] transition duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={
                        !formData.start_date ||
                        !formData.academic_year.trim()
                      }
                      className="group inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[11px] font-semibold text-white shadow-[0_5px_20px_rgba(37,99,235,0.2)] transition duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Check size={14} />
                      Create project
                    </button>
                  )}
                </div>
              </form>
            </section>

            {/* RIGHT: Compact visual preview */}
            <aside
              ref={previewRef}
              className="hidden flex-col justify-center gap-3 md:flex"
            >
              {/* Preview card 1 */}
              <div
                className={`relative overflow-hidden rounded-[1.4rem] border p-4 transition-all duration-300 ${
                  step === 0
                    ? "border-blue-400/30 bg-gradient-to-br from-[#142440] to-[#0B1423] shadow-[0_12px_40px_rgba(37,99,235,0.12)]"
                    : "border-white/[0.07] bg-[#0A101B]"
                }`}
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.09] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                      Step 01
                    </span>

                    {step > 0 ? (
                      <CheckCircle2
                        size={15}
                        className="text-blue-400"
                      />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    )}
                  </div>

                  <div className="my-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/[0.1] text-blue-300">
                    <Building2 size={20} />
                  </div>

                  <p className="text-xs font-semibold text-white">
                    Project identity
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    Project name, school and location.
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
                    <div className="h-1.5 w-3/4 rounded-full bg-white/[0.07]" />
                    <div className="h-1.5 w-1/2 rounded-full bg-white/[0.07]" />
                  </div>
                </div>
              </div>

              {/* Connection */}
              <div className="flex items-center gap-2 px-5">
                <div className="h-5 w-px bg-gradient-to-b from-blue-400/40 to-blue-400/10" />
                <span className="text-[9px] text-slate-600">
                  {step === 0 ? "Next step" : "Completed"}
                </span>
              </div>

              {/* Preview card 2 */}
              <div
                className={`relative overflow-hidden rounded-[1.4rem] border p-4 transition-all duration-300 ${
                  step === 1
                    ? "border-blue-400/30 bg-gradient-to-br from-[#142440] to-[#0B1423] shadow-[0_12px_40px_rgba(37,99,235,0.12)]"
                    : "border-white/[0.07] bg-[#0A101B]"
                }`}
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.09] blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-300">
                      Step 02
                    </span>

                    {step === 1 ? (
                      <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    ) : (
                      <CalendarDays
                        size={14}
                        className="text-slate-600"
                      />
                    )}
                  </div>

                  <div className="my-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/[0.1] text-blue-300">
                    <CalendarDays size={20} />
                  </div>

                  <p className="text-xs font-semibold text-white">
                    Academic details
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    School logo, start date and academic year.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.04]">
                      <ImagePlus size={12} className="text-blue-300" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="h-1.5 w-full rounded-full bg-white/[0.07]" />
                      <div className="h-1.5 w-2/3 rounded-full bg-white/[0.07]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom note */}
              <div className="mt-1 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <CheckCircle2
                  size={14}
                  className="mt-0.5 shrink-0 text-blue-400"
                />

                <p className="text-[9px] leading-5 text-slate-500">
                  Your project details will help organize your school
                  workspace.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
