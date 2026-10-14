import { Sparkles, ShoppingBag, BrainCircuit, Store } from 'lucide-react';
import { ActiveTab } from '../types';
import { sound } from '../utils/audio';

interface HeroBannerProps {
  onSelectTab: (tab: ActiveTab) => void;
}

export default function HeroBanner({ onSelectTab }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & Editorial Kicker */}
          <div className="lg:col-span-7 space-y-4">
            {/* Clean unboxed metadata separator without pill chips */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="text-emerald-700 font-semibold">Bahasa Indonesia Kelas 5 SD</span>
              <span aria-hidden="true">·</span>
              <span>Bab IV: Belajar Berwirausaha</span>
              <span aria-hidden="true">·</span>
              <span>Kurikulum Merdeka</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
              Perancang Wirausaha Cilik & Pemilah Ragam Kata
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Panduan interaktif untuk merancang ide wirausaha kelompok, membagi tugas tim, menghitung modal & laba, mendesain poster promosi kreatif, serta menguasai perbedaan kalimat denotasi (makna sebenarnya) dan konotasi (kiasan).
            </p>

            {/* Quick interactive action buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTab('perencana');
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Rancang Proyek Kelompok</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTab('pemilah-game');
                }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4 text-emerald-700" />
                <span>Mainkan Pemilah Denotasi</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onSelectTab('simulasi-stan');
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-slate-500" />
                <span>Simulasi Stan</span>
              </button>
            </div>

            {/* Educational Objectives Footnote */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800 block">Gotong Royong</span>
                <span>Pembagian 5 peran tim wirausaha cilik</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">Kreativitas Promosi</span>
                <span>Desain poster & teks iklan persuasif</span>
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">Bernalar Kritis</span>
                <span>Membedakan denotasi & konotasi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Classroom Market Day Illustration */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md group">
              <img
                src="/src/assets/images/hero_wirausaha_cilik_1791948766547.jpg"
                alt="Siswa SD sedang menyelenggarakan kegiatan Market Day stan wirausaha cilik"
                className="w-full h-auto object-cover aspect-video sm:aspect-4/3 group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Digital Market Day Kelas 5</span>
                </div>
                <p className="text-xs text-slate-200 font-normal">
                  "Belajar jujur, kreatif, santun menyapa pembeli, dan terampil menghitung modal."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
