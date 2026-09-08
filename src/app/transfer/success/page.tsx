"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useTransferDraftStore } from "@/store/transferDraft";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatLongDate, formatTime } from "@/utils/formatDate";

export default function TransferSuccessPage() {
  const router = useRouter();
  const lastCompleted = useTransferDraftStore((state) => state.lastCompleted);
  const reset = useTransferDraftStore((state) => state.reset);

  if (!lastCompleted) {
    return (
      <AppShell>
        <main className="flex flex-1 flex-col items-center justify-center px-6">
          <p className="text-sm text-zinc-500">No completed transfer to show.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 font-semibold text-[#2ECC71]"
          >
            Back to Home
          </button>
        </main>
      </AppShell>
    );
  }

  const transfer = lastCompleted;

  function goHome() {
    reset();
    router.push("/");
  }

  async function shareTransfer() {
    const text = `Transfer of ${formatCurrency(transfer.amountCents)} to ${transfer.recipient.fullName}. Ref #${transfer.reference}`;

    if (navigator.share) {
      await navigator.share({ title: "WayniWallet transfer", text });
      return;
    }

    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex min-h-dvh justify-center bg-[#2ECC71]">
      <div className="flex min-h-dvh w-full max-w-[430px] flex-col px-5 py-8 md:max-w-2xl">
        <div className="flex flex-1 flex-col rounded-[2rem] bg-white px-6 py-8">
          <h1 className="text-center text-lg font-bold text-[#2ECC71]">
            Transfer Successful
          </h1>
          <p className="mt-1 text-center text-sm text-zinc-400">
            Your transaction was successful!
          </p>
          <p className="mt-6 text-center text-4xl font-bold text-zinc-900">
            {formatCurrency(lastCompleted.amountCents)}
          </p>

          <div className="mt-8">
            <p className="text-sm font-bold text-zinc-900">Send to</p>
            <div className="mt-3 flex items-center gap-3">
              <Image
                src={lastCompleted.recipient.avatar}
                alt={lastCompleted.recipient.fullName}
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover"
              />
              <p className="font-medium">{lastCompleted.recipient.fullName}</p>
            </div>
          </div>

          <h2 className="mt-8 text-sm font-bold text-zinc-900">
            Transaction Details
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Detail label="Payment" value={formatCurrency(lastCompleted.amountCents)} />
            <Detail label="Notes" value={lastCompleted.concept} />
            <Detail label="Date" value={formatLongDate(lastCompleted.createdAt)} />
            <Detail label="Time" value={formatTime(lastCompleted.createdAt)} />
            <Detail
              label="Reference Number"
              value={`#${lastCompleted.reference}`}
            />
          </dl>
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={shareTransfer}
            className="rounded-2xl border border-white px-4 py-3 font-semibold text-white"
          >
            Share
          </button>
          <button
            type="button"
            onClick={goHome}
            className="rounded-2xl bg-white px-4 py-3 font-semibold text-[#2ECC71]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="text-right font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}
