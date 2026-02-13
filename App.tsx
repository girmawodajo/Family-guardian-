
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Sidebar'; 
import StatCard from './components/StatCard';
import ActivityChart from './components/ActivityChart';
import TacticalMap from './components/TacticalMap';
import { MOCK_DEVICES, MOCK_DETAILED_ACTIVITIES, MOCK_CALLS, MOCK_SOCIAL_FLAGS, INITIAL_RULES, MOCK_FILES, MOCK_APPS, MOCK_CONVERSATIONS } from './constants';
import { Device, DetailedActivity, CallLog, SocialFlag, Rule, FileRecord, AppInventory, AssistantHistoryItem, SocialConversation, SocialMessage, SafetyAlert, DeviceType } from './types';
import { getParentingAdvice, analyzeActivityScreenshot, analyzeCallIntent, analyzeFileRisk, analyzeSocialMediaPlatform, analyzeAmbientEnvironment } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [detailedActivities] = useState<DetailedActivity[]>(MOCK_DETAILED_ACTIVITIES);
  const [calls, setCalls] = useState<CallLog[]>(MOCK_CALLS);
  const [socialFlags, setSocialFlags] = useState<SocialFlag[]>(MOCK_SOCIAL_FLAGS);
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [files] = useState<FileRecord[]>(MOCK_FILES);
  const [apps, setApps] = useState<AppInventory[]>(MOCK_APPS);
  
  // Selected state for map interaction
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(MOCK_DEVICES[0].id);

  // Notification State
  const [alerts, setAlerts] = useState<SafetyAlert[]>([
    { id: 'a1', title: 'Suspicious Executable', description: 'Deep scan found an unverified .exe in Leo\'s downloads.', severity: 'critical', timestamp: '10m ago', isRead: false },
    { id: 'a2', title: 'Bedtime Violation', description: 'Emma used iPad 20 mins past scheduled curfew.', severity: 'warning', timestamp: '1h ago', isRead: false },
    { id: 'a3', title: 'Encrypted Backup', description: 'Weekly safety cloud sync completed successfully.', severity: 'info', timestamp: '5h ago', isRead: true },
  ]);
  const [isAlertPanelOpen, setIsAlertPanelOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ load: 0, status: 'Optimal' });

  // AI Assistant State
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [advice, setAdvice] = useState<{content: string; suggestions: string[]; riskLevel?: string; detectedPlatform?: string} | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [history, setHistory] = useState<AssistantHistoryItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Social & Remote Management State
  const [conversations, setConversations] = useState<SocialConversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<SocialConversation | null>(null);
  const [isSyncingSocial, setIsSyncingSocial] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null);
  const [activeSocialPlatform, setActiveSocialPlatform] = useState<string | 'all'>('all');

  // Command & Control State
  const [commandLog, setCommandLog] = useState<{id: string, text: string, type: 'info' | 'success' | 'danger'}[]>([]);
  const [remoteMessage, setRemoteMessage] = useState('');
  const [isLocking, setIsLocking] = useState(false);
  const [hwStatus, setHwStatus] = useState({ cam: true, mic: true, gps: true });
  
  // ZTP (Zero-Touch Provisioning) State
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionNumber, setProvisionNumber] = useState('');
  const [provisionProgress, setProvisionProgress] = useState(0);

  // Ambient & Monitoring State
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [streamSource, setStreamSource] = useState<'camera' | 'screen' | 'ambient'>('camera');
  const [ambientTranscripts, setAmbientTranscripts] = useState<{id: string, text: string, speaker: string, time: string}[]>([]);
  const [isAnalyzingAmbient, setIsAnalyzingAmbient] = useState(false);
  const [ambientReport, setAmbientReport] = useState<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Simulation Logic
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      setSystemHealth({ 
        load: Math.floor(Math.random() * 15) + 5, 
        status: Math.random() > 0.9 ? 'Syncing' : 'Optimal' 
      });

      setDevices(prev => prev.map(d => {
        if (d.status === 'online') {
          const drift = 0.00005;
          return {
            ...d,
            location: {
              ...d.location,
              lat: d.location.lat + (Math.random() - 0.5) * drift,
              lng: d.location.lng + (Math.random() - 0.5) * drift,
            }
          };
        }
        return d;
      }));
    }, 3000);

    return () => clearInterval(simulationInterval);
  }, []);

  // Ambient Simulation
  useEffect(() => {
    if (isLiveStreaming && streamSource === 'ambient') {
      const phrases = [
        { text: "Yeah, let's just go after school.", speaker: "Child" },
        { text: "Did you finish the homework?", speaker: "Friend" },
        { text: "I don't know, it's a secret.", speaker: "Child" },
        { text: "Wait, someone is coming.", speaker: "Unknown" },
        { text: "Is it safe here?", speaker: "Friend" },
        { text: "Shut up and listen.", speaker: "Unknown" },
        { text: "Why are you always so loud?", speaker: "Teacher" },
        { text: "Don't tell anyone about this place.", speaker: "Unknown" }
      ];

      const interval = setInterval(() => {
        const p = phrases[Math.floor(Math.random() * phrases.length)];
        setAmbientTranscripts(prev => [...prev, {
          id: Math.random().toString(),
          text: p.text,
          speaker: p.speaker,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }].slice(-50));
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [isLiveStreaming, streamSource]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ambientTranscripts]);

  const toggleRule = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
  const markAlertRead = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));

  const addLog = (text: string, type: 'info' | 'success' | 'danger' = 'info') => {
    setCommandLog(prev => [{ id: Math.random().toString(), text, type }, ...prev.slice(0, 19)]);
  };

  const executeCommand = async (commandName: string, payload?: any) => {
    const selectedDevice = devices.find(d => d.id === selectedDeviceId);
    if (!selectedDevice) return;

    addLog(`INITIATING REMOTE_${commandName.toUpperCase()}...`, 'info');
    await new Promise(r => setTimeout(r, 800));
    addLog(`PACKET_SENT -> TARGET: ${selectedDevice.name}`, 'info');
    await new Promise(r => setTimeout(r, 1200));
    addLog(`REMOTE_ACKNOWLEDGED: ${commandName.toUpperCase()}_EXECUTED`, 'success');
  };

  const runAmbientAIAnalysis = async () => {
    if (ambientTranscripts.length === 0) return;
    setIsAnalyzingAmbient(true);
    const text = ambientTranscripts.map(t => `${t.speaker}: ${t.text}`).join('\n');
    try {
      const report = await analyzeAmbientEnvironment(text);
      setAmbientReport(report);
      if (report.threatLevel === 'High' || report.threatLevel === 'Medium') {
        setAlerts(prev => [{
          id: Date.now().toString(),
          title: `Ambient Risk Detected: ${report.threatLevel}`,
          description: report.summary,
          severity: report.threatLevel === 'High' ? 'critical' : 'warning',
          timestamp: 'Just now',
          isRead: false
        }, ...prev]);
      }
    } finally {
      setIsAnalyzingAmbient(false);
    }
  };

  const startZTPProvisioning = async () => {
    if (!provisionNumber) return;
    setIsProvisioning(true);
    setProvisionProgress(0);
    addLog(`SEARCHING_CARRIER_LINK: ${provisionNumber}`, 'info');
    const steps = ["SS7_PROTOCOL_HANDSHAKE", "SIGNAL_RECEPTION_STABLE", "PACKET_INJECTION_ESTABLISHED", "SHADOW_AGENT_DEPLOYED"];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 1500));
      setProvisionProgress(((i + 1) / steps.length) * 100);
      addLog(`STATUS: ${steps[i]}... OK`, 'success');
    }
    const newDevice: Device = {
      id: Math.random().toString(),
      name: `Shadow_${provisionNumber.slice(-4)}`,
      type: DeviceType.MOBILE,
      owner: "Intercept",
      status: 'online',
      lastSeen: 'Just now',
      screenTimeToday: 0,
      battery: 100,
      callRecordingEnabled: true,
      location: { lat: 40.7128, lng: -74.0060, address: "Network Location Estimated" }
    };
    setDevices(prev => [...prev, newDevice]);
    setSelectedDeviceId(newDevice.id);
    setIsProvisioning(false);
    setProvisionNumber('');
    addLog("ZERO_TOUCH_PROVISIONING_COMPLETE", 'success');
  };

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);

  const startLiveStream = async (source: 'camera' | 'screen' | 'ambient' = 'camera') => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      let stream: MediaStream;
      if (source === 'ambient') {
        stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        setAmbientTranscripts([]);
        setAmbientReport(null);
      } else if (source === 'camera') {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      }
      
      if (liveVideoRef.current && source !== 'ambient') {
        liveVideoRef.current.srcObject = stream;
      }
      liveStreamRef.current = stream;
      setStreamSource(source);
      setIsLiveStreaming(true);
      addLog(`ESTABLISHED_${source.toUpperCase()}_TUNNEL`, 'success');
    } catch (err) {
      console.error("Stream error:", err);
      alert("Relay error: Check hardware permissions.");
    }
  };

  const stopLiveStream = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach(track => track.stop());
      liveStreamRef.current = null;
    }
    setIsLiveStreaming(false);
  };

  const decryptChat = async (id: string) => {
    setIsDecrypting(id);
    addLog(`INIT_DECRYPT: CHANNEL_${id.toUpperCase()}`, 'info');
    await new Promise(r => setTimeout(r, 2000));
    setConversations(prev => prev.map(conv => conv.id === id ? { ...conv, isDecrypted: true } : conv));
    setIsDecrypting(null);
    addLog(`DECRYPT_SUCCESS: PACKET_STREAM_OPENED`, 'success');
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !selectedImage) return;
    setIsAsking(true);
    try {
      let result;
      if (selectedImage && imageMimeType) {
        result = await analyzeActivityScreenshot(selectedImage, imageMimeType, query);
      } else {
        result = await getParentingAdvice(query);
      }
      setAdvice(result);
      setHistory([{ id: Date.now().toString(), timestamp: Date.now(), query: query || "[Image Safety Audit]", type: selectedImage ? 'image' : 'text', response: result }, ...history]);
      setQuery('');
      setSelectedImage(null);
    } finally {
      setIsAsking(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex justify-between items-end">
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security Dashboard</h2>
                <div className="flex items-center space-x-3 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  <span>Active Surveillance Active</span>
                </div>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard label="Screen Time" value="6h 55m" icon="fa-clock" color="bg-slate-900" trend="+12%" />
              <StatCard label="App Blocks" value="14" icon="fa-shield" color="bg-indigo-600" trend="-4%" />
              <StatCard label="Safety Score" value="98%" icon="fa-heart" color="bg-green-600" />
              <StatCard label="Risk Flags" value={alerts.filter(a => a.severity === 'critical').length} icon="fa-bolt" color="bg-red-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 rounded-[3rem] overflow-hidden border border-slate-100 bg-white shadow-2xl p-2">
                <ActivityChart />
              </div>
              <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl flex flex-col h-full relative overflow-hidden min-h-[400px]">
                <div className="relative z-10">
                  <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xs border-b border-white/10 pb-6">Live Telemetry</h3>
                  <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar">
                    {detailedActivities.map(act => (
                      <div key={act.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5">
                        <div className="flex items-center space-x-5">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400"><i className={`fas ${act.icon}`}></i></div>
                          <div>
                            <p className="text-sm font-black text-white">{act.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase">{act.category}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-indigo-400">-{act.duration}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700 max-w-6xl mx-auto">
            <header className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-indigo-400 shadow-2xl">
                 <i className="fas fa-tower-broadcast text-3xl"></i>
               </div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Acoustic Protocol</h2>
               <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Surrounding Sound Interception</p>
            </header>

            {!isLiveStreaming ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                 <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100 flex flex-col justify-center space-y-8">
                    <div className="grid grid-cols-3 gap-4">
                       <button onClick={() => setStreamSource('camera')} className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center space-y-3 ${streamSource === 'camera' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}>
                          <i className="fas fa-camera text-2xl"></i>
                          <span className="text-[9px] font-black uppercase">Optic Link</span>
                       </button>
                       <button onClick={() => setStreamSource('screen')} className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center space-y-3 ${streamSource === 'screen' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}>
                          <i className="fas fa-desktop text-2xl"></i>
                          <span className="text-[9px] font-black uppercase">Display Mirror</span>
                       </button>
                       <button onClick={() => setStreamSource('ambient')} className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center space-y-3 ${streamSource === 'ambient' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-slate-50'}`}>
                          <i className="fas fa-microphone-lines text-2xl text-indigo-600"></i>
                          <span className="text-[9px] font-black uppercase">Ambient Mic</span>
                       </button>
                    </div>
                    <button onClick={() => startLiveStream(streamSource)} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-black transition-all">Establish Interception</button>
                 </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in duration-500">
                 {streamSource === 'ambient' ? (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 bg-slate-950 rounded-[4rem] p-12 shadow-2xl border-8 border-slate-900 relative overflow-hidden flex flex-col min-h-[650px]">
                         <div className="flex justify-between items-center mb-10 shrink-0">
                            <div className="flex items-center space-x-4">
                               <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                               <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Acoustic_Stream_Live</span>
                               <span className="text-[9px] bg-white/10 text-indigo-400 px-3 py-1 rounded-full font-black uppercase tracking-widest">Surrounding Intercept</span>
                            </div>
                            <button onClick={stopLiveStream} className="w-10 h-10 rounded-xl bg-white/5 text-white/40 hover:text-red-500 transition-colors flex items-center justify-center"><i className="fas fa-times text-xl"></i></button>
                         </div>

                         {/* Pulse Visualizer */}
                         <div className="flex-1 flex items-center justify-center relative">
                            <div className="absolute w-[400px] h-[400px] border border-indigo-500/10 rounded-full animate-[ping_4s_infinite]"></div>
                            <div className="absolute w-[300px] h-[300px] border border-indigo-500/20 rounded-full animate-[ping_3s_infinite]"></div>
                            <div className="absolute w-[200px] h-[200px] border border-indigo-500/30 rounded-full animate-[ping_2s_infinite]"></div>
                            
                            {/* Sonic Waveform */}
                            <div className="relative z-10 flex space-x-1.5 items-end h-40">
                               {[...Array(24)].map((_, i) => (
                                 <div key={i} className="w-2.5 bg-gradient-to-t from-indigo-600 to-violet-400 rounded-full animate-[bounce_1.2s_infinite] shadow-[0_0_20px_rgba(99,102,241,0.6)]" style={{animationDelay: `${i*0.05}s`, height: `${Math.random()*85 + 15}%`}}></div>
                               ))}
                            </div>

                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Stealth Audio Pickup</p>
                               <p className="text-[9px] font-mono text-white/30 uppercase">E2EE_RELAY_BYPASS_ACTIVE</p>
                            </div>
                         </div>

                         {/* Transcription Feed */}
                         <div className="mt-8 bg-black/40 rounded-[2.5rem] p-8 h-56 overflow-y-auto no-scrollbar border border-white/5 flex flex-col shadow-inner">
                            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Live Transcript</span>
                               <span className="text-[9px] font-mono text-indigo-500 animate-pulse">CAPTURING...</span>
                            </div>
                            {ambientTranscripts.length === 0 && <p className="text-center text-white/10 py-10 italic font-mono text-xs">NO AUDIO SIGNALS DETECTED...</p>}
                            <div className="space-y-4">
                              {ambientTranscripts.map(t => (
                                <div key={t.id} className="flex space-x-4 group animate-in slide-in-from-left-2">
                                   <span className="text-[9px] font-mono text-white/20 shrink-0">[{t.time}]</span>
                                   <div className="flex flex-col">
                                      <span className={`text-[9px] font-black uppercase tracking-tighter mb-0.5 ${t.speaker === 'Child' ? 'text-indigo-400' : 'text-amber-400'}`}>{t.speaker}</span>
                                      <p className="text-[12px] font-mono text-white/90 leading-tight">"{t.text}"</p>
                                   </div>
                                </div>
                              ))}
                              <div ref={transcriptEndRef} />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 transition-all hover:shadow-2xl">
                            <div className="flex items-center space-x-4 mb-8">
                               <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><i className="fas fa-microchip"></i></div>
                               <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800">Acoustic Intelligence</h3>
                            </div>
                            {!ambientReport ? (
                              <div className="text-center py-10 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                                 <i className="fas fa-brain text-slate-200 text-6xl mb-6"></i>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 px-6">Generate environment risk profile from transcript</p>
                                 <button 
                                  onClick={runAmbientAIAnalysis} 
                                  disabled={isAnalyzingAmbient || ambientTranscripts.length < 3}
                                  className="mx-auto w-[80%] bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-30 flex items-center justify-center space-x-3"
                                 >
                                    {isAnalyzingAmbient ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-fingerprint"></i>}
                                    <span>{isAnalyzingAmbient ? 'Analyzing Signal...' : 'Perform Audit'}</span>
                                 </button>
                              </div>
                            ) : (
                              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                                 <div className={`p-6 rounded-3xl flex items-center justify-between border-2 transition-colors ${ambientReport.threatLevel === 'High' ? 'bg-red-50 border-red-200 text-red-600' : ambientReport.threatLevel === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-green-50 border-green-200 text-green-600'}`}>
                                    <div className="flex flex-col">
                                       <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Threat Level</span>
                                       <span className="text-xl font-black uppercase tracking-tighter">{ambientReport.threatLevel}</span>
                                    </div>
                                    <i className={`fas ${ambientReport.threatLevel === 'High' ? 'fa-triangle-exclamation text-3xl' : 'fa-circle-check text-3xl'}`}></i>
                                 </div>
                                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Context</p>
                                    <p className="text-sm font-bold text-slate-900 leading-tight">{ambientReport.context}</p>
                                 </div>
                                 <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Interaction Summary</p>
                                    <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">"{ambientReport.summary}"</p>
                                 </div>
                                 <button onClick={() => setAmbientReport(null)} className="w-full text-slate-400 font-black text-[10px] uppercase hover:text-indigo-600 transition-colors">Start New Analysis</button>
                              </div>
                            )}
                         </div>

                         <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
                            <h3 className="font-black text-[11px] uppercase tracking-widest text-indigo-400 mb-8 relative z-10">Remote Intercept Controls</h3>
                            <div className="space-y-5 relative z-10">
                               {[
                                 { label: 'Gain Boost (Whisper Mode)', val: 'OFF', color: 'text-indigo-400' },
                                 { label: 'Background Cancellation', val: 'ACTIVE', color: 'text-green-400' },
                                 { label: 'Acoustic Directional Focus', val: 'AUTO', color: 'text-indigo-400' },
                                 { label: 'Voice ID Identification', val: 'ON', color: 'text-indigo-400' }
                               ].map(ctrl => (
                                 <div key={ctrl.label} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all">
                                    <span className="text-[9px] font-black uppercase text-white/50 tracking-widest">{ctrl.label}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${ctrl.color}`}>{ctrl.val}</span>
                                 </div>
                               ))}
                            </div>
                            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="bg-slate-950 rounded-[4rem] p-12 shadow-2xl border-8 border-slate-900 relative overflow-hidden group">
                      <video ref={liveVideoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale opacity-80 mix-blend-screen" />
                      <div className="mt-12 flex justify-center">
                         <button onClick={stopLiveStream} className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all shadow-xl hover:scale-105 active:scale-95"><i className="fas fa-phone-slash text-2xl"></i></button>
                      </div>
                   </div>
                 )}
              </div>
            )}
          </div>
        );

      case 'social':
        const filteredConversations = activeSocialPlatform === 'all' 
          ? conversations 
          : conversations.filter(c => c.platform === activeSocialPlatform);
        return (
          <div className="space-y-12 animate-in fade-in duration-700">
             <header className="flex justify-between items-end">
                <div>
                   <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Social Command Center</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Full Access Interception Active</p>
                </div>
                <div className="flex space-x-4 bg-white p-2 rounded-3xl shadow-xl border border-slate-100">
                   {['all', 'WhatsApp', 'Instagram', 'Discord', 'TikTok', 'Snapchat'].map(p => (
                     <button key={p} onClick={() => setActiveSocialPlatform(p)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${activeSocialPlatform === p ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}>{p}</button>
                   ))}
                </div>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 h-[750px]">
                <div className="lg:col-span-3 bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                   <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center"><h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800">Target Contacts</h3></div>
                   <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                      {filteredConversations.map(conv => (
                        <div key={conv.id} onClick={() => setSelectedConversation(conv)} className={`p-6 rounded-[2.5rem] cursor-pointer transition-all border-2 flex items-center justify-between ${selectedConversation?.id === conv.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-white border-transparent hover:border-slate-50'}`}>
                           <div className="flex items-center space-x-4 overflow-hidden">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${conv.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600 text-white' : conv.platform === 'WhatsApp' ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                 <i className={`fa-brands fa-${conv.platform.toLowerCase()}`}></i>
                              </div>
                              <div className="overflow-hidden">
                                 <p className="text-sm font-black truncate">{conv.contactName}</p>
                                 <p className="text-[10px] font-bold opacity-50 truncate">{conv.lastMessage}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="lg:col-span-6 bg-slate-50 rounded-[3.5rem] shadow-2xl border border-white relative flex flex-col overflow-hidden">
                   {selectedConversation ? (
                     <>
                        <div className="p-8 border-b border-slate-200 bg-white flex justify-between items-center">
                           <div className="flex items-center space-x-5">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400">{selectedConversation.contactName[0]}</div>
                              <h3 className="text-lg font-black text-slate-900 leading-none">{selectedConversation.contactName}</h3>
                           </div>
                           {!selectedConversation.isDecrypted && (
                             <button onClick={() => decryptChat(selectedConversation.id)} className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-[10px] hover:bg-black transition-all">
                                {isDecrypting === selectedConversation.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-unlock"></i>} Intercept
                             </button>
                           )}
                        </div>
                        <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-pattern">
                           {selectedConversation.isDecrypted && selectedConversation.messages.map(m => (
                             <div key={m.id} className={`flex ${m.isIncoming ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[75%] p-5 rounded-[2rem] shadow-sm ${m.isIncoming ? 'bg-white text-slate-800' : 'bg-indigo-600 text-white'} ${m.isDeleted ? 'bg-red-50 text-red-900 border-2 border-dashed border-red-200' : ''}`}>
                                   <p className="text-sm font-bold leading-relaxed">{m.content}</p>
                                   <p className="text-[8px] font-black uppercase mt-2 opacity-50">{m.timestamp}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </>
                   ) : (
                     <div className="h-full flex items-center justify-center opacity-20"><i className="fas fa-terminal text-9xl"></i></div>
                   )}
                </div>
                <div className="lg:col-span-3">
                   <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white h-full flex flex-col">
                      <h3 className="font-black text-[11px] uppercase tracking-widest text-indigo-400 mb-6">Sentinel Health</h3>
                      <div className="space-y-4 flex-1">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-slate-400 uppercase">Shadow Link Status</p>
                           <p className="text-lg font-black text-white mt-1">SYCHRONIZED</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[10px] font-black text-slate-400 uppercase">ISP Provider</p>
                           <p className="text-lg font-black text-white mt-1">Verizon (LTE)</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );

      case 'command':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-right-10 duration-700">
             <header className="flex justify-between items-end">
                <div>
                   <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Active Command</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Remote Override & Enforcement Console</p>
                </div>
             </header>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                   <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100">
                      <div className="flex items-center space-x-6 mb-8">
                         <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-inner"><i className="fas fa-satellite"></i></div>
                         <div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Zero-Touch Interception</h3>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Provision by Number • No Physical Access Required</p>
                         </div>
                      </div>
                      <div className="flex space-x-4">
                         <div className="flex-1 relative">
                            <i className="fas fa-phone absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"></i>
                            <input type="text" value={provisionNumber} onChange={(e) => setProvisionNumber(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-14 py-6 font-black outline-none focus:border-indigo-600 text-xl" />
                         </div>
                         <button onClick={startZTPProvisioning} disabled={isProvisioning || !provisionNumber} className="bg-slate-900 text-white px-10 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-black transition-all disabled:opacity-50">{isProvisioning ? 'Intercepting...' : 'Provision Link'}</button>
                      </div>
                      {isProvisioning && (
                        <div className="mt-8 space-y-4">
                           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 transition-all duration-500" style={{width: `${provisionProgress}%`}}></div>
                           </div>
                           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Establishing Network Tunnel...</p>
                        </div>
                      )}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-slate-900 p-10 rounded-[4rem] shadow-2xl text-white flex flex-col justify-between">
                         <div>
                            <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center text-white mb-6 shadow-2xl shadow-red-500/20"><i className="fas fa-skull-crossbones"></i></div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Shadow Lock</h3>
                            <p className="text-white/50 font-bold text-sm leading-relaxed mb-10">Stealthily restricts device and masks with a fake "System Update" screen.</p>
                         </div>
                         <button onClick={() => executeCommand('SHADOW_LOCK')} className="w-full bg-white text-slate-900 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-indigo-50">Initiate Shadow Mode</button>
                      </div>
                      <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-slate-100 flex flex-col justify-between">
                         <div>
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center text-2xl mb-6 shadow-inner"><i className="fas fa-wifi"></i></div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">ISP Sniffer</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed mb-6">Intercepts unencrypted network packets directly from the carrier relay node.</p>
                         </div>
                         <button onClick={() => executeCommand('ISP_SNIFF')} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-black">Analyze Packets</button>
                      </div>
                   </div>
                </div>
                <div className="lg:col-span-4 bg-black rounded-[4rem] p-10 shadow-2xl relative overflow-hidden flex flex-col border border-white/10">
                   <div className="relative z-10 flex flex-col h-full">
                      <h3 className="font-mono text-xs font-black text-indigo-400 uppercase tracking-widest mb-8">RELAY_COMMAND_LOG</h3>
                      <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-4 no-scrollbar">
                         {commandLog.map(log => (
                           <div key={log.id} className="flex space-x-3">
                              <span className="text-white/20 shrink-0">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                              <p className={`font-bold ${log.type === 'danger' ? 'text-red-500' : log.type === 'success' ? 'text-green-500' : 'text-indigo-400'}`}>{log.text}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
             </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-10 animate-in zoom-in-95 duration-700">
            <header className="flex justify-between items-end"><h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Geospatial Intelligence</h2></header>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
               <div className="lg:col-span-3 h-[650px] shadow-2xl overflow-hidden rounded-[3.5rem]"><TacticalMap devices={devices} selectedDeviceId={selectedDeviceId} /></div>
               <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col">
                  <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800 mb-6">Unit Inventory</h3>
                  <div className="flex-1 overflow-y-auto space-y-4">
                     {devices.map(d => (
                       <div key={d.id} onClick={() => setSelectedDeviceId(d.id)} className={`p-5 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${selectedDeviceId === d.id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-transparent'}`}>
                          <div className="flex items-center space-x-4">
                             <div className={`w-3 h-3 rounded-full ${d.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                             <p className="text-xs font-black text-slate-900">{d.name}</p>
                          </div>
                          <span className="text-[9px] font-black text-indigo-600">{d.battery}%</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <i className="fas fa-lock text-5xl mb-6 animate-pulse"></i>
            <h2 className="text-2xl font-black uppercase tracking-widest text-slate-800">Module Restrictred</h2>
            <button onClick={() => setActiveTab('dashboard')} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black shadow-2xl">Return</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-600">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/40 blur-[200px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-100/30 blur-[180px] rounded-full"></div>
      </div>
      <main className="pt-48 pb-40 px-12">
        <div className="max-w-[1400px] mx-auto">{renderContent()}</div>
      </main>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-6">
         <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/10 px-10 py-5 rounded-[3rem] shadow-2xl flex items-center space-x-12 ring-8 ring-white/10">
            <div className="flex items-center space-x-5">
              <div className="relative">
                 <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute opacity-50"></div>
                 <div className="w-4 h-4 bg-green-500 rounded-full relative z-10 border-2 border-slate-900"></div>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-none">Security System</p>
                <p className="text-xs font-black text-white uppercase mt-1 tracking-widest">Global Shield Active</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <button onClick={() => setIsAlertPanelOpen(!isAlertPanelOpen)} className="relative group transition-transform active:scale-90">
              <i className={`fas fa-bell text-2xl transition-colors ${alerts.some(a => !a.isRead) ? 'text-indigo-400' : 'text-white/40 group-hover:text-white'}`}></i>
              {alerts.some(a => !a.isRead) && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full border-2 border-slate-900 text-[10px] font-black flex items-center justify-center text-white shadow-xl">
                  {alerts.filter(a => !a.isRead).length}
                </span>
              )}
            </button>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex items-center space-x-6">
               <button className="text-white/40 hover:text-white transition-all"><i className="fas fa-sliders text-2xl"></i></button>
               <button className="text-white/40 hover:text-white transition-all"><i className="fas fa-fingerprint text-2xl"></i></button>
            </div>
         </div>
         <button onClick={() => { setIsLocking(true); executeCommand('GLOBAL_PANIC'); }} className="group relative w-20 h-20 bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-[2rem] shadow-2xl hover:scale-110 transition-all flex items-center justify-center ring-8 ring-white/10">
            <i className="fas fa-power-off text-3xl"></i>
            <span className="absolute bottom-full mb-8 bg-slate-900 text-white text-[11px] font-black px-8 py-4 rounded-3xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap uppercase tracking-widest pointer-events-none shadow-2xl">Full System Lockdown</span>
         </button>
      </div>

      {isAlertPanelOpen && (
        <>
          <div onClick={() => setIsAlertPanelOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] animate-in fade-in duration-500"></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[4rem] shadow-2xl border border-slate-100 z-[120] animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col max-h-[85vh]">
             <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-2xl text-slate-900 tracking-tighter uppercase leading-none">Intelligence Feed</h3>
                <button onClick={() => setIsAlertPanelOpen(false)} className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><i className="fas fa-times"></i></button>
             </div>
             <div className="flex-1 overflow-y-auto p-12 space-y-6 no-scrollbar">
                {alerts.map(a => (
                  <div key={a.id} onClick={() => markAlertRead(a.id)} className={`p-8 rounded-[3rem] transition-all cursor-pointer border-4 group ${a.isRead ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-xl'}`}>
                     <div className="flex items-start space-x-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${a.severity === 'critical' ? 'bg-red-600 text-white' : 'bg-indigo-600 text-white'}`}>
                           <i className={`fas ${a.severity === 'critical' ? 'fa-bolt' : 'fa-info'}`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-black text-slate-900 leading-none mb-2">{a.title}</h4>
                          <p className="text-base text-slate-500 font-bold leading-relaxed">{a.description}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes bounce { 0%, 100% { height: 20%; } 50% { height: 100%; } }
        .bg-pattern { background-image: radial-gradient(#6366f1 0.5px, transparent 0.5px); background-size: 24px 24px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
