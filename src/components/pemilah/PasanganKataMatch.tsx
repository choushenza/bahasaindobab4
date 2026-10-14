import { useState } from 'react';
import { PASANGAN_KATA_DATA } from '../../data/curriculumData';
import { sound } from '../../utils/audio';
import { Sparkles, Check, ArrowRightLeft, Layers } from 'lucide-react';

export default function PasanganKataMatch() {
  const [selectedWordId, setSelectedWordId] = useState<string>(PASANGAN_KATA_DATA[0].id);

  const activePair = PASANGAN_KATA_DATA.find((p) => p.id === selectedWordId) || PASANGAN_KATA_DATA[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Studi Komparasi Makna Kata</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Perbandingan Berdampingan: Denotasi vs. Konotasi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Satu kata yang sama dapat memiliki makna yang sangat berbeda tergantung konteks kalimatnya.
          </p>
        </div>
      </div>

      {/* Word Selector Chips */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2.5">
          Pilih Kata untuk Dilihat Perbedaannya:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PASANGAN_KATA_DATA.map((pair) => (
            <button
              key={pair.id}
              onClick={() => {
                sound.playClick();
                setSelectedWordId(pair.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedWordId === pair.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pair.kataDasar}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Stage */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
        <div className="text-center pb-4 border-b border-slate-100">
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Fokus Kata Dasar
          </span>
          <h3 className="text-3xl font-display font-black text-slate-900 mt-1">
            "{activePair.kataDasar}"
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Denotasi (Sebenarnya) */}
          <div className="p-6 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md">
                🍏 Makna Denotasi
              </span>
              <span className="text-xs font-semibold text-emerald-700">Arti Sebenarnya</span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Contoh Kalimat:
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                "{activePair.denotasi.kalimat}"
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-200/60">
              <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1">
                Makna Harfiah (KBBI):
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activePair.denotasi.makna}
              </p>
            </div>
          </div>

          {/* Kolom Konotasi (Kiasan) */}
          <div className="p-6 rounded-2xl border-2 border-purple-300 bg-purple-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-md">
                🌺 Makna Konotasi
              </span>
              <span className="text-xs font-semibold text-purple-700">Arti Kiasan</span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Contoh Kalimat:
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs">
                "{activePair.konotasi.kalimat}"
              </p>
            </div>

            <div className="pt-2 border-t border-purple-200/60">
              <span className="block text-[11px] font-bold text-purple-800 uppercase tracking-wide mb-1">
                Makna Kiasan / Perumpamaan:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activePair.konotasi.makna}
              </p>
            </div>
          </div>
        </div>

        {/* Tip Belajar Cepat */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <span className="font-bold text-slate-900">Tips Mengingat Siswa Kelas 5:</span>{' '}
            Jika artinya bisa dibayangkan secara fisik nyata (seperti membasuh tangan dengan air sabun), itu{' '}
            <strong className="text-emerald-800">Denotasi</strong>. Jika artinya tidak bisa dimakan/dipegang secara fisik melainkan gambaran perasaan atau sifat (seperti lepas tanggung jawab), itu{' '}
            <strong className="text-purple-800">Konotasi</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
