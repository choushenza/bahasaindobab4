import { useState, useRef } from 'react';
import { PosterConfig } from '../../types';
import {
  Sparkles,
  Printer,
  Copy,
  Check,
  Palette,
  X,
  Download,
  ExternalLink,
  Layers,
  Frame,
  Smile,
  ShieldCheck,
  CheckCircle2,
  FileImage,
} from 'lucide-react';
import { sound } from '../../utils/audio';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

interface PosterStudioProps {
  poster: PosterConfig;
  namaUsaha: string;
  namaKelompok: string;
  hargaJual: number;
  onUpdatePoster: (updated: PosterConfig) => void;
}

const TEMPLATE_SLOGAN_REKOMENDASI = [
  'Segarnya Alami, Bikin Hati Berbunga-Bunga!',
  'Rasa Bintang Lima, Harga Ramah di Kantong Teman!',
  'Inovasi Karya Kami yang Jadi Buah Bibir di Sekolah!',
  'Manis Gurihnya Juara, Pas Menemani Istirahat!',
  'Karya Ramah Lingkungan untuk Sahabat Kutu Buku!',
  'Beli Sekali, Senyumnya Berkali-kali!',
  'Kecil Keren Penuh Manfaat, Buah Tangan Terbaik!',
  'Ikat Erat Tali Sahabat, Manis di Tangan Penuh Warna!',
];

const STIKER_PILIHAN = [
  '🌿 100% Alami',
  '⭐ Bintang Lima',
  '❤️ Buatan Sendiri',
  '🥤 Super Segar',
  '🎨 Daur Ulang',
  '✨ Promo Menarik',
  '🥣 Higienis & Bersih',
  '💰 Hemat Bersahabat',
  '🔥 Laris Manis',
  '🏆 Juara Kelas',
  '🥰 Tanpa Pengawet',
  '🍃 Ramah Lingkungan',
  '👌 Dijamin Enak',
  '🎉 Edisi Spesial',
  '👍 Rekomendasi Guru',
  '🥇 Karya Siswa',
];

const IKON_HERO_LIST = [
  '🍹', '🌽', '🧁', '🎨', '🔖', '🍓', '🎀', '🥐', '🪴', '🎯',
  '✨', '⭐', '🥗', '🍪', '🥤', '🎁', '🧸', '🥞', '🥪', '🧃'
];

