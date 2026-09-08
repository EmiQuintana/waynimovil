import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransferConfirmPage from "@/app/transfer/confirm/page";
import {
  clearLedger,
  createTransfer,
  getLedger,
  saveLedger,
} from "@/services/wallet";
import { useTransferDraftStore } from "@/store/transferDraft";
import { mockContact, mockCurrentUser } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

jest.mock("@/hooks/useDirectory", () => ({
  useCurrentUser: () => ({
    data: mockCurrentUser,
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
  useContacts: () => ({
    data: [mockContact],
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

describe("cannot confirm a transfer greater than the balance", () => {
  beforeEach(() => {
    clearLedger();
    useTransferDraftStore.getState().reset();
    saveLedger({
      balanceCents: 280_000,
      movements: [],
    });
  });

  it("rejects the transfer in the wallet service and does not persist it", async () => {
    await expect(
      createTransfer({
        recipient: mockContact,
        currentUserId: mockCurrentUser.id,
        amountCents: 280_001,
        concept: "Too much",
      }),
    ).rejects.toThrow("Insufficient funds");

    const ledger = getLedger();
    expect(ledger.balanceCents).toBe(280_000);
    expect(ledger.movements).toHaveLength(0);
  });

  it("keeps the Confirm button disabled on the confirmation screen", async () => {
    useTransferDraftStore.setState({
      recipient: mockContact,
      amountInput: "2800.01",
      amountCents: 280_001,
      concept: "Too much",
    });

    renderWithQueryClient(<TransferConfirmPage />);

    expect(
      await screen.findByText("You can't transfer more than your balance."),
    ).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    expect(confirmButton).toBeDisabled();

    await userEvent.click(confirmButton);

    expect(getLedger().movements).toHaveLength(0);
    expect(getLedger().balanceCents).toBe(280_000);
  });
});
