"use client";

import { useCurrentUser } from "./useDirectory";
import { useWallet } from "./useWallet";
import { useTransferDraftStore } from "@/store/transferDraft";

export function useTransferValidation() {
  const currentUser = useCurrentUser();
  const wallet = useWallet();
  const recipient = useTransferDraftStore((state) => state.recipient);
  const amountCents = useTransferDraftStore((state) => state.amountCents);
  const concept = useTransferDraftStore((state) => state.concept);

  const balanceCents = wallet.data?.balanceCents ?? 0;
  const trimmedConcept = concept.trim();
  const isSelf =
    Boolean(recipient && currentUser.data) &&
    recipient?.id === currentUser.data?.id;
  const hasAmount = amountCents !== null;
  const exceedsBalance = hasAmount && amountCents > balanceCents;
  const missingConcept = trimmedConcept.length === 0;
  const missingRecipient = recipient === null;

  const errorMessage = missingRecipient
    ? "Choose a contact to transfer."
    : isSelf
      ? "You can't transfer to yourself."
      : !hasAmount
        ? "Enter an amount greater than 0, with up to 2 decimals."
        : exceedsBalance
          ? "You can't transfer more than your balance."
          : missingConcept
            ? "Add a note for this transfer."
            : null;

  return {
    recipient,
    amountCents,
    concept: trimmedConcept,
    balanceCents,
    isSelf,
    isValid: errorMessage === null,
    errorMessage,
  };
}
