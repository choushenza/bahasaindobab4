import { ActiveTab } from '../types';
import { Volume2, VolumeX, BookOpen, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenGlosarium: () => void;
  onOpenPanduanGuru: () => void;
}

export default function Navbar({
  activeTab,
  onTabChange,
  onOpenGlosarium,
  onOpenPanduanGuru,
}: NavbarProps) {
  const [muted, setMuted] = useState(sound.getMuted());

  const toggleSound = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) {
      sound.playClick();
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => onTabChange('perencana')}
            className="flex items-center gap-2.5 text-left text-emerald-800 font-display font-extrabold text-xl tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
              5
            </div>
            <span>Wirausaha Cilik</span>
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => { sound.playClick(); onTabChange('perencana'); }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'perencana'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Perancang Usaha
            </button>

            <button
              onClick={() => { sound.playClick(); onTabChange('pemilah-game'); }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'pemilah-game'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Pemilah Denotasi & Konotasi
            </button>

            <button
              onClick={() => { sound.playClick(); onTabChange('tebak-makna'); }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'tebak-makna'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Kuis Ungkapan Kiasan
            </button>

            <button
              onClick={() => { sound.playClick(); onTabChange('pasangan-kata'); }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'pasangan-kata'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Pasangan Makna Kata
            </button>

            <button
              onClick={() => { sound.playClick(); onTabChange('simulasi-stan'); }}
              className={`whitespace-nowrap transition-colors py-1 ${
                activeTab === 'simulasi-stan'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Simulasi Stan Market Day
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleSound}
              title={muted ? 'Aktifkan Suara' : 'Bisukan Suara'}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle sound"
            >
              {muted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
            </button>

            <button
              onClick={() => { sound.playClick(); onOpenGlosarium(); }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Glosarium</span>
            </button>

            <button
              onClick={() => { sound.playClick(); onOpenPanduanGuru(); }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panduan Guru & LKPD</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar sub-navigation */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50 scrollbar-none">
        <button
          onClick={() => onTabChange('perencana')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'perencana' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          Perancang Usaha
        </button>
        <button
          onClick={() => onTabChange('pemilah-game')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'pemilah-game' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          Pemilah Denotasi
        </button>
        <button
          onClick={() => onTabChange('tebak-makna')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'tebak-makna' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          Kuis Ungkapan
        </button>
        <button
          onClick={() => onTabChange('pasangan-kata')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'pasangan-kata' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          Pasangan Kata
        </button>
        <button
          onClick={() => onTabChange('simulasi-stan')}
          className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeTab === 'simulasi-stan' ? 'bg-emerald-700 text-white' : 'text-slate-600'
          }`}
        >
          Simulasi Stan
        </button>
      </div>
    </header>
  );
}
