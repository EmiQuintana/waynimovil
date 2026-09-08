import { http } from "./http";

export type Wallet = {
  balance: number;
};

export type Movement = {
  id: string;
  amount: number;
  concept: string;
  contactId: string;
  createdAt: string;
};

export type TransferPayload = {
  contactId: string;
  amount: number;
  concept: string;
};

export function getWallet() {
  return http<Wallet>("/api/wallet");
}

export function getMovements() {
  return http<Movement[]>("/api/movements");
}

export function createTransfer(payload: TransferPayload) {
  return http<Movement>("/api/transfers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
