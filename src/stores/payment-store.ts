import { create } from 'zustand';

type PaymentState = {
  services: string[];
  amount: number;
};

type PaymentStore = {
  initialPayment: PaymentState | null;
  setInitialPayment: (payment: PaymentState) => void;
  clearInitialPayment: () => void;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  initialPayment: null,
  setInitialPayment: (payment) => set({ initialPayment: payment }),
  clearInitialPayment: () => set({ initialPayment: null }),
}));
