"use client";

import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Trash2, X } from "lucide-react";

import { getErrorMessage } from "@/lib/projectService";

type Props = {
  entity: "project" | "student";
  confirmationPhrase: string;
  description: string;
  onDelete: () => Promise<void>;
};

export default function DeleteConfirmationMenu({
  entity,
  confirmationPhrase,
  description,
  onDelete,
}: Props) {
  const titleId = useId();
  const inputId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    if (confirmation !== confirmationPhrase || isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onDelete();
    } catch (error) {
      console.error(`Unable to delete ${entity}.`, error);
      setErrorMessage(
        getErrorMessage(error, `Unable to delete ${entity}.`)
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`${entity} actions`}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
      >
        <MoreVertical size={18} />
      </button>

      {isMenuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-30 w-44 rounded-xl border border-white/[0.09] bg-[#0B1729] p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsMenuOpen(false);
              setConfirmation("");
              setErrorMessage(null);
              setIsDialogOpen(true);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-300 transition hover:bg-rose-500/[0.10] hover:text-rose-200"
          >
            <Trash2 size={14} />
            Delete {entity}
          </button>
        </div>
      )}

      {isDialogOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isDeleting) {
                setIsDialogOpen(false);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#0B1729] p-5 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-500/[0.09] text-rose-300">
                    <Trash2 size={17} />
                  </div>
                  <div>
                    <h2 id={titleId} className="text-sm font-semibold">
                      Delete {entity}
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {description}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Close delete ${entity} confirmation`}
                  disabled={isDeleting}
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>

              <label
                htmlFor={inputId}
                className="mt-5 block text-xs text-slate-300"
              >
                Type{" "}
                <span className="font-semibold text-white">
                  {confirmationPhrase}
                </span>{" "}
                to confirm.
              </label>
              <input
                id={inputId}
                autoComplete="off"
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(event.target.value);
                  setErrorMessage(null);
                }}
                disabled={isDeleting}
                className="mt-2 h-10 w-full rounded-lg border border-white/[0.10] bg-[#071426] px-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-rose-400/40 focus:ring-2 focus:ring-rose-400/10 disabled:opacity-60"
              />

              {errorMessage && (
                <p role="alert" className="mt-2 text-xs text-rose-300">
                  {errorMessage}
                </p>
              )}

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDialogOpen(false)}
                  className="h-9 rounded-lg border border-white/[0.09] px-3 text-xs font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    confirmation !== confirmationPhrase || isDeleting
                  }
                  onClick={() => void handleDelete()}
                  className="h-9 rounded-lg bg-rose-500/90 px-3.5 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </section>
          </div>,
          document.body
        )}
    </div>
  );
}
