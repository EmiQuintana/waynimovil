"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FlowHeader } from "@/components/FlowHeader";
import { CalendarIcon } from "@/components/Icons";
import { useContacts } from "@/hooks/useDirectory";
import { useMovements } from "@/hooks/useWallet";
import { useTransferDraftStore } from "@/store/transferDraft";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatTransferTimestamp } from "@/utils/formatDate";

export default function TransfersPage() {
  const router = useRouter();
  const movements = useMovements();
  const contacts = useContacts();
  const startTransfer = useTransferDraftStore((state) => state.startTransfer);
  const transfers = movements.data?.filter(
    (movement) => movement.type === "transfer",
  );

  function handleSelect(contactId?: string, name?: string, avatar?: string) {
    if (!contactId) {
      return;
    }

    const fromDirectory = contacts.data?.find((contact) => contact.id === contactId);

    startTransfer(
      fromDirectory ?? {
        id: contactId,
        firstName: name?.split(" ")[0] ?? "Contact",
        lastName: name?.split(" ").slice(1).join(" ") ?? "",
        fullName: name ?? "Contact",
        avatar: avatar ?? "",
      },
    );
    router.push("/transfer");
  }

  return (
    <AppShell>
      <FlowHeader title="Transfers" />
      <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 pb-6 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Latest Transfer</h2>
          <CalendarIcon className="h-5 w-5 text-zinc-700" />
        </div>

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
          ) : !transfers?.length ? (
            <p className="rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
              You don&apos;t have transfers yet.
            </p>
          ) : (
            <ul className="space-y-5">
              {transfers.map((movement) => (
                <li key={movement.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelect(
                        movement.contactId,
                        movement.contactName,
                        movement.contactAvatar,
                      )
                    }
                    className="flex w-full items-center gap-3 text-left"
                  >
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
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}
