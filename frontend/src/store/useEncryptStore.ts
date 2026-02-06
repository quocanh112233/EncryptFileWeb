import { create } from 'zustand';

interface EncryptState {
  inputType: 'text' | 'file';
  method: 'aes' | 'hybrid';
  textInput: string;
  fileInput: File | null;
  credential: string;
  loading: boolean;
  result: string | null;
  error: string | null;
  keyFileName: string | null;

  setInputType: (type: 'text' | 'file') => void;
  setMethod: (method: 'aes' | 'hybrid') => void;
  setTextInput: (text: string) => void;
  setFileInput: (file: File | null) => void;
  setCredential: (cred: string) => void;
  setLoading: (loading: boolean) => void;
  setResult: (res: string | null) => void;
  setError: (err: string | null) => void;
  setKeyFileName: (name: string | null) => void;
  reset: () => void;
}

export const useEncryptStore = create<EncryptState>((set) => ({
  inputType: 'text',
  method: 'aes',
  textInput: '',
  fileInput: null,
  credential: '',
  loading: false,
  result: null,
  error: null,
  keyFileName: null,

  setInputType: (inputType) => set({ inputType }),
  setMethod: (method) => set({ method }),
  setTextInput: (textInput) => set({ textInput }),
  setFileInput: (fileInput) => set({ fileInput }),
  setCredential: (credential) => set({ credential }),
  setLoading: (loading) => set({ loading }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setKeyFileName: (keyFileName) => set({ keyFileName }),
  
  reset: () => set({
      inputType: 'text',
      method: 'aes',
      textInput: '',
      fileInput: null,
      credential: '',
      loading: false,
      result: null,
      error: null,
      keyFileName: null
  })
}));
