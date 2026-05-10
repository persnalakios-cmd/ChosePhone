import { create } from 'zustand';

interface WalletState {
  balance: number;
  user: any;
  fetchWallet: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  user: null,
  fetchWallet: async () => {
    try {
      const res = await fetch('/api/users/me');
      const data = await res.json();
      if(data) {
        set({ balance: data.wallet_balance, user: data });
      }
    } catch (e) {
      console.error(e);
    }
  }
}));
