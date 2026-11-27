import { Suspense } from "react";
import Transaction from "./Transaction";

export default function TransactionsRoute() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-[#05070D] px-4 text-sm text-slate-400">
          Loading transactions...
        </main>
      }
    >
      <Transaction />
    </Suspense>
  );
}