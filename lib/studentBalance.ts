import type { Amount } from "@/types";

function getAmountValue(amount: Amount): number {
  const value = amount.amount;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

export function getStudentBalance(
  amounts: Amount[] | null | undefined
): number {
  return (amounts ?? []).reduce(
    (balance, amount) => balance + getAmountValue(amount),
    0
  );
}
