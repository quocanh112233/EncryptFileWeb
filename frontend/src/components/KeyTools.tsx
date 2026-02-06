import { useState } from 'react';
import axios from 'axios';
import { Download, RefreshCw, Key, Shield } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export default function KeyTools() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);

  const generateKeys = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${API_BASE}/keys/generate`);
        setPublicKey(res.data.public_key);
        setPrivateKey(res.data.private_key);
    } catch (err) {
        console.error(err);
        alert("Failed to generate keys");
    } finally {
        setLoading(false);
    }
  };

  const downloadKey = (keyContent: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([keyContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
            <div className="p-4 bg-indigo-50 rounded-full">
                <Shield className="w-12 h-12 text-indigo-600" />
            </div>
        </div>
        <div>
            <h2 className="text-2xl font-bold text-gray-800">RSA Key Generator</h2>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
                Generate a secure pair of 2048-bit RSA keys. Use the <strong>Public Key</strong> to encrypt files and the <strong>Private Key</strong> to decrypt them.
            </p>
        </div>
        
        <button
            onClick={generateKeys}
            disabled={loading}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2 mx-auto"
        >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Generating Keys..." : "Generate New Key Pair"}
        </button>
      </div>

      {(publicKey || privateKey) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
            {/* Public Key Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4 text-green-700">
                    <Key className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Public Key</h3>
                </div>
                
                <textarea
                    readOnly
                    value={publicKey}
                    className="w-full h-48 p-3 text-[10px] font-mono bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none text-gray-500 mb-4"
                />
                
                <button 
                    onClick={() => downloadKey(publicKey, 'public_key.pem')}
                    className="w-full py-2.5 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 border border-green-200 flex items-center justify-center gap-2 transition-colors"
                >
                    <Download className="w-4 h-4" /> Download Public Key
                </button>
            </div>

            {/* Private Key Card */}
            <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
                    Secret
                </div>

                <div className="flex items-center gap-3 mb-4 text-red-700">
                    <Key className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Private Key</h3>
                </div>
                
                <textarea
                    readOnly
                    value={privateKey}
                    className="w-full h-48 p-3 text-[10px] font-mono bg-red-50/30 border border-red-100 rounded-lg resize-none focus:outline-none text-red-800 mb-4"
                />
                
                <button 
                   onClick={() => downloadKey(privateKey, 'private_key.pem')}
                   className="w-full py-2.5 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 border border-red-200 flex items-center justify-center gap-2 transition-colors"
                >
                    <Download className="w-4 h-4" /> Download Private Key
                </button>
            </div>
          </div>
      )}
      
      <div className="bg-yellow-50 p-4 rounded-lg text-sm text-yellow-800 border border-yellow-200 flex gap-3">
        <span className="text-xl">⚠️</span>
        <p>
            <strong>Warning:</strong> We do NOT store your keys. Once you leave or reload this page, these keys are lost forever. 
            Please download and save your <strong>Private Key</strong> in a safe place immediately.
        </p>
      </div>
    </div>
  );
}
