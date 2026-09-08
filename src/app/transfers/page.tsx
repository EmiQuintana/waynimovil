"use client";

import { AppShell } from "@/components/AppShell";
import { useMovements } from "@/hooks/useWallet";
import { formatSignedCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDate";

export default function TransfersPage() {
  const movements = useMovements();

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">Transfers</h1>
        <div className="mt-6">
          {movements.isLoading ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : !movements.data?.length ? (
            <p className="rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
              You don&apos;t have transactions yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {movements.data.map((movement) => (
                <li
                  key={movement.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold">{movement.title}</p>
                    <p className="text-sm text-zinc-400">
                      {formatDateTime(movement.createdAt)}
                    </p>
                  </div>
                  <p
                    className={
                      movement.amount < 0 ? "text-red-500" : "text-emerald-500"
                    }
                  >
                    {formatSignedCurrency(movement.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </AppShell>
  );
}
