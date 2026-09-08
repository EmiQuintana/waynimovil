"use client";

import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useTransferDraftStore } from "@/store/transferDraft";

export default function TransferPage() {
  const recipient = useTransferDraftStore((state) => state.recipient);

  return (
    <AppShell>
      <main className="flex flex-1 flex-col px-6 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">New transfer</h1>

        {recipient ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Image
              src={recipient.avatar}
              alt={recipient.fullName}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full object-cover"
            />
            <p className="text-lg font-semibold">{recipient.fullName}</p>
            <p className="text-sm text-zinc-500">
              Recipient preloaded. Amount and concept come next.
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
            <p>Choose a contact from Home to start a transfer.</p>
            <Link
              href="/"
              className="mt-3 inline-block font-semibold text-violet-600"
            >
              Go to Home
            </Link>
          </div>
        )}
      </main>
    </AppShell>
  );
}