export default function PosterStudio({
  poster,
  namaUsaha,
  namaKelompok,
  hargaJual,
  onUpdatePoster,
}: PosterStudioProps) {
  const [copied, setCopied] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [pngDownloadSuccess, setPngDownloadSuccess] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof PosterConfig>(field: K, value: PosterConfig[K]) => {
    onUpdatePoster({
      ...poster,
      [field]: value,
    });
  };

  const toggleStiker = (stikerItem: string) => {
    sound.playClick();
    const current = poster.stiker || [];
    if (current.includes(stikerItem)) {
      updateField('stiker', current.filter((s) => s !== stikerItem));
    } else {
      if (current.length >= 4) {
        updateField('stiker', [...current.slice(1), stikerItem]);
      } else {
        updateField('stiker', [...current, stikerItem]);
      }
    }
  };

  const handleCopyIklan = () => {
    sound.playCorrect();
    const teksIklan = `📢 PENGUMUMAN DIGITAL MARKET DAY KELAS 5!\n\n🎪 Kunjungi Stan Kami: ${poster.judul || namaUsaha}\n👥 Oleh: ${namaKelompok}\n\n🌟 "${poster.slogan}"\n\n📌 Lokasi: ${poster.lokasiStand || 'Bazar Sekolah'}\n🏷️ Harga: Rp ${hargaJual.toLocaleString('id-ID')}\n🎁 Promo: ${poster.promoDiskon || 'Tersedia Promo Menarik!'}\n\n"${poster.pesanPersuasif}"\n\nYuk mampir dan ramaikan stan kami ya teman-teman! 🎉`;

    navigator.clipboard.writeText(teksIklan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1. Direct PNG Download (Works 100% inside iframe preview without print restrictions)
  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    try {
      sound.playCoin();
      setIsExportingPng(true);
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.98,
        pixelRatio: 2.5, // Crisp high-res for printing
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `Poster-Market-Day-${(poster.judul || 'Stan').replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();

      setPngDownloadSuccess(true);
      sound.playFanfare();
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {}
      setTimeout(() => setPngDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PNG:', err);
    } finally {
      setIsExportingPng(false);
    }
  };

  // 2. Open in New Tab with Direct Auto-Print (Bypasses iframe sandbox)
  const handleOpenPrintNewTab = () => {
    sound.playClick();
    const posterElem = posterRef.current;
    if (!posterElem) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Brosur Market Day - ${poster.judul || namaUsaha}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              background: #f8fafc;
              margin: 0;
              padding: 24px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .poster-frame {
              width: 100%;
              max-width: 580px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .print-bar {
              margin-bottom: 20px;
              display: flex;
              gap: 12px;
            }
            .print-btn {
              background: #0f172a;
              color: white;
              padding: 10px 20px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 14px;
              border: none;
              cursor: pointer;
            }
            @media print {
              body { background: white; padding: 0; }
              .print-bar { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-bar">
            <button class="print-btn" onclick="window.print()">🖨️ Cetak ke Kertas / Simpan PDF</button>
          </div>
          <div class="poster-frame">
            ${posterElem.outerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 600);
            };
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  // 8 Theme Color Styling Configurations
  const themeStyles = {
    emerald: {
      headerBg: 'bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800',
      accentColor: 'text-emerald-700',
      badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      heroBg: 'bg-emerald-50 text-emerald-800',
    },
    amber: {
      headerBg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700',
      accentColor: 'text-amber-700',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      heroBg: 'bg-amber-50 text-amber-800',
    },
    blue: {
      headerBg: 'bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800',
      accentColor: 'text-sky-700',
      badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
      heroBg: 'bg-sky-50 text-sky-800',
    },
    rose: {
      headerBg: 'bg-gradient-to-br from-rose-600 via-rose-700 to-pink-800',
      accentColor: 'text-rose-700',
      badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
      heroBg: 'bg-rose-50 text-rose-800',
    },
    purple: {
      headerBg: 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900',
      accentColor: 'text-purple-700',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
      heroBg: 'bg-purple-50 text-purple-800',
    },
    sunset: {
      headerBg: 'bg-gradient-to-br from-orange-500 via-rose-600 to-purple-800',
      accentColor: 'text-orange-700',
      badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
      heroBg: 'bg-orange-50 text-orange-800',
    },
    warm: {
      headerBg: 'bg-gradient-to-br from-stone-700 via-amber-900 to-stone-900',
      accentColor: 'text-amber-800',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
      heroBg: 'bg-stone-100 text-stone-800',
    },
    mint: {
      headerBg: 'bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700',
      accentColor: 'text-teal-700',
      badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
      heroBg: 'bg-teal-50 text-teal-800',
    },
  };

  const currentTheme = themeStyles[poster.temaWarna] || themeStyles.emerald;
  const currentFrame = poster.gayaBingkai || 'modern';
  const currentHeroIcon = poster.ikonHero || '🍹';
  const currentPattern = poster.polaLatar || 'polos';

  // Frame styling classes
  const frameBorderClasses: Record<string, string> = {
    modern: 'border-4 border-slate-900 rounded-3xl',
    karnaval: 'border-8 border-amber-500 rounded-3xl ring-4 ring-slate-900',
    vintage: 'border-4 border-double border-stone-800 rounded-2xl',
    minimalis: 'border-2 border-slate-300 rounded-2xl shadow-sm',
    ceria: 'border-4 border-dashed border-rose-500 rounded-3xl shadow-xl',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Editor Controls: 6 Cols on Desktop */}
      <div className="no-print lg:col-span-6 space-y-6 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Palette className="w-4 h-4" />
            <span>Studio Desain Poster Promosi Canggih</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Kustomisasi Brosur & Format Cetak
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sesuaikan 8 pilihan warna, 5 gaya bingkai, pola latar, dan ikon utama produk untuk stan bazar kelompokmu.
          </p>
        </div>

        {/* 1. Pilihan 8 Tema Warna */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center justify-between">
            <span>1. Pilihan Warna Brosur (8 Tema)</span>
            <span className="text-[11px] text-slate-400 capitalize">{poster.temaWarna}</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'emerald', label: 'Segar Alami', color: 'bg-emerald-600' },
              { id: 'amber', label: 'Ceria Manis', color: 'bg-amber-500' },
              { id: 'blue', label: 'Langit Bersih', color: 'bg-sky-600' },
              { id: 'rose', label: 'Berry Cantik', color: 'bg-rose-600' },
              { id: 'purple', label: 'Kreatif Ungu', color: 'bg-purple-600' },
              { id: 'sunset', label: 'Senja Tropis', color: 'bg-orange-600' },
              { id: 'mint', label: 'Mint Sejuk', color: 'bg-teal-600' },
              { id: 'warm', label: 'Cokelat Hangat', color: 'bg-amber-900' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  sound.playClick();
                  updateField('temaWarna', theme.id as PosterConfig['temaWarna']);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  poster.temaWarna === theme.id
                    ? 'border-slate-800 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`w-3 h-3 rounded-full shrink-0 ${theme.color}`} />
                <span className="truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Pilihan Gaya Bingkai & Pola Latar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              2. Gaya Bingkai Brosur
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'modern', label: 'Modern' },
                { id: 'karnaval', label: 'Karnaval' },
                { id: 'vintage', label: 'Vintage' },
                { id: 'minimalis', label: 'Minimalis' },
                { id: 'ceria', label: 'Ceria Putus' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    updateField('gayaBingkai', b.id as PosterConfig['gayaBingkai']);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    currentFrame === b.id
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              3. Tekstur Latar Belakang
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'polos', label: 'Polos' },
                { id: 'bintik', label: 'Polka Bintik' },
                { id: 'garis', label: 'Garis Halus' },
                { id: 'gelombang', label: 'Ombak Ceria' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    updateField('polaLatar', p.id as PosterConfig['polaLatar']);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    currentPattern === p.id
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Pilihan Ikon Hero Utama Produk */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            4. Pilih Maskot / Ikon Utama Produk Stan:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {IKON_HERO_LIST.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => {
                  sound.playClick();
                  updateField('ikonHero', ic);
                }}
                className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center shrink-0 transition-transform cursor-pointer ${
                  currentHeroIcon === ic
                    ? 'border-emerald-600 bg-emerald-50 scale-110 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Teks Judul & Slogan */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Judul Produk / Nama Stan di Brosur
            </label>
            <input
              type="text"
              value={poster.judul}
              onChange={(e) => updateField('judul', e.target.value)}
              placeholder="Contoh: ES CINCAU PANDAN CERIA"
              className="w-full px-3.5 py-2 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Slogan Iklan Menarik (Bahasa Persuasif & Kiasan)
              </label>
              <span className="text-xs text-slate-500 font-normal">Klik untuk memilih:</span>
            </div>
            <input
              type="text"
              value={poster.slogan}
              onChange={(e) => updateField('slogan', e.target.value)}
              placeholder="Contoh: Segarnya Alami, Manisnya Bikin Hati Berbunga-bunga!"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
            />

            {/* Rekomendasi Slogan Cepat */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {TEMPLATE_SLOGAN_REKOMENDASI.map((sloganText, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    updateField('slogan', sloganText);
                  }}
                  className="text-[11px] text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 px-2.5 py-1 rounded-lg transition-colors text-left cursor-pointer"
                >
                  "{sloganText}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Lokasi & Penawaran Diskon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Lokasi Stan Market Day
            </label>
            <input
              type="text"
              value={poster.lokasiStand}
              onChange={(e) => updateField('lokasiStand', e.target.value)}
              placeholder="Stan No. 04 - Depan Aula Sekolah"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Penawaran Khusus / Diskon Promo
            </label>
            <input
              type="text"
              value={poster.promoDiskon}
              onChange={(e) => updateField('promoDiskon', e.target.value)}
              placeholder="Beli 2 Gratis 1 Stiker Lucu!"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-amber-900"
            />
          </div>
        </div>

        {/* 6. Isi Pesan Promosi Persuasif */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
            Kalimat Ajakan Promosi (Isi Pesan Brosur)
          </label>
          <textarea
            rows={2}
            value={poster.pesanPersuasif}
            onChange={(e) => updateField('pesanPersuasif', e.target.value)}
            placeholder="Dibuat dari bahan alami berkualitas, higienis, dan sehat untuk menemani harimu!"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* 7. Katalog 16 Stiker Pilihan */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
            <span>5. Pilih Lencana / Stiker Keunggulan (Maks. 4):</span>
            <span className="text-[11px] text-slate-500">{(poster.stiker || []).length}/4 dipilih</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {STIKER_PILIHAN.map((stiker) => {
              const selected = (poster.stiker || []).includes(stiker);
              return (
                <button
                  key={stiker}
                  onClick={() => toggleStiker(stiker)}
                  className={`px-2 py-1.5 rounded-xl text-[11px] font-medium text-left transition-colors border cursor-pointer ${
                    selected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {stiker}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar Aksi Cetak & Unduh */}
        <div className="pt-3 flex flex-wrap sm:flex-nowrap items-center gap-3 border-t border-slate-100">
          <button
            onClick={() => {
              sound.playClick();
              setIsPrintModalOpen(true);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak / Unduh PDF Brosur</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isExportingPng}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{isExportingPng ? 'Memproses Gambar...' : 'Unduh Gambar (PNG)'}</span>
          </button>
        </div>

        {pngDownloadSuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Gambar poster resolusi tinggi berhasil diunduh ke komputermu!</span>
          </div>
        )}
      </div>

      {/* Live Poster Canvas Preview: 6 Cols on Desktop */}
      <div className="lg:col-span-6 sticky top-24 space-y-3">
        <div className="no-print text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Pratinjau Brosur Stan Siap Cetak</span>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold cursor-pointer text-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Opsi Cetak & PDF</span>
          </button>
        </div>

        {/* The Printable Poster Card with Ref */}
        <div
          ref={posterRef}
          id="market-day-poster-card"
          className={`relative bg-white overflow-hidden shadow-2xl transition-all ${frameBorderClasses[currentFrame]}`}
        >
          {/* Top Banner Ribbon */}
          <div className={`${currentTheme.headerBg} px-6 pt-8 pb-8 text-white text-center relative overflow-hidden`}>
            {/* Background Texture Overlay */}
            {currentPattern === 'bintik' && (
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2.5px)',
                  backgroundSize: '16px 16px',
                }}
              />
            )}
            {currentPattern === 'garis' && (
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, transparent 2px, transparent 10px)',
                }}
              />
            )}
            {currentPattern === 'gelombang' && (
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(ellipse at top, #ffffff, transparent 70%)',
                }}
              />
            )}

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-extrabold tracking-widest uppercase mb-3 text-white border border-white/30 shadow-xs">
                <span>🎪 DIGITAL MARKET DAY KELAS 5</span>
              </div>

              {/* Large Product Hero Mascot / Icon */}
              <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center text-3xl shadow-inner">
                {currentHeroIcon}
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-tight uppercase text-balance drop-shadow-sm">
                {poster.judul || namaUsaha || 'NAMA PRODUK STAN'}
              </h3>

              <div className="mt-3 inline-block px-4 py-1.5 bg-black/30 rounded-xl border border-white/20 text-xs sm:text-sm font-semibold text-amber-200">
                "{poster.slogan || 'Segarnya Bikin Hati Berbunga-bunga!'}"
              </div>

              <div className="text-[11px] text-white/85 mt-2 font-medium">
                Karya Tim Kreatif: <span className="font-bold text-white underline">{namaKelompok}</span>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-6 sm:p-7 space-y-5 bg-slate-50">
            {/* Price & Promo Highlight Strip */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Harga Ramah Sahabat
                </span>
                <div className="flex items-baseline gap-1 text-slate-900">
                  <span className="text-sm font-semibold">Rp</span>
                  <span className="text-3xl font-display font-black text-emerald-700 tabular-nums">
                    {(hargaJual || 5000).toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-slate-500">/ porsi</span>
                </div>
              </div>

              {poster.promoDiskon && (
                <div className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold text-center sm:text-right">
                  <span className="block text-[10px] uppercase tracking-wider text-amber-700">Penawaran Spesial:</span>
                  {poster.promoDiskon}
                </div>
              )}
            </div>

            {/* Pesan Persuasif */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Mengapa Harus Membeli di Stan Kami?
              </span>
              <p className="font-medium text-slate-800">
                {poster.pesanPersuasif || 'Dibuat dengan bahan alami terbaik, higienis, dan sehat untuk menemani belajarmu!'}
              </p>
            </div>

            {/* Badges / Stickers */}
            {(poster.stiker || []).length > 0 && (
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                  Jaminan Mutu Produk Kami:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {poster.stiker.map((stiker, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-2xs"
                    >
                      {stiker}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Stan & Lokasi */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-800">📍 Lokasi:</span>
                <span>{poster.lokasiStand || 'Stan Bazar Sekolah'}</span>
              </div>
              <div className="font-bold text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Mari Belanja Santun!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT & PDF PREVIEW MODAL (Fixes PDF and Print in Preview Environment) */}
      {isPrintModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-6 my-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-800">
                <Printer className="w-5 h-5 text-emerald-700" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Cetak / Simpan Brosur Poster (PDF & Gambar)
                </h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clear explanation of why preview needs direct actions */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
              <p className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Solusi Cetak & Simpan PDF Langsung dari Preview:</span>
              </p>
              <p className="text-slate-700 leading-relaxed">
                Di dalam jendela preview peramban (sandboxed iframe), dialog cetak internal sering kali diblokir oleh keamanan browser. <strong>Tidak perlu build lokal!</strong> Anda bisa memilih 2 cara mudah di bawah ini yang langsung bekerja 100%:
              </p>
            </div>

            {/* 2 Primary Options */}
            <div className="space-y-3">
              {/* Option A: Buka di Tab Baru untuk PDF */}
              <button
                type="button"
                onClick={handleOpenPrintNewTab}
                className="w-full p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2.5 bg-emerald-700 text-white rounded-xl shadow-xs shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 flex items-center gap-2">
                    <span>1. Buka di Tab Baru (Cetak Kertas / Simpan PDF)</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-extrabold uppercase">
                      Direkomendasikan
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Membuka poster di tab baru di luar sandbox. Di sana Anda cukup memilih printer sekolah atau opsi <strong>"Save as PDF"</strong> untuk menyimpan berkas.
                  </p>
                </div>
              </button>

              {/* Option B: Unduh Gambar PNG */}
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isExportingPng}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white text-left transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="p-2.5 bg-slate-900 text-white rounded-xl shadow-xs shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                    2. Unduh Gambar Poster Resolusi Tinggi (PNG)
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Menyimpan poster langsung sebagai file gambar `.png` berkualitas cetak ke folder Unduhan komputermu.
                  </p>
                </div>
              </button>

              {/* Option C: Salin Teks Iklan */}
              <button
                type="button"
                onClick={handleCopyIklan}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Salin Naskah Pengumuman Iklan ke Clipboard</span>
                </span>
                {copied && <span className="text-emerald-700 font-bold">✓ Disalin!</span>}
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
