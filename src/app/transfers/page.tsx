"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FlowHeader } from "@/components/FlowHeader";
import { CalendarIcon } from "@/components/Icons";
import { useMovements } from "@/hooks/useWallet";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTransferTimestamp } from "@/utils/formatDate";
import { filterTransfers } from "@/utils/filterTransfers";

export default function TransfersPage() {
  const movements = useMovements();
  const [contactQuery, setContactQuery] = useState("");
  const [date, setDate] = useState("");

  const transfers = useMemo(
    () => movements.data?.filter((movement) => movement.type === "transfer") ?? [],
    [movements.data],
  );

  const visibleTransfers = useMemo(
    () => filterTransfers(transfers, { contactQuery, date }),
    [transfers, contactQuery, date],
  );

  const hasFilters = contactQuery.trim().length > 0 || date.length > 0;

  return (
    <AppShell>
      <FlowHeader title="Transfers" focusTitle />
      <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 pb-6 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Latest Transfer</h2>
          <CalendarIcon className="h-5 w-5 text-zinc-700" />
        </div>

        {transfers.length > 0 ? (
          <form
            className="mt-5 grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label
                htmlFor="filter-contact"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Contact
              </label>
              <input
                id="filter-contact"
                type="search"
                value={contactQuery}
                onChange={(event) => setContactQuery(event.target.value)}
                placeholder="Search by name"
                className="w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-800 outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="filter-date"
                className="mb-1 block text-sm font-medium text-zinc-700"
              >
                Date
              </label>
              <input
                id="filter-date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-800 outline-none"
              />
            </div>
            {hasFilters ? (
              <button
                type="button"
                onClick={() => {
                  setContactQuery("");
                  setDate("");
                }}
                className="text-left text-sm font-semibold text-zinc-700 underline sm:col-span-2"
              >
                Clear filters
              </button>
            ) : null}
          </form>
        ) : null}

        <div className="mt-6">
          {movements.isLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-full bg-zinc-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-zinc-200" />
                    <div className="h-3 w-36 animate-pulse rounded bg-zinc-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : !transfers.length ? (
            <p className="rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
              You don&apos;t have transfers yet.
            </p>
          ) : !visibleTransfers.length ? (
            <p className="rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
              No transfers match your filters.
            </p>
          ) : (
            <ul className="space-y-5">
              {visibleTransfers.map((movement) => (
                <li key={movement.id} className="flex items-center gap-3">
                    {movement.contactAvatar ? (
                      <Image
                        src={movement.contactAvatar}
                        alt={movement.contactName ?? movement.title}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-500">
                        {(movement.contactName ?? movement.title).slice(0, 1)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-zinc-900">
                        {movement.contactName ?? movement.title}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {formatTransferTimestamp(movement.createdAt)}
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-zinc-900">
                      {formatCurrency(Math.abs(movement.amountCents))}
                    </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
