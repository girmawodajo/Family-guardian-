
import React, { useMemo } from 'react';
import { Device } from '../types';

interface TacticalMapProps {
  devices: Device[];
  selectedDeviceId?: string;
}

const TacticalMap: React.FC<TacticalMapProps> = ({ devices, selectedDeviceId }) => {
  // Simple coordinate projection to fit devices in a relative container
  const bounds = useMemo(() => {
    if (devices.length === 0) return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
    const lats = devices.map(d => d.location.lat);
    const lngs = devices.map(d => d.location.lng);
    
    // Add some padding (0.01 degree) to the bounds
    const padding = 0.02;
    return {
      minLat: Math.min(...lats) - padding,
      maxLat: Math.max(...lats) + padding,
      minLng: Math.min(...lngs) - padding,
      maxLng: Math.max(...lngs) + padding,
    };
  }, [devices]);

  const getPosition = (lat: number, lng: number) => {
    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;
    
    // Convert to percentage (note: lat is top-down on screen)
    const x = ((lng - bounds.minLng) / lngRange) * 100;
    const y = (1 - (lat - bounds.minLat) / latRange) * 100;
    
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="relative w-full h-full bg-[#0a0f18] overflow-hidden rounded-[2.5rem] border-4 border-slate-900 shadow-inner">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #312e81 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      
      {/* Scanning Line Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-20 w-full animate-[scan_4s_linear_infinite] pointer-events-none"></div>

      {/* Markers */}
      {devices.map((device) => {
        const pos = getPosition(device.location.lat, device.location.lng);
        const isSelected = selectedDeviceId === device.id;
        
        return (
          <div 
            key={device.id}
            className="absolute transition-all duration-1000 ease-out z-20 group"
            style={pos}
          >
            {/* Range Indicator Circle */}
            <div className={`absolute -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed transition-all duration-500 ${device.status === 'online' ? 'border-indigo-500/20 animate-[spin_20s_linear_infinite]' : 'border-slate-700/10'}`}></div>
            
            {/* The Marker */}
            <div className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer">
              {/* Pulsing rings for online devices */}
              {device.status === 'online' && (
                <>
                  <div className="absolute inset-0 w-full h-full bg-indigo-500 rounded-full animate-ping opacity-40"></div>
                  <div className="absolute inset-0 w-full h-full bg-indigo-500 rounded-full animate-pulse opacity-20 scale-150"></div>
                </>
              )}
              
              {/* Main Core */}
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all border-2 ${
                device.status === 'online' 
                  ? 'bg-indigo-600 border-white shadow-indigo-500/50 scale-110' 
                  : 'bg-slate-700 border-slate-600 grayscale'
              } group-hover:scale-125`}>
                <i className={`fas ${device.type === 'MOBILE' ? 'fa-mobile-screen' : 'fa-tablet-screen-button'} text-xs`}></i>
              </div>

              {/* Tag / Data UI */}
              <div className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl transition-all ${isSelected ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0'} z-30`}>
                <div className="flex items-center space-x-3 whitespace-nowrap">
                   <div className="text-left">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{device.name}</p>
                      <p className="text-xs font-black text-white">{device.location.address}</p>
                      <div className="flex items-center space-x-2 mt-1">
                         <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                         <span className="text-[9px] font-black text-slate-400 uppercase">LAT: {device.location.lat.toFixed(4)}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase">BAT: {device.battery}%</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Map Compass Decor */}
      <div className="absolute bottom-10 left-10 w-24 h-24 border-2 border-white/5 rounded-full flex items-center justify-center opacity-40 pointer-events-none">
        <div className="w-px h-full bg-white/10 absolute left-1/2 -translate-x-1/2"></div>
        <div className="h-px w-full bg-white/10 absolute top-1/2 -translate-y-1/2"></div>
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/40">N</span>
      </div>
      
      <style>{`
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(500%); }
        }
      `}</style>
    </div>
  );
};

export default TacticalMap;
