import { useState } from 'react';
import EncryptData from './components/EncryptData';
import DecryptData from './components/DecryptData';
import KeyTools from './components/KeyTools';
import { ShieldCheck, Lock, Unlock, Key } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt' | 'keys'>('encrypt');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-primary-600 rounded-full shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">EncryptFileWeb</h1>
        <p className="text-gray-500 mt-2">Secure, Stateless, Byte-Oriented Crypto Engine</p>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('encrypt')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === 'encrypt' 
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            Encrypt Data
          </button>
          
          <button
            onClick={() => setActiveTab('decrypt')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === 'decrypt' 
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Unlock className="w-4 h-4" />
            Decrypt Data
          </button>
          
          <button
            onClick={() => setActiveTab('keys')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeTab === 'keys' 
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Key className="w-4 h-4" />
            Key Tools
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'encrypt' && <EncryptData />}
          {activeTab === 'decrypt' && <DecryptData />}
          {activeTab === 'keys' && <KeyTools />}
        </div>
      </div>
      
      <div className="mt-8 text-gray-400 text-sm">
        &copy; 2026 Crypto Core System. Powered by AES-GCM & RSA-OAEP.
      </div>
    </div>
  );
}

export default App;
