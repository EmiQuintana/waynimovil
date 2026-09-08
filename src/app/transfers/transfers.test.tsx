import { screen } from "@testing-library/react";
import TransfersPage from "@/app/transfers/page";
import { clearLedger, saveLedger } from "@/services/wallet";
import { mockContact } from "@/test/fixtures";
import { renderWithQueryClient } from "@/test/render";

jest.mock("@/hooks/useDirectory", () => ({
  useCurrentUser: () => ({
    data: undefined,
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

describe("transfer history empty state", () => {
  beforeEach(() => {
    clearLedger();
    saveLedger({
      balanceCents: 280_000,
      movements: [],
    });
  });

  it("shows the empty state when there are no movements", async () => {
    renderWithQueryClient(<TransfersPage />);

    expect(
      await screen.findByText("You don't have transfers yet."),
    ).toBeInTheDocument();
  });
});
