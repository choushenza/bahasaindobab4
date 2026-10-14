import { X, Sparkles, CheckCircle2, Award, Printer, BookOpen } from 'lucide-react';
import { sound } from '../../utils/audio';

interface PanduanGuruModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PanduanGuruModal({ isOpen, onClose }: PanduanGuruModalProps) {
  if (!isOpen) return null;

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">
                Panduan Guru & Modul Ajar Kurikulum Merdeka
              </h3>
              <p className="text-xs text-emerald-200">
                Bahasa Indonesia Kelas 5 Fase C · Bab IV: Belajar Berwirausaha
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed flex-1">
          {/* Capaian & Tujuan Pembelajaran */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Tujuan Pembelajaran (TP)</span>
            </h4>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <p>
                1. <strong>Menganalisis Ragam Makna Kata:</strong> Peserta didik mampu membedakan makna denotasi (sebenarnya) dan makna konotasi (kiasan) dalam teks bertema wirausaha dan percakapan sehari-hari.
              </p>
              <p>
                2. <strong>Merancang Teks Iklan Persuasif:</strong> Peserta didik terampil menyusun slogan dan brosur promosi yang memuat kalimat persuasif yang santun dan memikat.
              </p>
              <p>
                3. <strong>Praktik Berwirausaha Kolaboratif:</strong> Peserta didik mampu bekerja sama dalam kelompok membagi peran wirausaha cilik serta mensimulasikan transaksi jual beli dengan jujur dan bertanggung jawab.
              </p>
            </div>
          </div>

          {/* Profil Pelajar Pancasila */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-emerald-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Dimensi Profil Pelajar Pancasila</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">1. Gotong Royong</span>
                <span className="text-xs text-slate-600">
                  Bekerja sama membagi 5 tugas tim wirausaha cilik tanpa membedakan teman.
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">2. Bernalar Kritis</span>
                <span className="text-xs text-slate-600">
                  Membedakan makna harfiah dan kiasan serta menghitung anggaran modal dan laba.
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">3. Kreatif</span>
                <span className="text-xs text-slate-600">
                  Menciptakan slogan iklan memikat, inovasi produk stan, dan brosur visual.
                </span>
              </div>
            </div>
          </div>

          {/* Skenario 2 Pertemuan di Kelas */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-emerald-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Skenario Pelaksanaan di Kelas (Model PjBL)</span>
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1">
                  Pertemuan 1: Eksplorasi Makna Kata & Perancangan Proyek Kelompok
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li>Siswa bermain <em>Permainan Pemilah Denotasi vs. Konotasi</em> secara individu/berpasangan.</li>
                  <li>Guru membagi siswa ke dalam kelompok kerja (4-5 siswa).</li>
                  <li>Siswa berdiskusi menentukan ide usaha, mengisi pembagian tugas, dan menghitung modal pada menu <em>Perancang Usaha</em>.</li>
                  <li>Siswa mencetak atau menyimpan Lembar Kerja Peserta Didik (LKPD).</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">
                  Pertemuan 2: Studio Desain Brosur Promosi & Simulasi Market Day
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li>Setiap kelompok mendesain poster promosi di <em>Studio Poster</em> menggunakan kalimat persuasif.</li>
                  <li>Siswa melakukan uji coba di menu <em>Simulasi Stan Market Day</em> (menghitung uang kembalian dan sapaan ramah).</li>
                  <li>Presentasi stan kelompok di depan kelas atau pelaksanaan Bazar Market Day sekolah.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Rubrik Penilaian Sederhana */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-base text-emerald-900">
              Rubrik Penilaian Asesmen Otentik
            </h4>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-2.5">Aspek Penilaian</th>
                    <th className="p-2.5">Sangat Baik (4)</th>
                    <th className="p-2.5">Baik (3)</th>
                    <th className="p-2.5">Cukup (2)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Pemahaman Denotasi & Konotasi</td>
                    <td className="p-2.5">Mampu membedakan seluruh kalimat dengan tepat dan menjelaskan maknanya.</td>
                    <td className="p-2.5">Membedakan sebagian besar makna kata dengan tepat.</td>
                    <td className="p-2.5">Membutuhkan bimbingan membedakan makna kiasan.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Bahasa Iklan & Brosur</td>
                    <td className="p-2.5">Slogan sangat kreatif, kalimat persuasif santun dan memikat pembeli.</td>
                    <td className="p-2.5">Bahasa iklan jelas dan memuat informasi harga serta lokasi.</td>
                    <td className="p-2.5">Bahasa iklan masih terlalu sederhana.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-slate-900">Kerja Sama & Tanggung Jawab</td>
                    <td className="p-2.5">Semua peran (5 tugas) aktif berkontribusi dengan penuh inisiatif.</td>
                    <td className="p-2.5">Tugas terbagi dengan baik dan selesai tepat waktu.</td>
                    <td className="p-2.5">Perlu dorongan guru dalam menyelesaikan tugas peran.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Modul Ajar</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
