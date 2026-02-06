import { useRef } from 'react';
import axios from 'axios';
import { Key, Search, FileText, Upload, FileKey, CheckCircle } from 'lucide-react';
import { useDecryptStore } from '../store/useDecryptStore';

interface AxiosErrorResponse {
    response?: {
        data?: {
            detail?: string;
        };
    };
    message: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function DecryptData() {
  const {
      inputType, textInput, fileInput, credential, keyFileName, loading, result, error,
      setInputType, setTextInput, setFileInput, setCredential, setKeyFileName, setLoading, setResult, setError
  } = useDecryptStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const keyFileInputRef = useRef<HTMLInputElement>(null);

  const isPrivateKey = credential.trim().startsWith("-----BEGIN");

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

  const handleDecrypt = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      if (!credential) throw new Error("Please enter Password or Upload Private Key");

      // Attempt decryption
      if (inputType === 'text') {
        if (!textInput) throw new Error("Please enter encrypted text");
        
        const res = await axios.post(`${API_BASE}/decrypt`, {
            encrypted_base64: textInput,
            password: credential
        });
        setResult(res.data.decrypted_text);
      } 
      else {
        if (!fileInput) throw new Error("Please select a file to decrypt");
        
        const formData = new FormData();
        formData.append('file', fileInput);
        formData.append('password', credential);
        
        const res = await axios.post(`${API_BASE}/file/decrypt`, formData, {
            responseType: 'blob'
        });
        
        const rawName = res.headers['content-disposition']?.split('filename=')[1] || "decrypted_file";
        const filename = rawName.replace(/"/g, '');
        
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      }
    } catch (error: any) {
       const err = error as AxiosErrorResponse;
       setError(err.response?.data?.detail || err.message + ". Check your credential!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Input Type Selection */}
      <div className="grid grid-cols-2 gap-4">
        <label className={`cursor-pointer p-4 rounded-xl border transition-all ${inputType === 'text' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" checked={inputType === 'text'} onChange={() => setInputType('text')} className="hidden" />
            <div className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <span className="text-xl">🔡</span> Encrypted Text
            </div>
            <div className="text-xs text-gray-500">Decrypt Base64 strings.</div>
        </label>
        
        <label className={`cursor-pointer p-4 rounded-xl border transition-all ${inputType === 'file' ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
            <input type="radio" checked={inputType === 'file'} onChange={() => setInputType('file')} className="hidden" />
            <div className="font-semibold text-gray-800 flex items-center gap-2 mb-1">
                <span className="text-xl">📄</span> Encrypted File
            </div>
            <div className="text-xs text-gray-500">Decrypt .enc files.</div>
        </label>
      </div>

       {/* 2. Content Input */}
       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        {inputType === 'text' ? (
            <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste ciphertext (Base64) here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-xs bg-white text-gray-600"
            />
        ) : (
             <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white cursor-pointer hover:bg-gray-50 hover:border-primary-400 transition-colors group"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => setFileInput(e.target.files?.[0] || null)} />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary-100 transition-colors">
                        <FileText className="w-8 h-8 text-gray-400 group-hover:text-primary-600" />
                    </div>
                    <div>
                        <span className="text-gray-700 font-medium block">
                            {fileInput ? fileInput.name : "Select .enc file to decrypt"}
                        </span>
                    </div>
                     {fileInput && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">Selected: {(fileInput.size / 1024).toFixed(2)} KB</span>}
                </div>
            </div>
        )}
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      {/* 3. Credential Section */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
         <div className="flex items-start gap-3 mb-4">
            <Search className="w-5 h-5 text-blue-600 mt-1" />
            <div>
                <h3 className="font-bold text-gray-800">Decryption Custom</h3>
                <p className="text-sm text-gray-600">
                    You don't need to choose AES or RSA. The system auto-detects it from the file header. 
                    <br/>
                    <strong>Just provide the correct key/password below.</strong>
                </p>
            </div>
         </div>

         <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
             <label className="block font-bold text-gray-700 mb-2">
                Unlock Credential
             </label>
             
             <div className="flex flex-col gap-3">
                 {/* Helper Buttons */}
                 <div className="flex gap-2">
                    <button 
                        onClick={() => keyFileInputRef.current?.click()}
                        className="py-2 px-4 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-sm text-gray-700 font-medium flex items-center gap-2 transition-colors"
                    >
                        <FileKey className="w-4 h-4" />
                        Upload Private Key File (.pem)
                    </button>
                    <input type="file" ref={keyFileInputRef} onChange={handleKeyFileUpload} accept=".pem,.key,.txt" className="hidden" />
                 </div>
                 
                 {keyFileName && (
                    <div className="text-xs text-green-700 flex items-center gap-1 bg-green-50 px-2 py-1 rounded w-fit">
                        <CheckCircle className="w-3 h-3" /> Loaded: <strong>{keyFileName}</strong>
                    </div>
                 )}

                 {/* Text Area */}
                 <div className="relative">
                    <textarea
                        value={credential}
                        onChange={(e) => {setCredential(e.target.value); setKeyFileName(null);}}
                        className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 font-mono text-sm ${isPrivateKey ? "h-[100px] text-xs bg-red-50 text-red-900" : "h-[60px]"}`}
                        placeholder="Enter Password... OR Paste Private Key here..."
                    />
                    <div className="absolute right-2 top-2 text-[10px] text-gray-400 bg-white px-1 rounded border">
                        {isPrivateKey ? "Detected: RSA Private Key" : "Assuming: Password string"}
                    </div>
                </div>
             </div>
         </div>
      </div>

        <button 
            onClick={handleDecrypt}
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 text-lg"
        >
            {loading ? "Decrypting..." : (
                <>
                    <Key className="w-6 h-6" />
                    DECRYPT NOW
                </>
            )}
        </button>

        {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 flex items-center gap-2">
                <span className="text-xl">🚫</span>
                <span>{error}</span>
            </div>
        )}

        {result && inputType === 'text' && (
             <div className="p-5 bg-gray-100 rounded-xl border border-gray-200 shadow-inner">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" /> Decrypted Content:
                </h3>
                <div className="whitespace-pre-wrap font-sans text-gray-800 bg-white p-3 rounded border border-gray-200">
                    {result}
                </div>
             </div>
        )}

    </div>
  );
}
