import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, Copy, ShieldCheck, FileKey } from 'lucide-react';

interface AxiosErrorResponse {
    response?: {
        data?: {
            detail?: string;
        };
    };
    message: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function EncryptData() {
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [method, setMethod] = useState<'aes' | 'hybrid'>('aes');
  
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [credential, setCredential] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keyFileName, setKeyFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const keyFileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          if (event.target?.result) {
              setCredential(event.target.result as string);
              setKeyFileName(file.name);
          }
      };
      reader.readAsText(file);
  };

  const handleEncrypt = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      if (!credential) throw new Error("Please enter Password or provide Public Key");

      if (inputType === 'text') {
        if (!textInput) throw new Error("Please enter text to encrypt");
        
        const endpoint = `${API_BASE}/encrypt`;
        const payload = {
            text: textInput,
            password: credential,
            method: method
        };
        
        const res = await axios.post(endpoint, payload);
        setResult(res.data.encrypted_base64);
      } 
      else {
        if (!fileInput) throw new Error("Please select a file to encrypt");
        
        const endpoint = `${API_BASE}/file/encrypt`;
        const formData = new FormData();
        formData.append('file', fileInput);
        formData.append('password', credential);
        formData.append('method', method);
        
        const res = await axios.post(endpoint, formData, { responseType: 'blob' });
        
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileInput.name}.enc`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (error: any) {
       const err = error as AxiosErrorResponse;
       setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };
   
   return (
    <div className="space-y-6">
      {/* 1. Input Source Selection */}
      <div className="grid grid-cols-2 gap-4">
        <label className={`cursor-pointer p-4 rounded-xl border transition-all ${inputType === 'text' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name="inputType" checked={inputType === 'text'} onChange={() => setInputType('text')} className="hidden" />
            <div className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <span className="text-xl">📝</span> Text Input
            </div>
            <div className="text-xs text-gray-500">Encrypt secrets, messages, or tokens.</div>
        </label>
        
        <label className={`cursor-pointer p-4 rounded-xl border transition-all ${inputType === 'file' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" name="inputType" checked={inputType === 'file'} onChange={() => setInputType('file')} className="hidden" />
            <div className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <span className="text-xl">📂</span> File Upload
            </div>
            <div className="text-xs text-gray-500">Encrypt documents, images, or large binaries.</div>
        </label>
      </div>

      {/* 2. Content Input */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        {inputType === 'text' ? (
            <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your secret message here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white font-mono text-sm"
            />
        ) : (
            <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white cursor-pointer hover:bg-gray-50 hover:border-primary-400 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setFileInput(e.target.files?.[0] || null)} />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary-100 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                    </div>
                    <div>
                        <span className="text-gray-700 font-medium block">
                            {fileInput ? fileInput.name : "Click to browse file"}
                        </span>
                        <span className="text-xs text-gray-400">Supported: All file types</span>
                    </div>
                    {fileInput && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Selected: {(fileInput.size / 1024).toFixed(2)} KB</span>}
                </div>
            </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>

      {/* 3. Encryption Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <label className="block font-bold text-gray-800 mb-3">Encryption Method</label>
            <div className="space-y-3">
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${method === 'aes' ? 'bg-blue-50 border-primary-500 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="method" checked={method === 'aes'} onChange={() => { setMethod('aes'); setCredential(''); setKeyFileName(null); }} className="mt-1 text-primary-600 focus:ring-primary-500" />
                    <div>
                        <div className="font-semibold text-gray-800">AES-GCM (Password)</div>
                        <div className="text-xs text-gray-500 mt-1">Symmetric encryption. You set a password, receiver needs the same password. Simple & fast.</div>
                    </div>
                </label>
                
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${method === 'hybrid' ? 'bg-blue-50 border-primary-500 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="method" checked={method === 'hybrid'} onChange={() => { setMethod('hybrid'); setCredential(''); setKeyFileName(null); }} className="mt-1 text-primary-600 focus:ring-primary-500" />
                     <div>
                        <div className="font-semibold text-gray-800">RSA Hybrid (Public Key)</div>
                        <div className="text-xs text-gray-500 mt-1">Asymmetric encryption. You use receiver's Public Key. Only their Private Key can decrypt. Highly secure.</div>
                    </div>
                </label>
            </div>
        </div>

        <div>
             <label className="block font-bold text-gray-800 mb-3">
                {method === 'aes' ? "Set Password" : "Recipient's Public Key"}
             </label>
             
             {method === 'aes' ? (
                <div className="relative">
                    <input 
                        type="password" 
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g. SecretPass123!"
                    />
                    <div className="absolute left-3 top-3.5 text-gray-400">🔒</div>
                </div>
             ) : (
                <div className="space-y-3">
                    {/* Option to Upload Key File */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => keyFileInputRef.current?.click()}
                            className="flex-1 py-2 px-4 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2 transition-colors"
                        >
                            <FileKey className="w-4 h-4" />
                            {keyFileName ? "Change Key File" : "Upload Public Key File (.pem)"}
                        </button>
                        <input type="file" ref={keyFileInputRef} onChange={handleKeyFileUpload} accept=".pem,.key,.txt" className="hidden" />
                    </div>

                    {keyFileName && (
                        <div className="text-xs text-green-700 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3" /> Loaded: <strong>{keyFileName}</strong>
                        </div>
                    )}

                    <div className="relative">
                        <textarea
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            className="w-full h-[100px] p-3 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-gray-50"
                            placeholder="-----BEGIN PUBLIC KEY-----..."
                        />
                        {!keyFileName && !credential && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
                                (Or paste key content here)
                            </div>
                        )}
                    </div>
                </div>
             )}
        </div>
      </div>
      
      <button 
        onClick={handleEncrypt}
        disabled={loading}
        className="w-full py-4 mt-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-lg"
       >
        {loading ? "Processing Encryption..." : (
            <>
                <ShieldCheck className="w-6 h-6" />
                ENCRYPT DATA NOW
            </>
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
        </div>
      )}

      {result && inputType === 'text' && (
        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl animate-fade-in shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Encryption Successful!
                </span>
                <button 
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-sm px-3 py-1 bg-white border border-green-200 rounded-md text-green-700 hover:bg-green-100 flex items-center gap-1 transition-colors"
                >
                    <Copy className="w-3 h-3" /> Copy Result
                </button>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 font-mono text-xs break-all text-gray-600 max-h-40 overflow-y-auto shadow-inner">
                {result}
            </div>
        </div>
      )}

    </div>
  );
}
