import { useState } from 'react';
import { GLOSARIUM_WIRAUSAHA, KAMUS_UNGKAPAN } from '../../data/curriculumData';
import { X, Search, BookOpen, Sparkles } from 'lucide-react';
import { sound } from '../../utils/audio';

interface GlosariumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlosariumModal({ isOpen, onClose }: GlosariumModalProps) {
  const [keyword, setKeyword] = useState('');
  const [kategoriTab, setKategoriTab] = useState<'istilah' | 'kiasan'>('istilah');

  if (!isOpen) return null;

  const filteredIstilah = GLOSARIUM_WIRAUSAHA.filter(
    (item) =>
      item.istilah.toLowerCase().includes(keyword.toLowerCase()) ||
      item.arti.toLowerCase().includes(keyword.toLowerCase())
  );

  const filteredKiasan = KAMUS_UNGKAPAN.filter(
    (item) =>
      item.ungkapan.toLowerCase().includes(keyword.toLowerCase()) ||
      item.arti.toLowerCase().includes(keyword.toLowerCase()) ||
      item.contohKalimat.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Glosarium Istilah & Kamus Ungkapan
              </h3>
              <p className="text-xs text-slate-500">
                Bahasa Indonesia Kelas 5 - Bab IV: Belajar Berwirausaha
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Search Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setKategoriTab('istilah');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                kategoriTab === 'istilah'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Istilah Wirausaha ({GLOSARIUM_WIRAUSAHA.length})
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setKategoriTab('kiasan');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                kategoriTab === 'kiasan'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Ungkapan Kiasan ({KAMUS_UNGKAPAN.length})
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari kata, istilah, atau arti..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {kategoriTab === 'istilah' ? (
            filteredIstilah.length > 0 ? (
              <div className="space-y-2.5">
                {filteredIstilah.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-1"
                  >
                    <div className="text-sm font-bold text-emerald-800 font-display">
                      {item.istilah}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.arti}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-xs text-slate-400 py-8">
                Tidak ada istilah yang cocok dengan pencarian "{keyword}".
              </p>
            )
          ) : filteredKiasan.length > 0 ? (
            <div className="space-y-3">
              {filteredKiasan.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 font-display">
                      "{item.ungkapan}"
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 uppercase">
                      {item.kategori}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-emerald-800">Arti: {item.arti}</p>
                  <p className="text-[11px] text-slate-500 italic">
                    Contoh: "{item.contohKalimat}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-8">
              Tidak ada ungkapan yang cocok dengan pencarian "{keyword}".
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
