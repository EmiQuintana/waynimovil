"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContacts, useCurrentUser } from "@/hooks/useDirectory";
import { useMovements, useWallet } from "@/hooks/useWallet";
import { useTransferDraftStore } from "@/store/transferDraft";
import type { AppUser } from "@/services/users";
import type { Movement } from "@/services/wallet";
import { formatCurrency, formatSignedCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatDate";
import { AppShell } from "./AppShell";
import { ArrowDownIcon, SwapIcon, WalletIcon } from "./Icons";

export function HomeScreen() {
  const router = useRouter();
  const startTransfer = useTransferDraftStore((state) => state.startTransfer);
  const currentUser = useCurrentUser();
  const contacts = useContacts();
  const wallet = useWallet();
  const movements = useMovements();

  const usersError = currentUser.isError || contacts.isError;
  const usersLoading = currentUser.isLoading || contacts.isLoading;

  function handleSelectContact(contact: AppUser) {
    if (currentUser.data && contact.id === currentUser.data.id) {
      return;
    }

    startTransfer(contact);
    router.push("/transfer");
  }

  return (
    <AppShell>
      <header className="bg-[#2ECC71] px-6 pb-16 pt-6 text-white">
        {usersLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/40" />
            <div className="h-4 w-28 animate-pulse rounded bg-white/40" />
          </div>
        ) : usersError ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">We couldn&apos;t load your profile.</p>
            <button
              type="button"
              onClick={() => currentUser.refetch()}
              className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2ECC71]"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {currentUser.data ? (
              <Image
                src={currentUser.data.avatar}
                alt={currentUser.data.fullName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : null}
            <p className="font-semibold">{currentUser.data?.fullName}</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-white/90">Your Balance</p>
          {wallet.isLoading ? (
            <div className="mx-auto mt-3 h-10 w-40 animate-pulse rounded bg-white/40" />
          ) : (
            <p className="mt-1 text-4xl font-bold tracking-tight">
              {formatCurrency(wallet.data?.balanceCents ?? 0)}
            </p>
          )}
        </div>
      </header>

      <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 pb-6 pt-8">
        <h2 className="text-center text-lg font-bold text-zinc-900">
          Send Again
        </h2>

        <div className="mt-5">
          {usersLoading ? (
            <ContactSkeleton />
          ) : usersError ? (
            <ErrorBanner
              message="We couldn't load your contacts."
              onRetry={() => contacts.refetch()}
            />
          ) : !contacts.data?.length ? (
            <EmptyState message="You don't have contacts yet." />
          ) : (
            <ul className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {contacts.data
                .filter((contact) => contact.id !== currentUser.data?.id)
                .map((contact) => (
                <li key={contact.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectContact(contact)}
                    className="flex w-16 flex-col items-center gap-2"
                  >
                    <Image
                      src={contact.avatar}
                      alt={contact.fullName}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <span className="w-full truncate text-center text-xs text-zinc-700">
                      {contact.firstName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h2 className="mt-8 text-center text-lg font-bold text-zinc-900">
          Latest Transactions
        </h2>

        <div className="mt-5">
          {movements.isLoading ? (
            <MovementSkeleton />
          ) : !movements.data?.length ? (
            <EmptyState message="You don't have transactions yet." />
          ) : (
            <ul className="space-y-5">
              {movements.data.map((movement) => (
                <MovementItem key={movement.id} movement={movement} />
              ))}
            </ul>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function MovementItem({ movement }: { movement: Movement }) {
  const Icon =
    movement.type === "cashin"
      ? WalletIcon
      : movement.type === "transfer"
        ? SwapIcon
        : ArrowDownIcon;

  return (
    <li className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-zinc-900">{movement.title}</p>
        <p className="text-sm text-zinc-400">
          {formatDateTime(movement.createdAt)}
        </p>
      </div>
      <p
        className={`shrink-0 font-semibold ${
          movement.amountCents < 0 ? "text-red-500" : "text-emerald-500"
        }`}
      >
        {formatSignedCurrency(movement.amountCents)}
      </p>
    </li>
  );
}

function ContactSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex w-16 flex-col items-center gap-2">
          <div className="h-14 w-14 animate-pulse rounded-full bg-zinc-200" />
          <div className="h-3 w-12 animate-pulse rounded bg-zinc-200" />
        </div>
      ))}
    </div>
  );
}

function MovementSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-full bg-zinc-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="h-3 w-36 animate-pulse rounded bg-zinc-200" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded bg-zinc-200" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
      {message}
    </p>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="font-semibold text-red-800 underline"
      >
        Retry
      </button>
    </div>
  );
}
