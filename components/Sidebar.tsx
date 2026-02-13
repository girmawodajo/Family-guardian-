
import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Safety' },
    { id: 'location', icon: 'fa-location-dot', label: 'Geospatial' },
    { id: 'activity', icon: 'fa-file-lines', label: 'Activity' },
    { id: 'calls', icon: 'fa-phone-volume', label: 'Calls' },
    { id: 'social', icon: 'fa-users-viewfinder', label: 'Social' },
    { id: 'apps', icon: 'fa-cubes', label: 'Apps' },
    { id: 'monitoring', icon: 'fa-desktop', label: 'Live' },
    { id: 'command', icon: 'fa-crosshairs', label: 'Command' },
    { id: 'files', icon: 'fa-folder-open', label: 'Files' },
    { id: 'rules', icon: 'fa-shield-halved', label: 'Rules' },
    { id: 'ai-assistant', icon: 'fa-robot', label: 'Guardian AI' },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
      <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] px-8 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 shrink-0 mr-8">
          <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200/50">
            <i className="fas fa-shield-heart text-xl"></i>
          </div>
          <div className="hidden xl:block">
            <h1 className="text-sm font-black text-slate-800 tracking-tighter uppercase leading-none">
              Guardian<span className="text-indigo-600">Path</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Safety</p>
          </div>
        </div>

        {/* Horizontal Navigation Items */}
        <div className="flex-1 flex items-center justify-center space-x-1 overflow-x-auto no-scrollbar scroll-smooth px-4 py-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap group relative ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 translate-y-[-2px]'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <i className={`fas ${item.icon} text-sm transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-125 group-hover:text-indigo-600'}`}></i>
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 bg-indigo-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Profile / System Health */}
        <div className="hidden lg:flex items-center space-x-4 ml-8 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-800 uppercase leading-none">Admin Console</p>
            <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest mt-1 flex items-center justify-end">
              <span className="w-1 h-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Live Sync
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-slate-100 p-0.5">
            <img src="https://picsum.photos/seed/parent/80/80" alt="Sarah" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
