
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Check,
  CheckCircle2,
  FileBadge,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Upload,
  UserRound,
  Users,
  X,
  Mail,
  Hash,
  Phone,
  ClipboardCheck,
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase-client";
import { getErrorMessage } from "@/lib/errorMessage";

type Toast = {
  type: "success" | "error";
  message: string;
};

type StudentFormData = {
  full_name: string;
  index_number: string;
  email_address: string;
  NHI_number: string;
  mother_name: string;
  father_name: string;
  mother_contact: string;
  father_contact: string;
  emergency_number: string;
  location: string;
  gender: string;
  password: string;
};

type StudentImageField =
  | "profile_image"
  | "NHI_image"
  | "birth_cer_image";

type StudentImages = Record<StudentImageField, File | null>;
type StudentPreviewUrls = Record<StudentImageField, string | null>;

const STUDENT_IMAGE_BUCKET = "logos";

const initialFormData: StudentFormData = {
  full_name: "",
  index_number: "",
  email_address: "",
  NHI_number: "",
  mother_name: "",
  father_name: "",
  mother_contact: "",
  father_contact: "",
  emergency_number: "",
  location: "",
  gender: "",
  password: "",
};

const initialImages: StudentImages = {
  profile_image: null,
  NHI_image: null,
  birth_cer_image: null,
};

const initialPreviews: StudentPreviewUrls = {
  profile_image: null,
  NHI_image: null,
  birth_cer_image: null,
};

const inputClass =
  "h-11 sm:h-12 w-full rounded-xl border border-white/[0.08] bg-[#070C14] px-4 text-xs text-white outline-none transition-all placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/[0.08]";

const steps = [
  {
    title: "Student identity",
    description: "Basic information about the student.",
    icon: UserRound,
  },
  {
    title: "Account details",
    description: "Student contact and security information.",
    icon: LockKeyhole,
  },
  {
    title: "Identification",
    description: "Student identification and documents.",
    icon: FileBadge,
  },
  {
    title: "Parent & guardian",
    description: "Contact details for the student's parents.",
    icon: Users,
  },
  {
    title: "Emergency & review",
    description: "Review the information before registration.",
    icon: ClipboardCheck,
  },
];

