"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FlowHeader } from "@/components/FlowHeader";
import { useCreateTransfer } from "@/hooks/useCreateTransfer";
import { useCurrentUser } from "@/hooks/useDirectory";
import { useTransferValidation } from "@/hooks/useTransferValidation";
import { formatCurrency } from "@/utils/formatCurrency";

const CONFIRM_ERROR_ID = "transfer-confirm-error";

export default function TransferConfirmPage() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const createTransfer = useCreateTransfer();
  const { recipient, amountCents, concept, isValid, errorMessage } =
    useTransferValidation();
  const [forceError, setForceError] = useState(false);

  if (!recipient || amountCents === null) {
    return (
      <AppShell showNav={false}>
        <FlowHeader title="Confirm" focusTitle />
        <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 py-10">
          <p className="text-center text-sm text-zinc-500">
            Complete the amount and notes before confirming.
          </p>
          <button
            type="button"
            onClick={() => router.push("/transfer")}
            className="mt-6 rounded-2xl bg-[#2ECC71] px-4 py-3 font-semibold text-white"
          >
            Back to amount
          </button>
        </section>
      </AppShell>
    );
  }

  const isDisabled =
    !isValid || createTransfer.isPending || !currentUser.data;
  const liveError = createTransfer.isError
    ? "The transfer failed. Your balance was not changed."
    : errorMessage;

  async function handleConfirm() {
    if (isDisabled || !currentUser.data) {
      return;
    }

    try {
      await createTransfer.mutateAsync({
        currentUserId: currentUser.data.id,
        forceError,
      });
      router.push("/transfer/success");
    } catch {
      // Draft stays intact; error UI is rendered below.
    }
  }

  return (
    <AppShell showNav={false}>
      <FlowHeader title="Confirm" focusTitle />
      <section
        className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 pb-6 pt-8"
        aria-labelledby="confirm-summary-label"
      >
        <p
          id="confirm-summary-label"
          className="text-center text-sm text-zinc-500"
        >
          Summary
        </p>
        <p className="mt-2 text-center text-4xl font-bold text-zinc-900">
          {formatCurrency(amountCents)}
        </p>

        <div className="mt-8">
          <p className="text-sm font-bold text-zinc-900">Send to</p>
          <div className="mt-3 flex items-center gap-3">
            <Image
              src={recipient.avatar}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <p className="font-medium text-zinc-900">{recipient.fullName}</p>
          </div>
        </div>

        <dl className="mt-8 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-400">Payment</dt>
            <dd className="font-semibold">{formatCurrency(amountCents)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-400">Notes</dt>
            <dd className="text-right font-semibold">{concept}</dd>
          </div>
        </dl>

        {process.env.NODE_ENV === "development" ? (
          <div className="mt-8">
            <label
              htmlFor="force-error"
              className="flex items-center gap-2 text-sm text-zinc-600"
            >
              <input
                id="force-error"
                type="checkbox"
                checked={forceError}
                onChange={(event) => setForceError(event.target.checked)}
              />
              Force error
            </label>
          </div>
        ) : null}

        {liveError ? (
          <ErrorMessage id={CONFIRM_ERROR_ID}>{liveError}</ErrorMessage>
        ) : null}

        {createTransfer.isError ? (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDisabled}
            className="mt-2 self-start font-semibold text-red-900 underline disabled:opacity-40"
          >
            Retry
          </button>
        ) : null}

        <button
          type="button"
          disabled={isDisabled}
          aria-describedby={liveError ? CONFIRM_ERROR_ID : undefined}
          onClick={handleConfirm}
          className="mt-auto rounded-2xl bg-[#2ECC71] px-4 py-4 text-sm font-bold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {createTransfer.isPending ? "Sending..." : "Confirm"}
        </button>
      </section>
    </AppShell>
  );
}
