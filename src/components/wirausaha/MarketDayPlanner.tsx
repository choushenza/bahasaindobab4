import { useState } from 'react';
import { ProyekWirausaha, AnggaranItem } from '../../types';
import { CONTOH_IDE_USAHA } from '../../data/curriculumData';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import PosterStudio from './PosterStudio';
import PrintableLKPD from './PrintableLKPD';
import {
  Users,
  Calculator,
  Palette,
  FileText,
  Lightbulb,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Coins,
  ArrowRight,
  Store,
  Sparkles,
  Dice5,
  ShoppingBag,
  Award,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface MarketDayPlannerProps {
  proyek: ProyekWirausaha;
  onUpdateProyek: (proyek: ProyekWirausaha) => void;
  onOpenSimulasi: () => void;
}

// Preset katalog bahan cepat untuk mempermudah siswa SD
const KATALOG_BAHAN_CEPAT = [
  { nama: 'Daun Cincau Segar', jumlah: 2, satuan: 'ikat', hargaSatuan: 5000, icon: '🌿' },
  { nama: 'Susu UHT Segar', jumlah: 2, satuan: 'liter', hargaSatuan: 16000, icon: '🥛' },
  { nama: 'Gula Aren Asli', jumlah: 1, satuan: 'kg', hargaSatuan: 14000, icon: '🍯' },
  { nama: 'Paper Cup & Sedotan Kertas', jumlah: 20, satuan: 'buah', hargaSatuan: 600, icon: '🥤' },
  { nama: 'Jagung Manis Pipil', jumlah: 2, satuan: 'kg', hargaSatuan: 12000, icon: '🌽' },
  { nama: 'Keju Cheddar Parut', jumlah: 1, satuan: 'kotak', hargaSatuan: 13000, icon: '🧀' },
  { nama: 'Kertas Lipat Origami', jumlah: 2, satuan: 'pak', hargaSatuan: 8000, icon: '📑' },
  { nama: 'Pita Hias & Plastik Souvenir', jumlah: 20, satuan: 'lembar', hargaSatuan: 400, icon: '🎀' },
];

const AVATAR_LIST = ['👧', '👦', '🧒', '🧑‍🍳', '🧑‍🎨', '🧑‍💼', '👑', '👓'];

const SLOGAN_BANK = [
  'Segarnya Alami, Manisnya Bikin Hati Berbunga-bunga!',
  'Rasa Bintang Lima, Harga Ramah di Kantong Teman!',
  'Karya Kreatif Kami yang Siap Jadi Buah Bibir Sekolah!',
  'Manis Gurihnya Juara, Pas Menemani Istirahat!',
  'Karya Ramah Lingkungan untuk Sahabat Kutu Buku!',
  'Belanja Jujur, Senyum Ceria, Kantong Bahagia!',
  'Inovasi Rasa Tiada Dua, Nikmatnya Nyata!',
];

export default function MarketDayPlanner({
  proyek,
  onUpdateProyek,
  onOpenSimulasi,
}: MarketDayPlannerProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedKategoriFilter, setSelectedKategoriFilter] = useState<string>('Semua');
  const [namaBahanBaru, setNamaBahanBaru] = useState('');
  const [jumlahBaru, setJumlahBaru] = useState(1);
  const [satuanBaru, setSatuanBaru] = useState('buah');
  const [hargaBaru, setHargaBaru] = useState(5000);

  // Interactive Checklist Persiapan Peran
  const [roleChecklist, setRoleChecklist] = useState<Record<string, boolean>>({
    'ketua-1': true,
    'ketua-2': false,
    'produksi-1': true,
    'produksi-2': false,
    'keuangan-1': true,
    'keuangan-2': false,
    'desain-1': false,
    'desain-2': false,
    'penjualan-1': false,
    'penjualan-2': false,
  });

  // Calculations
  const totalModal = proyek.bahanAnggaran.reduce(
    (acc, item) => acc + item.jumlah * item.hargaSatuan,
    0
  );
  const estimasiPorsi = Math.max(proyek.estimasiPorsi || 1, 1);
  const modalPerPorsi = Math.round(totalModal / estimasiPorsi);
  const targetHargaJual = proyek.targetHargaJual || 0;
  const labaPerPorsi = targetHargaJual - modalPerPorsi;
  const totalPotensiPendapatan = targetHargaJual * estimasiPorsi;
  const totalPotensiLaba = totalPotensiPendapatan - totalModal;
  const breakEvenPorsi = modalPerPorsi > 0 ? Math.ceil(totalModal / targetHargaJual) : 0;

  // Stand Readiness Calculation (0 - 100%)
  const hasValidIdea = proyek.namaUsaha.trim().length > 2 && proyek.deskripsiProduk.trim().length > 5;
  const hasFullTeam = proyek.anggota.every((a) => a.namaSiswa.trim().length > 1);
  const hasBudget = proyek.bahanAnggaran.length >= 2 && targetHargaJual > modalPerPorsi;
  const hasPoster = proyek.poster.judul.trim().length > 2 && proyek.poster.slogan.trim().length > 3;

  const readinessScore =
    (hasValidIdea ? 25 : 0) +
    (hasFullTeam ? 25 : 0) +
    (hasBudget ? 25 : 0) +
    (hasPoster ? 25 : 0);

  const updateField = <K extends keyof ProyekWirausaha>(
    field: K,
    value: ProyekWirausaha[K]
  ) => {
    onUpdateProyek({
      ...proyek,
      [field]: value,
    });
  };

  const handlePilihIdeCepat = (contoh: typeof CONTOH_IDE_USAHA[0]) => {
    sound.playCorrect();
    onUpdateProyek({
      ...proyek,
      namaUsaha: contoh.namaUsaha,
      kategori: contoh.kategori,
      deskripsiProduk: contoh.deskripsi,
      targetHargaJual: contoh.hargaRekomendasi,
      estimasiPorsi: contoh.targetPorsi,
      poster: {
        ...proyek.poster,
        judul: contoh.namaUsaha.toUpperCase(),
        slogan: contoh.sloganRekomendasi,
        hargaJual: contoh.hargaRekomendasi,
      },
    });
  };

  const handleAcakSlogan = () => {
    sound.playClick();
    const acak = SLOGAN_BANK[Math.floor(Math.random() * SLOGAN_BANK.length)];
    updateField('poster', {
      ...proyek.poster,
      slogan: acak,
    });
  };

  const handleUpdateNamaAnggota = (index: number, nama: string) => {
    const updatedAnggota = [...proyek.anggota];
    updatedAnggota[index] = {
      ...updatedAnggota[index],
      namaSiswa: nama,
    };
    updateField('anggota', updatedAnggota);
  };

  const handleUpdateAvatarAnggota = (index: number, avatar: string) => {
    sound.playClick();
    const updatedAnggota = [...proyek.anggota];
    updatedAnggota[index] = {
      ...updatedAnggota[index],
      icon: avatar,
    };
    updateField('anggota', updatedAnggota);
  };

  const handleToggleChecklist = (checkKey: string) => {
    sound.playClick();
    setRoleChecklist((prev) => ({
      ...prev,
      [checkKey]: !prev[checkKey],
    }));
  };

  const handleTambahBahanKatalog = (katalogItem: typeof KATALOG_BAHAN_CEPAT[0]) => {
    sound.playCoin();
    const item: AnggaranItem = {
      id: `b-${Date.now()}-${Math.random()}`,
      nama: katalogItem.nama,
      jumlah: katalogItem.jumlah,
      satuan: katalogItem.satuan,
      hargaSatuan: katalogItem.hargaSatuan,
    };
    updateField('bahanAnggaran', [...proyek.bahanAnggaran, item]);
  };

  const handleTambahBahan = () => {
    if (!namaBahanBaru.trim()) return;
    sound.playCoin();
    const item: AnggaranItem = {
      id: `b-${Date.now()}`,
      nama: namaBahanBaru.trim(),
      jumlah: Number(jumlahBaru) || 1,
      satuan: satuanBaru.trim() || 'buah',
      hargaSatuan: Number(hargaBaru) || 0,
    };
    updateField('bahanAnggaran', [...proyek.bahanAnggaran, item]);
    setNamaBahanBaru('');
    setJumlahBaru(1);
    setHargaBaru(5000);
  };

  const handleStepQty = (id: string, delta: number) => {
    sound.playClick();
    const updated = proyek.bahanAnggaran.map((b) => {
      if (b.id === id) {
        const nextQty = Math.max(1, b.jumlah + delta);
        return { ...b, jumlah: nextQty };
      }
      return b;
    });
    updateField('bahanAnggaran', updated);
  };

  const handleHapusBahan = (id: string) => {
    sound.playClick();
    updateField(
      'bahanAnggaran',
      proyek.bahanAnggaran.filter((b) => b.id !== id)
    );
  };

  return (
    <div className="space-y-8">
      {/* Stand Readiness Bar (Interactive Progress HUD) */}
      <div className="no-print bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white font-bold text-xs ${
              readinessScore === 100 ? 'bg-amber-500 animate-bounce' : 'bg-emerald-700'
            }`}>
              🎪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Indikator Kesiapan Stan Market Day
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  readinessScore === 100 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {readinessScore}% Siap
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {readinessScore === 100
                  ? '🌟 Luar biasa! Stan wirausaha kelompokmu sudah 100% siap membuka penjualan!'
                  : 'Selesaikan setiap langkah untuk memastikan stan kelompokmu siap berjualan dengan sukses.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {readinessScore === 100 && (
              <button
                onClick={() => {
                  sound.playFanfare();
                  try {
                    confetti({ particleCount: 70, spread: 60 });
                  } catch {}
                  onOpenSimulasi();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buka Stan Sekarang!</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              readinessScore === 100 ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${readinessScore}%` }}
          />
        </div>

        {/* 4 Readiness Check Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className={`flex items-center gap-1.5 ${hasValidIdea ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Ide Produk</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasFullTeam ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2. Tim 5 Peran</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasBudget ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Modal & Laba</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasPoster ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>4. Brosur Poster</span>
          </div>
        </div>
      </div>

      {/* Step Progress Bar Header */}
      <div className="no-print bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { step: 1, label: '1. Ide Usaha', icon: Lightbulb },
            { step: 2, label: '2. Tugas Kelompok', icon: Users },
            { step: 3, label: '3. Modal & Laba', icon: Calculator },
            { step: 4, label: '4. Studio Poster', icon: Palette },
            { step: 5, label: '5. Lembar LKPD', icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeStep === item.step;
            const isDone = activeStep > item.step;
            return (
              <button
                key={item.step}
                onClick={() => {
                  sound.playClick();
                  setActiveStep(item.step);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: IDE USAHA & KONSEP INTERAKTIF */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Langkah 1: Perencanaan Konsep Usaha
              </span>
              <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
                Menentukan Ide Wirausaha Cilik & Identitas Stan
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Pilihlah ide usaha inspiratif di bawah ini atau buat ide kreasimu sendiri secara interaktif.
              </p>
            </div>

            {/* Filter Kategori Interaktif */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Pilih Kategori Inspirasi:
                </span>
                <span className="text-xs text-slate-400">Klik kartu untuk mengisi otomatis</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  'Semua',
                  'Minuman Segar Sehat',
                  'Makanan Ringan Sehat',
                  'Kerajinan Tangan Daur Ulang',
                  'Alat Tulis & Kreasi Kertas',
                  'Makanan Penutup / Dessert Sehat',
                  'Aksesori & Souvenir Cilik',
                  'Aneka Roti & Pastry Cilik',
                  'Olahan Buah & Salad Segar',
                  'Jasa & Permainan Edukatif',
                  'Tanaman Hias & Bibit Hijau',
                ].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => {
                      sound.playClick();
                      setSelectedKategoriFilter(kat);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedKategoriFilter === kat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Ide Usaha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {CONTOH_IDE_USAHA.filter((i) =>
                selectedKategoriFilter === 'Semua' ? true : i.kategori === selectedKategoriFilter
              ).map((ide, idx) => {
                const isSelected = proyek.namaUsaha === ide.namaUsaha;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePilihIdeCepat(ide)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 text-xs bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Dipilih
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      {ide.kategori}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">
                      {ide.namaUsaha}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ide.deskripsi}
                    </p>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                      <span className="text-emerald-800 font-display font-bold">
                        Rp {ide.hargaRekomendasi.toLocaleString('id-ID')}
                      </span>
                      <span className="text-slate-500 font-normal">
                        Target {ide.targetPorsi} porsi
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Form Detail Input Identitas Proyek */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Kelompok Siswa
                </label>
                <input
                  type="text"
                  value={proyek.namaKelompok}
                  onChange={(e) => updateField('namaKelompok', e.target.value)}
                  placeholder="Contoh: Kelompok Bintang Ceria"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Kelas & Sekolah
                </label>
                <input
                  type="text"
                  value={proyek.kelas}
                  onChange={(e) => updateField('kelas', e.target.value)}
                  placeholder="Contoh: Kelas 5A SDN 01 Harapan"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Stan / Produk Usaha
                </label>
                <input
                  type="text"
                  value={proyek.namaUsaha}
                  onChange={(e) => {
                    updateField('namaUsaha', e.target.value);
                    updateField('poster', { ...proyek.poster, judul: e.target.value.toUpperCase() });
                  }}
                  placeholder="Contoh: Es Cincau Pandan Ceria"
                  className="w-full px-3.5 py-2.5 text-sm font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Kategori Usaha
                </label>
                <select
                  value={proyek.kategori}
                  onChange={(e) => updateField('kategori', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Minuman Segar Sehat">Minuman Segar Sehat</option>
                  <option value="Makanan Ringan Sehat">Makanan Ringan Sehat</option>
                  <option value="Kerajinan Tangan Daur Ulang">Kerajinan Tangan Daur Ulang</option>
                  <option value="Alat Tulis & Kreasi Kertas">Alat Tulis & Kreasi Kertas</option>
                  <option value="Makanan Penutup / Dessert Sehat">Makanan Penutup / Dessert Sehat</option>
                  <option value="Aksesori & Souvenir Cilik">Aksesori & Souvenir Cilik</option>
                  <option value="Aneka Roti & Pastry Cilik">Aneka Roti & Pastry Cilik</option>
                  <option value="Olahan Buah & Salad Segar">Olahan Buah & Salad Segar</option>
                  <option value="Jasa & Permainan Edukatif">Jasa & Permainan Edukatif</option>
                  <option value="Tanaman Hias & Bibit Hijau">Tanaman Hias & Bibit Hijau</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Slogan Promosi Stan (Bahasa Persuasif & Makna Kiasan)
                  </label>
                  <button
                    type="button"
                    onClick={handleAcakSlogan}
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Dice5 className="w-3.5 h-3.5" />
                    <span>Acak Slogan Cerdas</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={proyek.poster.slogan}
                  onChange={(e) => updateField('poster', { ...proyek.poster, slogan: e.target.value })}
                  placeholder="Contoh: Segarnya Alami, Manisnya Bikin Hati Berbunga-bunga!"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Deskripsi Keunggulan Produk
                </label>
                <textarea
                  rows={2}
                  value={proyek.deskripsiProduk}
                  onChange={(e) => updateField('deskripsiProduk', e.target.value)}
                  placeholder="Jelaskan apa bahan produkmu dan bagaimana rasa atau bentuknya..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveStep(2);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Lanjut ke Pembagian Tugas (Gotong Royong)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PEMBAGIAN TUGAS KELOMPOK DENGAN AVATAR & CHECKLIST */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Langkah 2: Profil Pelajar Pancasila - Gotong Royong
              </span>
              <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
                Pembagian 5 Tugas Tim Wirausaha Cilik
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Pilihlah avatar untuk tiap anggota, tulis nama siswa, dan centang checklist kesiapan tugas mereka!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proyek.anggota.map((anggota, index) => {
                const checkKey1 = `${anggota.peran}-1`;
                const checkKey2 = `${anggota.peran}-2`;
                const isReady = roleChecklist[checkKey1] && roleChecklist[checkKey2] && anggota.namaSiswa.trim().length > 1;

                return (
                  <div
                    key={anggota.peran}
                    className={`p-5 rounded-3xl border transition-all space-y-3 ${
                      isReady
                        ? 'border-emerald-300 bg-emerald-50/30'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white'
                    }`}
                  >
                    {/* Header Peran & Avatar Picker */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <button
                            type="button"
                            title="Klik untuk ganti avatar"
                            className="text-2xl p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                          >
                            {anggota.icon}
                          </button>
                          {/* Mini Avatar Palette Dropdown on Hover/Focus */}
                          <div className="hidden group-hover:flex absolute left-0 top-12 z-20 bg-white p-1.5 rounded-xl border border-slate-300 shadow-lg gap-1">
                            {AVATAR_LIST.map((av) => (
                              <button
                                key={av}
                                type="button"
                                onClick={() => handleUpdateAvatarAnggota(index, av)}
                                className="text-base p-1 hover:bg-slate-100 rounded cursor-pointer"
                              >
                                {av}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Peran {index + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{anggota.peranLabel}</h4>
                        </div>
                      </div>

                      {isReady && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Siap!
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[3rem]">
                      {anggota.tugas}
                    </p>

                    {/* Input Nama Siswa */}
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                        Nama Siswa Bertugas:
                      </label>
                      <input
                        type="text"
                        value={anggota.namaSiswa}
                        onChange={(e) => handleUpdateNamaAnggota(index, e.target.value)}
                        placeholder="Ketik nama siswa..."
                        className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    {/* Interactive Checklist Tugas */}
                    <div className="pt-2 space-y-1.5 bg-white/70 p-2.5 rounded-xl border border-slate-200/70 text-xs">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Checklist Kesiapan:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(checkKey1)}
                        className="flex items-center gap-2 text-left w-full text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        {roleChecklist[checkKey1] ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={roleChecklist[checkKey1] ? 'line-through text-slate-400' : ''}>
                          Memahami tugas & tanggung jawab
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleChecklist(checkKey2)}
                        className="flex items-center gap-2 text-left w-full text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        {roleChecklist[checkKey2] ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className={roleChecklist[checkKey2] ? 'line-through text-slate-400' : ''}>
                          Alat kerja & persiapan stan siap
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveStep(1);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Kembali ke Ide Usaha
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveStep(3);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Lanjut ke Hitung Modal & Laba</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: HITUNG MODAL & LABA DENGAN KATALOG CEPAT & THERMOMETER HARGA */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Langkah 3: Literasi Finansial Dasar
              </span>
              <h2 className="text-2xl font-display font-bold text-slate-900 mt-1">
                Kalkulator Modal, Harga Jual, & Target Laba
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Klik bahan dari katalog untuk menambahkannya langsung, sesuaikan jumlah porsi, dan amati termometer keuntungan kelompokmu!
              </p>
            </div>

            {/* Quick Add Ingredient Tray */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Katalog Bahan Cepat (Klik untuk Menambahkan ke Keranjang):</span>
                </span>
                <span className="text-[11px] text-slate-500">Harga standar ramah anak</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {KATALOG_BAHAN_CEPAT.map((kat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTambahBahanKatalog(kat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl text-xs font-medium text-slate-700 whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{kat.icon}</span>
                    <span className="font-semibold">{kat.nama}</span>
                    <span className="text-emerald-700 font-bold">
                      Rp {kat.hargaSatuan.toLocaleString('id-ID')}
                    </span>
                    <Plus className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block">Total Modal Bahan</span>
                <div className="text-xl font-display font-black text-slate-900 mt-1 tabular-nums">
                  Rp {totalModal.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-slate-500">{proyek.bahanAnggaran.length} bahan terdaftar</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block">Modal per Porsi</span>
                <div className="text-xl font-display font-black text-slate-700 mt-1 tabular-nums">
                  Rp {modalPerPorsi.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-slate-500">Target {estimasiPorsi} porsi</span>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-800 block">Harga Jual Disepakati</span>
                <div className="text-xl font-display font-black text-emerald-800 mt-1 tabular-nums">
                  Rp {targetHargaJual.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-emerald-700">Harga per pembeli</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                labaPerPorsi >= 0 ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'
              }`}>
                <span className={`text-xs font-semibold block ${labaPerPorsi >= 0 ? 'text-amber-800' : 'text-rose-800'}`}>
                  {labaPerPorsi >= 0 ? 'Potensi Keuntungan' : 'Status: Rugi'}
                </span>
                <div className={`text-xl font-display font-black mt-1 tabular-nums ${
                  labaPerPorsi >= 0 ? 'text-amber-900' : 'text-rose-700'
                }`}>
                  Rp {totalPotensiLaba.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-slate-600">
                  {labaPerPorsi >= 0 ? `+Rp ${labaPerPorsi.toLocaleString('id-ID')} / porsi` : 'Naikkan harga jual!'}
                </span>
              </div>
            </div>

            {/* Interactive Thermometer / Health Status */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
              labaPerPorsi < 0
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : labaPerPorsi >= 1000 && labaPerPorsi <= 5000
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              {labaPerPorsi < 0 ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : (
                <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block text-sm mb-0.5">
                  {labaPerPorsi < 0
                    ? '⚠️ Peringatan: Usaha Berisiko Rugi!'
                    : labaPerPorsi >= 1000 && labaPerPorsi <= 5000
                    ? '✅ Harga Sangat Ideal & Seimbang (Rekomendasi Guru)!'
                    : '💡 Margin Keuntungan Cukup Besar'}
                </span>
                <p>
                  {labaPerPorsi < 0
                    ? `Harga jual Rp ${targetHargaJual.toLocaleString('id-ID')} lebih kecil dari modal Rp ${modalPerPorsi.toLocaleString('id-ID')}. Naikkan harga jual atau kurangi biaya bahan.`
                    : `Dengan laba Rp ${labaPerPorsi.toLocaleString('id-ID')} per porsi, stan kelompokmu balik modal cukup dengan menjual ${breakEvenPorsi} dari ${estimasiPorsi} porsi! Sisanya adalah keuntungan bersih kelompok.`}
                </p>
              </div>
            </div>

            {/* Input Porsi & Slider Harga Jual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Target Jumlah Porsi yang Dibuat:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateField('estimasiPorsi', Math.max(5, estimasiPorsi - 5))}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={proyek.estimasiPorsi}
                    onChange={(e) => updateField('estimasiPorsi', Number(e.target.value) || 1)}
                    className="flex-1 px-3 py-2 text-center text-sm font-bold rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => updateField('estimasiPorsi', estimasiPorsi + 5)}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs font-semibold text-slate-600">porsi</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tentukan Harga Jual per Porsi (Rp):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const val = Math.max(500, targetHargaJual - 500);
                      updateField('targetHargaJual', val);
                      updateField('poster', { ...proyek.poster, hargaJual: val });
                    }}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="500"
                    min="500"
                    value={proyek.targetHargaJual}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      updateField('targetHargaJual', val);
                      updateField('poster', { ...proyek.poster, hargaJual: val });
                    }}
                    className="flex-1 px-3 py-2 text-center text-sm font-black rounded-lg border border-slate-300 bg-white text-emerald-800 font-display"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = targetHargaJual + 500;
                      updateField('targetHargaJual', val);
                      updateField('poster', { ...proyek.poster, hargaJual: val });
                    }}
                    className="w-9 h-9 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs font-semibold text-slate-600">/ porsi</span>
                </div>
              </div>
            </div>

            {/* Tabel Rincian Anggaran dengan Tombol +/- Kuantitas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Daftar Bahan & Perlengkapan yang Dibeli
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Rincian Anggaran Transparan
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Nama Bahan / Perlengkapan</th>
                      <th className="p-3 text-center">Jumlah (Qty)</th>
                      <th className="p-3">Satuan</th>
                      <th className="p-3 text-right">Harga Satuan (Rp)</th>
                      <th className="p-3 text-right">Subtotal (Rp)</th>
                      <th className="p-3 text-center w-12">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proyek.bahanAnggaran.map((item) => {
                      const subtotal = item.jumlah * item.hargaSatuan;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-800">{item.nama}</td>
                          <td className="p-3 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              <button
                                type="button"
                                onClick={() => handleStepQty(item.id, -1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-bold tabular-nums min-w-[20px]">
                                {item.jumlah}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleStepQty(item.id, 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">{item.satuan}</td>
                          <td className="p-3 text-right tabular-nums">
                            {item.hargaSatuan.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-right font-bold text-slate-900 tabular-nums">
                            {subtotal.toLocaleString('id-ID')}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleHapusBahan(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Hapus bahan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="p-3 text-right text-slate-700">
                        Total Modal Belanja Bahan:
                      </td>
                      <td className="p-3 text-right text-emerald-800 text-sm tabular-nums">
                        Rp {totalModal.toLocaleString('id-ID')}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Form Tambah Bahan Manual */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-2">
                <input
                  type="text"
                  value={namaBahanBaru}
                  onChange={(e) => setNamaBahanBaru(e.target.value)}
                  placeholder="Ketik bahan lain..."
                  className="flex-1 min-w-[160px] px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="number"
                  min="1"
                  value={jumlahBaru}
                  onChange={(e) => setJumlahBaru(Number(e.target.value))}
                  placeholder="Jumlah"
                  className="w-18 px-2 py-2 text-xs rounded-xl border border-slate-300 bg-white text-center"
                />
                <input
                  type="text"
                  value={satuanBaru}
                  onChange={(e) => setSatuanBaru(e.target.value)}
                  placeholder="Satuan (kg/bks)"
                  className="w-24 px-2 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                />
                <input
                  type="number"
                  step="500"
                  value={hargaBaru}
                  onChange={(e) => setHargaBaru(Number(e.target.value))}
                  placeholder="Harga satuan"
                  className="w-28 px-2 py-2 text-xs rounded-xl border border-slate-300 bg-white text-right"
                />
                <button
                  type="button"
                  onClick={handleTambahBahan}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveStep(2);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Kembali ke Tugas
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveStep(4);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Lanjut ke Studio Brosur Poster</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: STUDIO BROSUR / POSTER PROMOSI */}
      {activeStep === 4 && (
        <div className="space-y-6">
          <PosterStudio
            poster={proyek.poster}
            namaUsaha={proyek.namaUsaha}
            namaKelompok={proyek.namaKelompok}
            hargaJual={targetHargaJual}
            onUpdatePoster={(updated) => updateField('poster', updated)}
          />

          <div className="flex items-center justify-between pt-4 bg-white p-4 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                sound.playClick();
                setActiveStep(3);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Kembali ke Modal & Laba
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenSimulasi();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-700" />
                <span>Uji Simulasi Stan Market Day</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveStep(5);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Lihat Dokumen LKPD Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: LKPD CETAK LENGKAP */}
      {activeStep === 5 && (
        <div className="space-y-6">
          <PrintableLKPD
            proyek={proyek}
            totalModal={totalModal}
            modalPerPorsi={modalPerPorsi}
            totalPotensiLaba={totalPotensiLaba}
            onKembali={() => setActiveStep(4)}
            onBukaSimulasi={onOpenSimulasi}
          />
        </div>
      )}
    </div>
  );
}