function Field({
  label,
  children,
  optional = false,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-[11px] font-medium text-slate-300">
        {label}
        {optional && (
          <span className="ml-1.5 text-[10px] text-slate-500">
            Optional
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function StudentIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="pointer-events-none absolute inset-8 rounded-full bg-blue-600/20 blur-[80px]" />

      <div className="relative rounded-[2rem] border border-blue-400/[0.16] bg-gradient-to-br from-[#111E33] via-[#0B1220] to-[#080D17] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.6)]">
        {/* Illustration header */}
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <GraduationCap size={18} />
            </div>

            <div>
              <div className="h-2 w-20 rounded-full bg-slate-200/70" />
              <div className="mt-2 h-1.5 w-12 rounded-full bg-slate-500/40" />
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10">
            <Check size={15} className="text-blue-300" />
          </div>
        </div>

        {/* Student profile wireframe */}
        <div className="rounded-2xl border border-blue-400/[0.13] bg-[#080F1C]/90 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-2 w-24 rounded-full bg-slate-300/50" />
            <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1">
              <div className="h-1.5 w-10 rounded-full bg-blue-300/70" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-blue-500/[0.04]">
              <UserRound size={33} className="text-blue-300/80" />

              <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg border border-[#0B1220] bg-blue-500">
                <Check size={12} className="text-white" />
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-2 w-28 max-w-full rounded-full bg-slate-200/60" />
              <div className="h-1.5 w-20 rounded-full bg-slate-500/40" />
              <div className="h-1.5 w-24 rounded-full bg-slate-500/25" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"
              >
                <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                  {item === 0 ? (
                    <Hash size={13} className="text-blue-300" />
                  ) : (
                    <Mail size={13} className="text-blue-300" />
                  )}
                </div>
                <div className="h-1.5 w-16 max-w-full rounded-full bg-slate-300/40" />
                <div className="mt-2 h-1 w-10 rounded-full bg-slate-500/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Documents wireframe */}
        <div className="mt-3 rounded-2xl border border-blue-400/[0.12] bg-[#080F1C]/90 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2 w-24 rounded-full bg-slate-300/50" />
            <FileBadge size={15} className="text-blue-400/70" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {["ID", "NHI", "Birth"].map((label) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/15 bg-blue-500/[0.08]">
                  <FileBadge size={15} className="text-blue-300/80" />
                </div>
                <span className="text-[9px] font-medium text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Parent details */}
        <div className="mt-3 rounded-2xl border border-blue-400/[0.12] bg-[#080F1C]/90 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-2 w-28 rounded-full bg-slate-300/50" />
            <Users size={15} className="text-blue-400/70" />
          </div>

          <div className="space-y-2.5">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                  <UserRound size={13} className="text-blue-300/70" />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="h-1.5 w-20 rounded-full bg-slate-300/40" />
                  <div className="h-1 w-14 rounded-full bg-slate-500/30" />
                </div>

                <div className="h-5 w-5 rounded-full border border-blue-400/15 bg-blue-500/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating completion card */}
      <div className="absolute -bottom-4 -left-3 flex items-center gap-3 rounded-2xl border border-blue-400/15 bg-[#101827]/95 px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:-left-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15">
          <ShieldCheck size={17} className="text-blue-300" />
        </div>

        <div>
          <div className="text-[10px] font-semibold text-slate-200">
            Student registration
          </div>
          <div className="mt-1 text-[9px] text-slate-500">
            Complete student profile
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentRegisterForm({ projectId }: { projectId: string }) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(0);
  const [formData, setFormData] =
    useState<StudentFormData>(initialFormData);
  const [images, setImages] = useState<StudentImages>(initialImages);
  const [previews, setPreviews] =
    useState<StudentPreviewUrls>(initialPreviews);
  const previewUrlsRef = useRef(new Set<string>());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      previewUrls.clear();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useGSAP(
    () => {
      if (formContentRef.current) {
        gsap.fromTo(
          formContentRef.current,
          {
            opacity: 0,
            y: 12,
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
            x: 14,
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

  const updateField = <K extends keyof StudentFormData>(
    field: K,
    value: StudentFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleImageChange = (
    field: StudentImageField,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setToast({
        type: "error",
        message: "Choose a PNG, JPG, or WEBP image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({
        type: "error",
        message: "Each image must be 5 MB or smaller.",
      });
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const previousPreviewUrl = previews[field];
    if (previousPreviewUrl) {
      URL.revokeObjectURL(previousPreviewUrl);
      previewUrlsRef.current.delete(previousPreviewUrl);
    }
    previewUrlsRef.current.add(previewUrl);

    setToast(null);
    setImages((previous) => ({
      ...previous,
      [field]: file,
    }));
    setPreviews((previous) => ({
      ...previous,
      [field]: previewUrl,
    }));
  };

  const isStepValid = useMemo(() => {
    if (step === 0) {
      return (
        formData.full_name.trim().length > 0 &&
        formData.gender.length > 0 &&
        formData.location.trim().length > 0
      );
    }

    if (step === 1) {
      return formData.password.trim().length >= 4;
    }

    if (step === 2) {
      return (
        formData.NHI_number.trim().length > 0 &&
        images.birth_cer_image !== null
      );
    }

    if (step === 3) {
      return (
        formData.mother_name.trim().length > 0 &&
        formData.father_name.trim().length > 0 &&
        formData.mother_contact.trim().length > 0 &&
        formData.father_contact.trim().length > 0
      );
    }

    if (step === 4) {
      return formData.emergency_number.trim().length > 0;
    }

    return false;
  }, [step, formData, images]);

  const nextStep = () => {
    if (!isStepValid) {
      setToast({
        type: "error",
        message: "Please complete the required fields before continuing.",
      });
      return;
    }

    setToast(null);
    setStep((current) => Math.min(current + 1, 4));
  };

  const previousStep = () => {
    setToast(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const uploadImage = async (
    file: File,
    field: StudentImageField,
    userId: string
  ) => {
    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/jpeg"
          ? "jpg"
          : "webp";

    const path = `students/${projectId}/${userId}/${field}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(STUDENT_IMAGE_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(STUDENT_IMAGE_BUCKET)
      .getPublicUrl(path);

    return {
      path,
      url: data.publicUrl,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectId) {
      setToast({
        type: "error",
        message: "The project ID is missing from this registration page.",
      });
      return;
    }

    if (!isStepValid) {
      setToast({
        type: "error",
        message: "Please complete the required fields.",
      });
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    const uploadedPaths: string[] = [];

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("Please sign in as a housemaster first.");
      }

      let profileImage: string | null = null;
      let nhiImage: string | null = null;
      let birthCertificateImage: string | null = null;

      if (images.profile_image) {
        const result = await uploadImage(
          images.profile_image,
          "profile_image",
          user.id
        );
        uploadedPaths.push(result.path);
        profileImage = result.url;
      }

      if (images.NHI_image) {
        const result = await uploadImage(
          images.NHI_image,
          "NHI_image",
          user.id
        );
        uploadedPaths.push(result.path);
        nhiImage = result.url;
      }

      if (images.birth_cer_image) {
        const result = await uploadImage(
          images.birth_cer_image,
          "birth_cer_image",
          user.id
        );
        uploadedPaths.push(result.path);
        birthCertificateImage = result.url;
      }

      const { error: insertError } = await supabase
        .from("student_details")
        .insert({
          project_id: projectId,

          full_name: formData.full_name.trim(),
          index_number: formData.index_number.trim() || null,
          email_address: formData.email_address.trim() || null,

          NHI_image: nhiImage,
          NHI_number: formData.NHI_number.trim(),
          birth_cer_image: birthCertificateImage,

          mother_name: formData.mother_name.trim(),
          father_name: formData.father_name.trim(),

          mother_contact: formData.mother_contact.trim(),
          father_contact: formData.father_contact.trim(),

          emergency_number: formData.emergency_number.trim(),

          location: formData.location.trim(),
          gender: formData.gender,

          password: formData.password,

          profile_image: profileImage,
        });

      if (insertError) throw insertError;

      setToast({
        type: "success",
        message: "Student registered successfully.",
      });

      await new Promise((resolve) => window.setTimeout(resolve, 900));

      router.replace(`/home/${projectId}`);
    } catch (error) {
      let cleanupErrorMessage: string | null = null;

      if (uploadedPaths.length > 0) {
        try {
          const { error: cleanupError } = await supabase.storage
            .from(STUDENT_IMAGE_BUCKET)
            .remove(uploadedPaths);

          if (cleanupError) {
            console.error(
              "Unable to clean up uploaded student images.",
              cleanupError
            );
            cleanupErrorMessage = getErrorMessage(
              cleanupError,
              "Unable to clean up uploaded student images."
            );
          }
        } catch (cleanupError) {
          console.error(
            "Unable to clean up uploaded student images.",
            cleanupError
          );
          cleanupErrorMessage = getErrorMessage(
            cleanupError,
            "Unable to clean up uploaded student images."
          );
        }
      }

      console.error("Unable to register student.", error);

      const registrationErrorMessage = getErrorMessage(
        error,
        "Unable to register this student. Please try again."
      );

      setToast({
        type: "error",
        message: cleanupErrorMessage
          ? `${registrationErrorMessage} Image cleanup also failed: ${cleanupErrorMessage}`
          : registrationErrorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageUpload = (
    field: StudentImageField,
    label: string,
    description: string,
    required = false
  ) => {
    const file = images[field];
    const preview = previews[field];

    return (
      <Field label={label} optional={!required}>
        <label className="group flex min-h-[100px] cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/[0.12] bg-[#070C14]/70 p-3 transition hover:border-blue-400/40 hover:bg-blue-500/[0.04]">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-400/15 bg-blue-500/[0.08] text-blue-300">
            {preview ? (
              <Image
                src={preview}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <Upload size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-200">
              {file ? file.name : "Choose image"}
            </div>
            <div className="mt-1 text-[10px] leading-4 text-slate-500">
              {file ? "Click to replace image" : description}
            </div>
          </div>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            required={required}
            onChange={(event) => handleImageChange(field, event)}
          />
        </label>
      </Field>
    );
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white sm:text-lg">
              Student identity
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Start with the student&apos;s basic personal information.
            </p>
          </div>

          {imageUpload(
            "profile_image",
            "Student profile picture",
            "PNG, JPG or WEBP · max 5 MB"
          )}

          <Field label="Full name">
            <input
              required
              value={formData.full_name}
              onChange={(event) =>
                updateField("full_name", event.target.value)
              }
              placeholder="Enter student&apos;s full name"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Index number" optional>
              <input
                value={formData.index_number}
                onChange={(event) =>
                  updateField("index_number", event.target.value)
                }
                placeholder="e.g. 1234567890"
                className={inputClass}
              />
            </Field>

            <Field label="Gender">
              <select
                required
                value={formData.gender}
                onChange={(event) =>
                  updateField("gender", event.target.value)
                }
                className={`${inputClass} [color-scheme:dark]`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>

          <Field label="Residential location">
            <div className="relative">
              <MapPin
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                required
                value={formData.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Town, area or community"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white sm:text-lg">
              Account details
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Add the student&apos;s contact details and transaction security password.
            </p>
          </div>

          <Field label="Email address" optional>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                value={formData.email_address}
                onChange={(event) =>
                  updateField("email_address", event.target.value)
                }
                placeholder="student@example.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <Field label="Student security password">
            <div className="relative">
              <LockKeyhole
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                required
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="Create a security password"
                className={`${inputClass} pl-10`}
              />
            </div>
          </Field>

          <div className="rounded-xl border border-blue-400/10 bg-blue-500/[0.04] p-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-blue-300"
              />
              <p className="text-[10px] leading-5 text-slate-400">
                This password will be used to authorize important student
                transactions. It is not a student login account.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white sm:text-lg">
              Identification documents
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Provide the student&apos;s identification details and documents.
            </p>
          </div>

          <Field label="NHI number">
            <input
              required
              value={formData.NHI_number}
              onChange={(event) =>
                updateField("NHI_number", event.target.value)
              }
              placeholder="Enter NHI number"
              className={inputClass}
            />
          </Field>

          {imageUpload(
            "NHI_image",
            "NHI card image",
            "Upload the student's NHI card"
          )}

          {imageUpload(
            "birth_cer_image",
            "Birth certificate image",
            "Upload the birth certificate",
            true
          )}

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <p className="text-[10px] leading-5 text-slate-500">
              Images must be PNG, JPG or WEBP and no larger than 5 MB each.
            </p>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white sm:text-lg">
              Parent & guardian
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Keep each parent&apos;s name and contact information together.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <UserRound size={14} className="text-blue-300" />
              Mother&apos;s information
            </div>

            <div className="space-y-3">
              <Field label="Mother&apos;s full name">
                <input
                  required
                  value={formData.mother_name}
                  onChange={(event) =>
                    updateField("mother_name", event.target.value)
                  }
                  placeholder="Enter mother&apos;s name"
                  className={inputClass}
                />
              </Field>

              <Field label="Mother&apos;s contact">
                <input
                  required
                  type="tel"
                  value={formData.mother_contact}
                  onChange={(event) =>
                    updateField("mother_contact", event.target.value)
                  }
                  placeholder="e.g. 024 000 0000"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
              <UserRound size={14} className="text-blue-300" />
              Father&apos;s information
            </div>

            <div className="space-y-3">
              <Field label="Father&apos;s full name">
                <input
                  required
                  value={formData.father_name}
                  onChange={(event) =>
                    updateField("father_name", event.target.value)
                  }
                  placeholder="Enter father&apos;s name"
                  className={inputClass}
                />
              </Field>

              <Field label="Father&apos;s contact">
                <input
                  required
                  type="tel"
                  value={formData.father_contact}
                  onChange={(event) =>
                    updateField("father_contact", event.target.value)
                  }
                  placeholder="e.g. 024 000 0000"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white sm:text-lg">
            Emergency & review
          </h2>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">
            Add an emergency contact and check the registration details.
          </p>
        </div>

        <Field label="Emergency contact number">
          <div className="relative">
            <Phone
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              required
              type="tel"
              value={formData.emergency_number}
              onChange={(event) =>
                updateField("emergency_number", event.target.value)
              }
              placeholder="Emergency contact number"
              className={`${inputClass} pl-10`}
            />
          </div>
        </Field>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-200">
            <ClipboardCheck size={15} className="text-blue-300" />
            Registration summary
          </div>

          <div className="space-y-3">
            {[
              ["Full name", formData.full_name],
              ["Index number", formData.index_number || "Not provided"],
              ["Email", formData.email_address || "Not provided"],
              ["Gender", formData.gender],
              ["Location", formData.location],
              ["NHI number", formData.NHI_number],
              ["Mother", formData.mother_name],
              ["Father", formData.father_name],
              ["Emergency contact", formData.emergency_number],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
              >
                <span className="text-[10px] text-slate-500">{label}</span>
                <span className="max-w-[65%] break-words text-right text-[10px] font-medium text-slate-300">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-400/10 bg-blue-500/[0.04] p-3">
          <p className="text-[10px] leading-5 text-slate-400">
            By registering, you confirm that the information entered belongs
            to this student and is correct.
          </p>
        </div>
      </div>
    );
  };

  if (!projectId) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#070B12] px-4 text-white">
        <div className="max-w-sm rounded-2xl border border-red-400/15 bg-[#111827] p-6 text-center">
          <AlertCircle className="mx-auto mb-3 text-red-300" size={24} />
          <h1 className="text-sm font-semibold">Project ID missing</h1>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Open student registration from a project so its ID can be attached.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      ref={containerRef}
      className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden px-3 py-5 text-white sm:px-5 sm:py-6"
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12rem] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[110px]" />
        <div className="absolute right-[-10rem] top-[-6rem] h-80 w-80 rounded-full bg-blue-500/[0.06] blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Back to project
        </button>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-blue-300/[0.12] bg-gradient-to-br from-[#101A2B]/95 via-[#090F19]/95 to-[#070B12]/95 shadow-[0_28px_100px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-32 -top-32 hidden h-96 w-96 rounded-full bg-blue-500/[0.07] blur-[100px] md:block" />

          {/* Heading */}
          <div className="mb-5 mt-5 px-4 text-center sm:px-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/[0.13] bg-blue-500/[0.06] px-3 py-1.5">
              <GraduationCap size={12} className="text-blue-400" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-300">
                HouseHub student registration
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.05em] text-white sm:text-3xl">
              Register a student<span className="text-blue-400">.</span>
            </h1>

            <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              Add student information, identification documents and guardian
              contacts to your house.
            </p>
          </div>

          {/* Five-step progress */}
          <div className="mx-auto mb-5 w-full max-w-3xl px-4 sm:px-6">
            <div className="flex items-center">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const completed = index < step;
                const active = index === step;

                return (
                  <div key={item.title} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all sm:h-9 sm:w-9 ${
                          completed
                            ? "border-blue-400/30 bg-blue-500 text-white"
                            : active
                              ? "border-blue-400/40 bg-blue-500/15 text-blue-300 shadow-[0_0_22px_rgba(59,130,246,0.12)]"
                              : "border-white/[0.08] bg-white/[0.025] text-slate-600"
                        }`}
                      >
                        {completed ? (
                          <Check size={15} />
                        ) : (
                          <Icon size={15} />
                        )}
                      </div>

                      <span
                        className={`mt-2 hidden text-center text-[9px] font-medium sm:block ${
                          active
                            ? "text-blue-300"
                            : completed
                              ? "text-slate-300"
                              : "text-slate-600"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`mx-1 h-px flex-1 sm:mx-2 ${
                          index < step
                            ? "bg-blue-400/50"
                            : "bg-white/[0.07]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between sm:hidden">
              <span className="text-[10px] font-medium text-blue-300">
                Step {step + 1} of 5
              </span>
              <span className="text-[10px] text-slate-500">
                {steps[step].title}
              </span>
            </div>
          </div>

          <div className="md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            {/* Form */}
            <section className="min-w-0 p-4 sm:p-6 lg:p-7">
              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#070D16]/65">
                <form onSubmit={handleSubmit}>
                  <div
                    ref={formContentRef}
                    className="min-h-[390px] px-4 py-5 sm:min-h-[410px] sm:px-5 sm:py-6"
                  >
                    {renderStep()}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-white/[0.012] px-4 py-3.5 sm:px-5">
                    {step === 0 ? (
                      <span className="text-[9px] text-slate-600 sm:text-[10px]">
                        Student information made simple.
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={previousStep}
                        disabled={isSubmitting}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-[11px] font-medium text-slate-400 transition hover:border-white/[0.15] hover:text-white disabled:opacity-40 sm:px-4"
                      >
                        <ArrowLeft size={13} />
                        Back
                      </button>
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid || isSubmitting}
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
                        disabled={!isStepValid || isSubmitting}
                        className="group inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-[11px] font-semibold text-white shadow-[0_5px_20px_rgba(37,99,235,0.2)] transition duration-300 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                      >
                        {isSubmitting ? (
                          <LoaderCircle size={14} className="animate-spin" />
                        ) : (
                          <Check size={14} />
                        )}
                        {isSubmitting ? "Registering..." : "Register student"}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </section>

            {/* New student illustration */}
            <aside className="relative hidden min-w-0 items-center justify-center px-5 py-8 md:flex lg:px-7">
              <div ref={previewRef} className="w-full max-w-[430px]">
                <StudentIllustration />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
          className={`fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-2xl border p-4 shadow-[0_16px_50px_rgba(0,0,0,0.45)] ${
            toast.type === "success"
              ? "border-blue-400/20 bg-[#101E32] text-blue-200"
              : "border-red-400/20 bg-[#25151A] text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-blue-400"
            />
          ) : (
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-400"
            />
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

      {/* Full-screen loading */}
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
              />
            </div>

            <h2 className="mt-5 text-base font-semibold text-white">
              Registering student
            </h2>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Uploading documents and saving student information...
            </p>

            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-blue-300/80">
              Please keep this page open
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function StudentRegisterPage({
  projectId,
}: {
  projectId: string;
}) {
  return <StudentRegisterForm projectId={projectId} />;
}
