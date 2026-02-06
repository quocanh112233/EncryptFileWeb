import { create } from 'zustand';

interface KeyState {
  publicKey: string;
  privateKey: string;
  loading: boolean;

  setKeys: (pub: string, priv: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useKeyStore = create<KeyState>((set) => ({
  publicKey: '',
  privateKey: '',
  loading: false,

  setKeys: (publicKey, privateKey) => set({ publicKey, privateKey }),
  setLoading: (loading) => set({ loading }),
}));
