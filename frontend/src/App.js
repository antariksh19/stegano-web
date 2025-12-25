import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MatrixRain from './MatrixRain';

// --- COMPONENT: Typewriter Animation for Decrypted Text ---
const Typewriter = ({ text }) => {
  const [currentText, setCurrentText] = useState('');
  useEffect(() => {
    if (!text) { setCurrentText(''); return; }
    let i = 0;
    setCurrentText(""); // Reset
    const timer = setInterval(() => {
      // FIX: Use slice(0, i + 1) to ensure the character at index 0 is rendered immediately
      setCurrentText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [text]);
  return <span>{currentText}</span>;
};

function App() {
  // --- ENCRYPTION STATE ---
  const [encodeFile, setEncodeFile] = useState(null);
  const [message, setMessage] = useState('');
  const [encodePassword, setEncodePassword] = useState('');
  const [encodeLoading, setEncodeLoading] = useState(false);

  // --- DECRYPTION STATE ---
  const [decodeFile, setDecodeFile] = useState(null);
  const [decodePassword, setDecodePassword] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [decodeLoading, setDecodeLoading] = useState(false);

  // --- SYSTEM STATES ---
  const [logs, setLogs] = useState([{ 
    time: new Date().toLocaleTimeString(), 
    msg: "SYSTEM_INITIALIZED: STANDING BY FOR ENCRYPTION...", 
    type: "INFO" 
  }]);
  const [isGlitching, setIsGlitching] = useState(false);

  // --- HELPER: Categorized Logging ---
  const addLog = (msg, type = "INFO") => {
    setLogs(prev => [{ 
      time: new Date().toLocaleTimeString(), 
      msg: `> ${msg}`, 
      type 
    }, ...prev].slice(0, 50));
  };

  // --- HELPER: Visual Glitch Trigger ---
  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
  };

  // --- LOGIC: Capacity/Density Calculation ---
  const getDensity = () => {
    if (!message.length) return 0;
    const capacity = encodeFile ? (encodeFile.size / 8) : 5000; 
    const density = (message.length / capacity) * 100;
    return Math.min(density, 100).toFixed(1);
  };

  // --- ACTION: Execute Encoding ---
  const handleEncode = async () => {
    const density = parseFloat(getDensity());
    
    if (density >= 100) {
      addLog("OVERFLOW_ERROR: PAYLOAD_EXCEEDS_CARRIER_CAPACITY", "ERROR");
      triggerGlitch();
      return;
    }

    if (!encodeFile || !message || !encodePassword) {
      addLog("INPUT_ERROR: MISSING_CARRIER_OR_KEY", "ERROR");
      triggerGlitch();
      return;
    }

    setEncodeLoading(true);
    addLog("SYNCHRONIZING_BIT_STREAMS...", "INFO");

    const formData = new FormData();
    formData.append('image', encodeFile);
    formData.append('message', message);
    formData.append('password', encodePassword);

    try {
      const response = await axios.post('http://localhost:5000/api/encode', formData, { 
        responseType: 'blob' 
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stego_vault.png');
      link.click();

      addLog("SUCCESS: ENCRYPTION_STREAM_DOWNLOADED", "SUCCESS");
      
      setEncodeFile(null);
      setMessage('');
      setEncodePassword('');
      const fileInput = document.getElementById('encode-input');
      if (fileInput) fileInput.value = "";

    } catch (e) {
      addLog("CRITICAL_FAULT: BACKEND_ENCODE_FAILED", "ERROR");
      triggerGlitch();
    } finally {
      setEncodeLoading(false);
    }
  };

  // --- ACTION: Execute Decoding ---
  const handleDecode = async () => {
    if (!decodeFile || !decodePassword) {
      addLog("INPUT_ERROR: MISSING_STEGO_OR_KEY", "ERROR");
      triggerGlitch();
      return;
    }

    setDecodeLoading(true);
    setDecodedMessage(""); // Clear previous message
    addLog("ATTEMPTING_DATA_RECOVERY...", "INFO");

    const formData = new FormData();
    formData.append('image', decodeFile);
    formData.append('password', decodePassword);

    try {
      const response = await axios.post('http://localhost:5000/api/decode', formData);
      setDecodedMessage(response.data.message);
      addLog("SUCCESS: DATA_RECOVERED_FROM_CARRIER", "SUCCESS");

      setDecodeFile(null);
      setDecodePassword('');
      const fileInput = document.getElementById('decode-input');
      if (fileInput) fileInput.value = "";

    } catch (error) {
      // FIX: This now correctly catches the 401 error from your updated Flask backend
      // and logs it as a Red "ERROR" type.
      const errorMsg = error.response?.data?.message || "AUTH_FAILURE: INVALID_KEY_OR_TAMPERED_PIXELS";
      addLog(errorMsg.toUpperCase(), "ERROR");
      
      triggerGlitch();
      setDecodedMessage("SYSTEM_ERROR: Access Denied.");
    } finally {
      setDecodeLoading(false);
    }
  };

  return (
    <div className={`min-h-screen text-green-400 font-mono p-4 md:p-8 relative overflow-hidden transition-all duration-100 ${isGlitching ? 'glitch-flash' : ''}`}>
      <MatrixRain />
      <div className="bg-overlay"></div>
      <div className="scanline"></div>

      <header className="border-b border-green-900 pb-4 mb-8 relative z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="hidden md:block text-[10px] opacity-40">PROTOCOL: AES_256_GCM</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-[0.4em] text-center uppercase animate-pulse">
            STEGANO_WEB_V1.0.4
          </h1>
          <div className="text-[10px] opacity-40 text-right">STATUS: STABLE_LINK</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <section className="border border-green-900 p-6 bg-black bg-opacity-75 cyber-glow">
            <h2 className="text-lg mb-6 border-b border-green-500 w-fit text-green-500 uppercase tracking-widest font-bold">Encryption_Module</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase opacity-50 block mb-1 font-bold">Upload_Carrier_Image</label>
                <input id="encode-input" type="file" onChange={(e) => setEncodeFile(e.target.files[0])} className="text-xs w-full file:bg-green-900 file:text-green-400 file:border-0 file:px-3 file:py-1 cursor-pointer" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-tighter">
                  <span className={getDensity() > 90 ? "text-red-500 animate-pulse" : "opacity-60"}>
                    {getDensity() > 90 ? "WARNING: CAPACITY_CRITICAL" : "Payload_Density"}
                  </span>
                  <span className={getDensity() > 90 ? "text-red-500" : "opacity-60"}>{getDensity()}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-900 border border-green-900/30">
                  <div 
                    className="h-full density-bar-inner" 
                    style={{ 
                      width: `${getDensity()}%`,
                      backgroundColor: getDensity() > 90 ? '#ef4444' : getDensity() > 70 ? '#eab308' : '#22c55e',
                      boxShadow: `0 0 10px ${getDensity() > 90 ? '#ef4444' : getDensity() > 70 ? '#eab308' : '#22c55e'}55`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase opacity-50 block mb-1 font-bold">Secret_Payload</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-black border border-green-900 p-2 text-sm outline-none focus:border-green-400 h-20" placeholder="Input secret message..." />
              </div>
              <input type="password" value={encodePassword} onChange={(e) => setEncodePassword(e.target.value)} className="w-full bg-black border border-green-900 p-2 text-sm outline-none focus:border-green-400" placeholder="Set Access Key" />
              <button onClick={handleEncode} disabled={encodeLoading} className="w-full bg-green-600 text-black font-bold py-2 hover:bg-green-400 transition-all uppercase text-sm disabled:opacity-50">
                {encodeLoading ? "EXECUTING..." : "EXECUTE_HIDE"}
              </button>
            </div>
          </section>

          <section className="border border-cyan-900 p-6 bg-black bg-opacity-75 cyber-glow text-cyan-400">
            <h2 className="text-lg mb-6 border-b border-cyan-500 w-fit uppercase tracking-widest font-bold">Decryption_Unit</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase opacity-50 block mb-1 font-bold">Upload_Stego_Carrier</label>
                <input id="decode-input" type="file" onChange={(e) => setDecodeFile(e.target.files[0])} className="text-xs w-full file:bg-cyan-900 file:text-cyan-400 file:border-0 file:px-3 file:py-1 cursor-pointer" />
              </div>
              <input type="password" value={decodePassword} onChange={(e) => setDecodePassword(e.target.value)} className="w-full bg-black border border-cyan-900 p-2 text-sm outline-none focus:border-cyan-400" placeholder="Enter Access Key" />
              <button onClick={handleDecode} disabled={decodeLoading} className="w-full bg-cyan-600 text-black font-bold py-2 hover:bg-cyan-400 transition-all uppercase text-sm disabled:opacity-50">
                {decodeLoading ? "EXTRACTING..." : "INITIATE_EXTRACTION"}
              </button>
              {decodedMessage && (
                <div className="mt-4 p-3 border border-dashed border-cyan-800 bg-black min-h-[60px] relative overflow-hidden">
                  <div className="scanline opacity-10"></div>
                  <p className="text-[10px] text-cyan-800 font-bold mb-1 uppercase tracking-widest">[Recovered_Message]</p>
                  <p className="text-sm"><Typewriter text={decodedMessage} /></p>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="border border-green-900 bg-black bg-opacity-90 p-4 cyber-glow shadow-2xl">
          <div className="flex justify-between items-center border-b border-green-900 mb-2 pb-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-green-700 font-bold">Live_System_Console</span>
            <span className="text-[10px] animate-pulse text-green-500 font-bold">● STABLE_CONNECTION</span>
          </div>
          <div className="h-40 overflow-y-auto space-y-1 font-mono scrollbar-hide text-[11px]">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-4">
                <span className="text-green-900 font-bold">[{log.time}]</span>
                <span className={
                  log.type === 'SUCCESS' ? 'text-cyan-400' : 
                  log.type === 'ERROR' ? 'text-red-600' : 
                  'text-green-600'
                }>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-8 text-center text-[9px] opacity-20 uppercase tracking-[0.5em] relative z-20">
        ENCRYPT_ENGINE: AES-256-GCM | STEGO_METHOD: LSB_REPLACEMENT
      </footer>
    </div>
  );
}

export default App;