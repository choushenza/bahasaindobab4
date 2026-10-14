import { useState } from 'react';
import { ActiveTab, ProyekWirausaha } from './types';
import { TEMPLATE_PROYEK_DEFAULT } from './data/curriculumData';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import MarketDayPlanner from './components/wirausaha/MarketDayPlanner';
import MarketSimulation from './components/wirausaha/MarketSimulation';
import DenotasiKonotasiGame from './components/pemilah/DenotasiKonotasiGame';
import TebakMaknaQuiz from './components/pemilah/TebakMaknaQuiz';
import PasanganKataMatch from './components/pemilah/PasanganKataMatch';
import GlosariumModal from './components/glosarium/GlosariumModal';
import PanduanGuruModal from './components/guru/PanduanGuruModal';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('perencana');
  const [proyek, setProyek] = useState<ProyekWirausaha>(TEMPLATE_PROYEK_DEFAULT);
  const [isGlosariumOpen, setIsGlosariumOpen] = useState(false);
  const [isPanduanGuruOpen, setIsPanduanGuruOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGlosarium={() => setIsGlosariumOpen(true)}
        onOpenPanduanGuru={() => setIsPanduanGuruOpen(true)}
      />

      {/* Hero Section Banner */}
      <div className="no-print">
        <HeroBanner onSelectTab={(tab) => setActiveTab(tab)} />
      </div>

      {/* Main Learning Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'perencana' && (
          <MarketDayPlanner
            proyek={proyek}
            onUpdateProyek={setProyek}
            onOpenSimulasi={() => setActiveTab('simulasi-stan')}
          />
        )}

        {activeTab === 'pemilah-game' && <DenotasiKonotasiGame />}

        {activeTab === 'tebak-makna' && <TebakMaknaQuiz />}

        {activeTab === 'pasangan-kata' && <PasanganKataMatch />}

        {activeTab === 'simulasi-stan' && (
          <MarketSimulation
            proyek={proyek}
            onKembaliKePerencana={() => setActiveTab('perencana')}
          />
        )}
      </main>

      {/* Modals */}
      <GlosariumModal
        isOpen={isGlosariumOpen}
        onClose={() => setIsGlosariumOpen(false)}
      />

      <PanduanGuruModal
        isOpen={isPanduanGuruOpen}
        onClose={() => setIsPanduanGuruOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Bahasa Indonesia Kelas 5 SD</span>
            <span aria-hidden="true">·</span>
            <span>Bab IV: Belajar Berwirausaha</span>
            <span aria-hidden="true">·</span>
            <span>Kurikulum Merdeka</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGlosariumOpen(true)}
              className="hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              Kamus Istilah & Ungkapan
            </button>
            <button
              onClick={() => setIsPanduanGuruOpen(true)}
              className="hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              Panduan Guru & Modul Ajar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
