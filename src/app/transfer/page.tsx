"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FlowHeader } from "@/components/FlowHeader";
import { useFocusOnMount } from "@/hooks/useFocusOnMount";
import { useTransferValidation } from "@/hooks/useTransferValidation";
import { useTransferDraftStore } from "@/store/transferDraft";
import { formatCurrency } from "@/utils/formatCurrency";

const AMOUNT_ERROR_ID = "transfer-amount-error";

export default function TransferAmountPage() {
  const router = useRouter();
  const amountRef = useFocusOnMount<HTMLInputElement>();
  const amountInput = useTransferDraftStore((state) => state.amountInput);
  const concept = useTransferDraftStore((state) => state.concept);
  const setAmountInput = useTransferDraftStore((state) => state.setAmountInput);
  const setConcept = useTransferDraftStore((state) => state.setConcept);
  const { recipient, balanceCents, isValid, errorMessage, isSelf } =
    useTransferValidation();

  if (!recipient) {
    return (
      <AppShell>
        <FlowHeader title="Send again" focusTitle />
        <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 py-10">
          <p className="text-center text-sm text-zinc-500">
            Choose a contact from Home to start a transfer.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl bg-[#2ECC71] px-4 py-3 font-semibold text-white"
          >
            Go to Home
          </button>
        </section>
      </AppShell>
    );
  }

  const canProceed = isValid && !isSelf;
  const showError = Boolean(errorMessage && (amountInput || concept));
  const amountInvalid = Boolean(
    errorMessage &&
      (errorMessage.includes("amount") ||
        errorMessage.includes("balance") ||
        errorMessage.includes("decimals")),
  );

  return (
    <AppShell showNav={false}>
      <FlowHeader title="Send again">
        <div className="mt-4 text-center">
          <p className="text-sm text-white/90" id="current-balance-label">
            Your Balance
          </p>
          <p
            className="mt-1 text-4xl font-bold"
            aria-labelledby="current-balance-label"
          >
            {formatCurrency(balanceCents)}
          </p>
        </div>
      </FlowHeader>

      <section className="-mt-10 flex flex-1 flex-col rounded-t-[2.5rem] bg-white px-6 pb-6 pt-8">
        <div className="flex flex-col items-center">
          <Image
            src={recipient.avatar}
            alt=""
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
          <p className="mt-3 text-sm font-medium text-zinc-800">
            {recipient.fullName}
          </p>
        </div>

        <div className="mt-8 text-center">
          <label
            htmlFor="transfer-amount"
            className="block text-base font-semibold text-zinc-900"
          >
            Set Amount
          </label>
          <span className="mt-2 flex items-center justify-center gap-1 text-4xl font-bold text-zinc-900">
            <span aria-hidden="true">$</span>
            <input
              ref={amountRef}
              id="transfer-amount"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              inputMode="decimal"
              placeholder="0,00"
              autoComplete="off"
              aria-invalid={amountInvalid}
              aria-describedby={showError ? AMOUNT_ERROR_ID : undefined}
              className="w-40 bg-transparent text-center outline-none"
            />
          </span>
        </div>

        <div className="mt-8">
          <label
            htmlFor="transfer-notes"
            className="block text-base font-bold text-zinc-900"
          >
            Notes
          </label>
          <textarea
            id="transfer-notes"
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            placeholder="For food"
            rows={3}
            aria-required="true"
            aria-invalid={Boolean(errorMessage?.includes("note"))}
            aria-describedby={showError ? AMOUNT_ERROR_ID : undefined}
            className="mt-3 w-full resize-none rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
          />
        </div>

        {showError && errorMessage ? (
          <ErrorMessage id={AMOUNT_ERROR_ID}>{errorMessage}</ErrorMessage>
        ) : null}

        <button
          type="button"
          disabled={!canProceed}
          aria-describedby={showError ? AMOUNT_ERROR_ID : undefined}
          onClick={() => router.push("/transfer/confirm")}
          className="mt-auto rounded-2xl bg-[#2ECC71] px-4 py-4 text-sm font-bold uppercase tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Proceed to Transfer
        </button>
      </section>
    </AppShell>
  );
}
