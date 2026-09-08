import { screen, waitFor } from "@testing-library/react";
import { HomeScreen } from "@/components/HomeScreen";
import { ledgerQueryKey } from "@/hooks/useWallet";
import {
  clearLedger,
  createTransfer,
  getLedger,
  saveLedger,
} from "@/services/wallet";
import { mockContact, mockCurrentUser } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

jest.mock("@/services/users", () => {
  const actual = jest.requireActual("@/services/users");
  const { mockContact, mockCurrentUser } = jest.requireActual("@/test/fixtures");

  return {
    ...actual,
    getDirectory: jest.fn().mockResolvedValue({
      currentUser: mockCurrentUser,
      contacts: [mockContact],
    }),
  };
});

describe("successful transfer updates balance and history", () => {
  beforeEach(() => {
    clearLedger();
    saveLedger({
      balanceCents: 280_000,
      movements: [],
    });
  });

  it("updates the Home balance and latest transactions after a successful transfer", async () => {
    const { queryClient } = renderWithQueryClient(<HomeScreen />);

    expect(await screen.findByText("$ 2.800,00")).toBeInTheDocument();
    expect(
      await screen.findByText("You don't have transactions yet."),
    ).toBeInTheDocument();

    await createTransfer({
      recipient: mockContact,
      currentUserId: mockCurrentUser.id,
      amountCents: 150_000,
      concept: "For food",
    });

    queryClient.setQueryData(ledgerQueryKey, getLedger());

    await waitFor(() => {
      expect(screen.getByText("$ 1.300,00")).toBeInTheDocument();
      expect(screen.getByText("For food")).toBeInTheDocument();
    });

    expect(getLedger().balanceCents).toBe(130_000);
    expect(getLedger().movements).toHaveLength(1);
  });
});
