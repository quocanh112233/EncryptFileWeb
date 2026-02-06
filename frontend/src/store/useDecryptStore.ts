import { create } from 'zustand';

interface DecryptState {
  inputType: 'text' | 'file';
  textInput: string;
  fileInput: File | null;
  credential: string;
  keyFileName: string | null;
  loading: boolean;
  result: string | null;
  error: string | null;

  setInputType: (type: 'text' | 'file') => void;
  setTextInput: (text: string) => void;
  setFileInput: (file: File | null) => void;
  setCredential: (cred: string) => void;
  setKeyFileName: (name: string | null) => void;
  setLoading: (loading: boolean) => void;
  setResult: (res: string | null) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

export const useDecryptStore = create<DecryptState>((set) => ({
  inputType: 'text',
  textInput: '',
  fileInput: null,
  credential: '',
  keyFileName: null,
  loading: false,
  result: null,
  error: null,

  setInputType: (inputType) => set({ inputType }),
  setTextInput: (textInput) => set({ textInput }),
  setFileInput: (fileInput) => set({ fileInput }),
  setCredential: (credential) => set({ credential }),
  setKeyFileName: (keyFileName) => set({ keyFileName }),
  setLoading: (loading) => set({ loading }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),

  reset: () => set({
      inputType: 'text',
      textInput: '',
      fileInput: null,
      credential: '',
      keyFileName: null,
      loading: false,
      result: null,
      error: null
  })
}));
