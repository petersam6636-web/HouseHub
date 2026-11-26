
"use client";

import { useEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  CircleHelp,
  House,
  LoaderCircle,
  MapPin,
  MessageCircle,
  School,
  Sparkles,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase-client";
import useApp from "@/lib/useApp";
import {
  fetchProjectsForUser,
  getErrorMessage,
} from "@/lib/projectService";

type Toast = {
  type: "success" | "error";
  message: string;
};

type ProjectFormData = {
  title: string;
  school_name: string;
  location: string;
  start_date: string;
  academic_year: string;
};

const getTodayDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const initialFormData: ProjectFormData = {
  title: "",
  school_name: "",
  location: "",
  start_date: "",
  academic_year: "",
};

const bars = [38, 62, 48, 82, 57, 91, 70];
const rooms = [
  { width: "w-14", height: "h-1" },
  { width: "w-10", height: "h-1" },
  { width: "w-12", height: "h-1" },
];

const inputClass =
  "h-11 sm:h-12 w-full rounded-xl border border-white/[0.08] bg-[#070C14] pl-10 pr-4 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/40 focus:ring-2 focus:ring-blue-500/[0.08]";

export default function CreateProject() {
  const router = useRouter();
  const { authenticatedId, setProjects } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const cancelConfirmationRef = useRef<HTMLButtonElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [formData, setFormData] =
    useState<ProjectFormData>(initialFormData);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLogoDragging, setIsLogoDragging] = useState(false);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 7000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    setFormData((current) =>
      current.start_date
        ? current
        : { ...current, start_date: getTodayDate() }
    );
  }, []);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [logoFile]);

  useEffect(() => {
    if (!isConfirmOpen) return;

    cancelConfirmationRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) {
        setIsConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirmOpen, isSubmitting]);

  useGSAP(
    () => {
      if (formContentRef.current) {
        gsap.fromTo(
          formContentRef.current,
          {
            opacity: 0,
            y: 10,
            filter: "blur(2px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power3.out",
          }
        );
      }

      if (previewRef.current) {
        gsap.fromTo(
          previewRef.current,
          {
            opacity: 0,
            x: 12,
            scale: 0.985,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.35,
            ease: "power3.out",
          }
        );
      }
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

  const isIdentityValid =
    formData.title.trim().length > 0 &&
    formData.school_name.trim().length > 0 &&
    formData.location.trim().length > 0;

  const isAcademicValid =
    formData.start_date.length > 0 &&
    formData.academic_year.trim().length > 0;

  const nextStep = () => {
    if (!isIdentityValid) return;
    setStep(1);
  };

  const previousStep = () => {
    setStep(0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isIdentityValid || !isAcademicValid) return;

    setToast(null);
    setIsConfirmOpen(true);
  };

  const handleLogoChange = (file: File | undefined) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setToast({
        type: "error",
        message: "Choose a PNG, JPG, or WEBP image for the logo.",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setToast({
        type: "error",
        message: "The logo image must be 5 MB or smaller.",
      });
      return;
    }

    setToast(null);
    setLogoFile(file);
  };

  const handleLogoDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLogoDragging(false);
    handleLogoChange(event.dataTransfer.files[0]);
  };

  const resetFormAfterCreate = () => {
    setStep(0);
    setFormData({
      ...initialFormData,
      start_date: getTodayDate(),
    });
    setLogoFile(null);
    setLogoPreview(null);
    setIsLogoDragging(false);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleConfirmCreate = async () => {
    setIsConfirmOpen(false);
    setIsSubmitting(true);
    let uploadedLogoPath: string | null = null;

    try {
      if (!authenticatedId) {
        throw new Error("Sign in before creating a house.");
      }
      const userId = authenticatedId;
      let logoImage: string | null = null;

      if (logoFile) {
        const extension =
          logoFile.type === "image/png"
            ? "png"
            : logoFile.type === "image/jpeg"
              ? "jpg"
              : "webp";
        uploadedLogoPath = `${userId}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("logos")
          .upload(uploadedLogoPath, logoFile, {
            cacheControl: "3600",
            contentType: logoFile.type,
            upsert: false,
          });
        if (uploadError) throw uploadError;

        logoImage = supabase.storage
          .from("logos")
          .getPublicUrl(uploadedLogoPath).data.publicUrl;
      }

      const { data: project, error } = await supabase
        .from("projects")
        .insert({
          title: formData.title.trim(),
          school_name: formData.school_name.trim(),
          location: formData.location.trim(),
          logo_image: logoImage,
          start_date: formData.start_date,
          academic_year: formData.academic_year.trim(),
          user_id: userId,
        })
        .select("id")
        .single();
      if (error || !project) {
        if (uploadedLogoPath) {
          const { error: cleanupError } = await supabase.storage
            .from("logos")
            .remove([uploadedLogoPath]);
          if (cleanupError) {
            console.error(
              "Unable to remove the unused uploaded logo.",
              cleanupError
            );
          }
        }
        if (error) throw error;
        throw new Error("The project was saved without returning its ID.");
      }

      resetFormAfterCreate();

      try {
        const userProjects = await fetchProjectsForUser(userId);
        setProjects(userProjects);
      } catch (refreshError) {
        console.error(
          "The house was created, but its related project data could not be loaded.",
          refreshError
        );
        setToast({
          type: "error",
          message: `The house was created, but its related data could not be loaded: ${getErrorMessage(
            refreshError,
            "Unable to load project data."
          )}`,
        });
        await new Promise((resolve) => window.setTimeout(resolve, 1200));
        router.replace(`/home/${project.id}`);
        return;
      }

      setIsSubmitting(false);
      setToast({
        type: "success",
        message: "Your project was created. Opening its details...",
      });
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      router.replace(`/home/${project.id}`);
    } catch (error) {
      setToast({
        type: "error",
        message: getErrorMessage(
          error,
          "Your house could not be created. Please try again."
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden px-3 py-5 text-white sm:px-5 sm:py-6"
    >
      {/* Page atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12rem] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[110px]" />
        <div className="absolute right-[-10rem] top-[-6rem] h-80 w-80 rounded-full bg-blue-500/[0.06] blur-[110px]" />
      </div>


      <div className="mx-auto w-full max-w-[1200px]">
        <Link
          href="/home/project"
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          All projects
        </Link>

        {/* Shared form and illustration card */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-300/[0.12] bg-gradient-to-br from-[#101A2B]/95 via-[#090F19]/95 to-[#070B12]/95 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl ">
          <div className="pointer-events-none absolute -right-32 -top-32 hidden h-96 w-96 rounded-full bg-blue-500/[0.07] blur-[100px] md:block" />
           <div className=" w-full mt-2 text-center mb-3">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/[0.13] bg-blue-500/[0.06] px-3 py-1.5">
                <Sparkles size={12} className="text-blue-400" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                  HouseHub setup
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-[-0.05em] text-white sm:text-3xl lg:text-[30px]">
                Set up your house
                <span className="text-blue-400">.</span>
              </h1>

              <p className="mx-auto mt-2 w-full text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Organize your house, manage responsibilities, and keep
                house-related issues in one place.
              </p>
            </div>

          <div className="md:grid items-start md:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          {/* LEFT: Form */}
          <section className="relative min-w-0 p-4 sm:p-6 lg:p-6">
            {/* Form card */}
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#070D16]/65">
              <form onSubmit={handleSubmit}>
                <div
                  ref={formContentRef}
                  className="min-h-[350px] px-4 py-5 sm:min-h-[360px] sm:px-5 sm:py-6"
                >
                  {step === 0 ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
                          Tell us about your house
                        </h3>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500 sm:text-xs">
                          Give your house or residence a name and location.
                        </p>
                      </div>

                      {/* House title */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          House name
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
                            placeholder="e.g. My House"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* School / house name */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          Institution or property name
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
                            placeholder="e.g. House, hostel or school"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                           location
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
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold tracking-tight text-white sm:text-lg">
                          House details
                        </h3>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500 sm:text-xs">
                          Add the date and academic year for your house.
                        </p>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <label className="text-[11px] font-medium text-slate-300">
                            House logo
                            <span className="ml-1.5 text-[10px] text-slate-500">
                              Optional
                            </span>
                          </label>
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            aria-label="Choose a house logo, or drag and drop an image"
                            onClick={() => logoInputRef.current?.click()}
                            onDragEnter={(event) => {
                              event.preventDefault();
                              setIsLogoDragging(true);
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.dataTransfer.dropEffect = "copy";
                              setIsLogoDragging(true);
                            }}
                            onDragLeave={(event) => {
                              const nextTarget = event.relatedTarget;
                              if (
                                !(nextTarget instanceof Node) ||
                                !event.currentTarget.contains(nextTarget)
                              ) {
                                setIsLogoDragging(false);
                              }
                            }}
                            onDrop={handleLogoDrop}
                            className={`group flex min-h-28 w-full items-center justify-start gap-4 rounded-2xl border-2 border-dashed px-4 py-5 text-left outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/60 ${
                              isLogoDragging
                                ? "scale-[1.01] border-blue-400 bg-blue-500/[0.12] shadow-[0_0_36px_rgba(59,130,246,0.16)]"
                                : "border-white/[0.1] bg-[#070C14]/70 hover:border-blue-400/60 hover:bg-blue-500/[0.05] hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]"
                            }`}
                          >
                            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/[0.1] text-blue-300 transition duration-200 group-hover:scale-105 group-hover:bg-blue-500/[0.16]">
                              {logoPreview ? (
                                <Image
                                  src={logoPreview}
                                  alt=""
                                  width={56}
                                  height={56}
                                  unoptimized
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Upload size={20} aria-hidden="true" />
                              )}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="truncate text-xs font-semibold text-slate-100">
                                {isLogoDragging
                                  ? "Drop your logo to upload"
                                  : logoFile
                                    ? logoFile.name
                                    : "Drag and drop your logo"}
                              </span>
                              <span className="mt-1 block text-[10px] text-slate-400">
                                {logoFile
                                  ? "Click or drop another image to replace this one"
                                  : "or click to browse · PNG, JPG, WEBP · max 5 MB"}
                              </span>
                            </span>
                          </button>
                          <input
                            ref={logoInputRef}
                            id="house-logo"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="sr-only"
                            onChange={(event) => {
                              handleLogoChange(event.currentTarget.files?.[0]);
                              event.currentTarget.value = "";
                            }}
                          />
                          {logoFile && (
                            <button
                              type="button"
                              aria-label="Remove selected logo"
                              onClick={() => setLogoFile(null)}
                              className="absolute right-2 top-2 z-10 rounded-lg border border-white/10 bg-[#0B1220]/90 p-2 text-slate-300 shadow-lg transition hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-200"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Start date */}
                      <div>
                        <label className="mb-2 block text-[11px] font-medium text-slate-300">
                          Start date
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
                            className={`${inputClass} [color-scheme:dark]`}
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
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form actions */}
                <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.012] px-4 py-3.5 sm:px-5">
                  {step === 0 ? (
                    <span className="text-[9px] text-slate-600 sm:text-[10px]">
                      A better-managed house starts here.
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={previousStep}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-[11px] font-medium text-slate-400 transition hover:border-white/[0.15] hover:text-white sm:px-4"
                    >
                      <ArrowLeft size={13} />
                      Back
                    </button>
                  )}

                  {step === 0 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isIdentityValid}
                      className="group inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-[11px] font-semibold text-white shadow-[0_5px_20px_rgba(37,99,235,0.2)] transition duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
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
                      disabled={!isAcademicValid}
                      className="group inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-[11px] font-semibold text-white shadow-[0_5px_20px_rgba(37,99,235,0.2)] transition duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                    >
                      <Check size={14} />
                      Create house
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* RIGHT: House management dashboard illustration */}
          <aside className="relative hidden min-w-0 items-center justify-center px-5 py-5 md:flex lg:px-7 lg:py-6">
            <div
              ref={previewRef}
              className="order-2 relative mx-auto w-full max-w-[390px] md:order-none md:mx-0 md:flex-1 lg:max-w-[430px]"
            >
              <div className="pointer-events-none absolute inset-4 rounded-[2.5rem] bg-blue-600/[0.20] blur-[65px]" />

              <div className="relative rounded-[1.7rem] border border-blue-400/[0.18] bg-gradient-to-br from-[#111E33] via-[#0B1220] to-[#080D17] p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.6),0_0_45px_rgba(37,99,235,0.12)] sm:p-4">
                <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                      <House size={14} />
                    </div>

                    <div className="space-y-1">
                      <div className="h-1.5 w-16 rounded-full bg-slate-200/80" />
                      <div className="h-1 w-10 rounded-full bg-slate-500/50" />
                    </div>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  </div>
                </div>

                <div className="grid grid-cols-[1.05fr_0.95fr] gap-3">
                  <div className="relative overflow-hidden rounded-2xl border border-blue-400/[0.13] bg-[#080F1C]/90 p-3">
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/[0.12] blur-2xl" />

                    <div className="relative mb-3 flex items-center justify-between">
                      <div className="h-1.5 w-12 rounded-full bg-slate-400/50" />
                      <div className="h-1.5 w-5 rounded-full bg-blue-400/60" />
                    </div>

                    <div className="relative flex items-center justify-center py-1">
                      <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full bg-[conic-gradient(from_220deg,#2563eb_0deg,#60a5fa_245deg,rgba(30,41,59,0.65)_245deg,rgba(30,41,59,0.65)_360deg)] shadow-[0_0_24px_rgba(37,99,235,0.16)]">
                        <div className="absolute inset-[7px] rounded-full bg-[#0B1424]" />

                        <div className="relative flex flex-col items-center gap-1">
                          <Check size={20} className="text-blue-300" />
                          <div className="h-1.5 w-7 rounded-full bg-slate-300/60" />
                        </div>
                      </div>
                    </div>

                    <div className="relative mt-3 space-y-2">
                      <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
                        <div className="h-full w-[72%] rounded-full bg-blue-500" />
                      </div>
                      <div className="flex justify-between">
                        <div className="h-1 w-8 rounded-full bg-slate-500/50" />
                        <div className="h-1 w-5 rounded-full bg-slate-500/30" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="rounded-2xl border border-blue-400/[0.12] bg-[#080F1C]/90 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="h-1.5 w-10 rounded-full bg-slate-400/50" />
                        <Wallet size={13} className="text-blue-400/70" />
                      </div>

                      <div className="h-5 w-14 rounded-md bg-blue-400/15" />

                      <div className="mt-3 flex h-10 items-end gap-1.5">
                        {bars.map((height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-700/60 to-blue-400/90"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-400/[0.12] bg-[#080F1C]/90 p-3">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="h-1.5 w-12 rounded-full bg-slate-400/50" />
                        <ClipboardCheck size={13} className="text-blue-400/70" />
                      </div>

                      <div className="space-y-2.5">
                        {rooms.map((room, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex h-4 w-4 items-center justify-center rounded-md bg-blue-500/15">
                              <Check size={9} className="text-blue-300" />
                            </div>
                            <div
                              className={`${room.width} ${room.height} rounded-full bg-slate-400/25`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[Wallet, ClipboardCheck, MessageCircle].map((Icon, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-xl border border-white/[0.05] bg-white/[0.025] p-2.5"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                        <Icon size={13} className="text-blue-400" />
                      </div>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-400/30" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute -right-3 -top-3 h-14 w-14 rounded-2xl border border-blue-400/15 bg-blue-500/[0.08] shadow-[0_0_30px_rgba(37,99,235,0.12)] sm:-right-4 sm:-top-4 sm:h-16 sm:w-16" />

              <div className="absolute -bottom-4 -left-3 flex items-center gap-2.5 rounded-xl border border-blue-400/15 bg-[#101827]/95 px-3 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:-left-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15">
                  <CheckCircle2 size={15} className="text-blue-400" />
                </div>

                <div className="space-y-1">
                  <div className="h-1.5 w-14 rounded-full bg-slate-200/70" />
                  <div className="h-1 w-10 rounded-full bg-slate-500/50" />
                </div>
              </div>
            </div>
          </aside>
          
        </div>
        </div>
      </div>

      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712]/75 px-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) {
              setIsConfirmOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-house-confirmation"
            className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#101A2B] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300 shadow-[0_0_28px_rgba(59,130,246,0.12)]">
                <CircleHelp size={23} strokeWidth={1.8} aria-hidden="true" />
              </div>
            </div>
            <p
              id="create-house-confirmation"
              className="text-center text-sm font-medium text-slate-100"
            >
              Are you sure you want to create this house?
            </p>

            <div className="mt-5 flex justify-center gap-3">
              <button
                ref={cancelConfirmationRef}
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsConfirmOpen(false)}
                className="h-10 min-w-20 rounded-xl border border-white/[0.1] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
              >
                No
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmCreate}
                className="h-10 min-w-20 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-wait disabled:opacity-60"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#030712]/75 px-4 backdrop-blur-md"
        >
          <div className="w-full max-w-sm rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#142139] to-[#0B1220] p-7 text-center shadow-[0_24px_90px_rgba(0,0,0,0.6)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
              <LoaderCircle
                size={27}
                strokeWidth={1.8}
                className="animate-spin"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-5 text-base font-semibold text-white">
              Saving your house
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Saving your project details securely...
            </p>
            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-blue-300/80">
              Please keep this page open
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
          aria-atomic="true"
          className={`fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-2xl border p-4 shadow-[0_16px_50px_rgba(0,0,0,0.45)] ${
            toast.type === "success"
              ? "border-emerald-400/20 bg-[#0D211B] text-emerald-200"
              : "border-red-400/20 bg-[#25151A] text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          )}
          <p className="flex-1 text-xs leading-5">{toast.message}</p>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="rounded-md p-1 text-current/70 transition hover:bg-white/[0.08] hover:text-current"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </main>
  );
}
