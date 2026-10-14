import { useState } from 'react';
import { ProyekWirausaha } from '../../types';
import { PELANGGAN_SIMULASI_DATA } from '../../data/curriculumData';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Store,
  Star,
  CheckCircle,
  AlertCircle,
  Award,
  RefreshCw,
  Printer,
  ChevronRight,
  MessageSquareQuote,
  Calculator,
} from 'lucide-react';

interface MarketSimulationProps {
  proyek: ProyekWirausaha;
  onKembaliKePerencana: () => void;
}

export default function MarketSimulation({
  proyek,
  onKembaliKePerencana,
}: MarketSimulationProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [inputKembalian, setInputKembalian] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreStars, setScoreStars] = useState(0);
  const [simulationFinished, setSimulationFinished] = useState(false);

  const currentPelanggan = PELANGGAN_SIMULASI_DATA[currentIdx];

  const handlePilihOpsi = (optId: string) => {
    if (submitted) return;
    sound.playClick();
    setSelectedOptId(optId);
  };

  const handleSubmitTantangan = () => {
    if (submitted) return;

    if (currentPelanggan.tipeTantangan === 'kembalian') {
      const nominalInput = parseInt(inputKembalian.replace(/[^0-9]/g, ''), 10);
      const isMathCorrect = nominalInput === currentPelanggan.jawabanKembalianBenar;

      setSubmitted(true);
      setIsCorrect(isMathCorrect);
      if (isMathCorrect) {
        sound.playCoin();
        setScoreStars((prev) => prev + 1);
      } else {
        sound.playWrong();
      }
      return;
    }

    if (!selectedOptId) return;

    const opt = currentPelanggan.pilihan.find((p) => p.id === selectedOptId);
    if (!opt) return;

    setSubmitted(true);
    setIsCorrect(opt.benar);
    if (opt.benar) {
      sound.playCorrect();
      setScoreStars((prev) => prev + 1);
    } else {
      sound.playWrong();
    }
  };

  const handleLanjutPelanggan = () => {
    sound.playClick();
    if (currentIdx + 1 < PELANGGAN_SIMULASI_DATA.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptId(null);
      setInputKembalian('');
      setSubmitted(false);
      setIsCorrect(false);
    } else {
      // Finished simulation!
      setSimulationFinished(true);
      sound.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // safe fallback
      }
    }
  };

  const handleUlangiSimulasi = () => {
    sound.playClick();
    setCurrentIdx(0);
    setSelectedOptId(null);
    setInputKembalian('');
    setSubmitted(false);
    setIsCorrect(false);
    setScoreStars(0);
    setSimulationFinished(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Simulation Header */}
      <div className="no-print bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Simulasi Stan Digital Market Day</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            Stan: {proyek.namaUsaha || 'Wirausaha Cilik'} ({proyek.namaKelompok})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Latihlah keterampilan menyapa pembeli dengan sopan, bersikap jujur, dan menghitung uang kembalian secara teliti.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <div className="text-right">
              <span className="block text-[10px] uppercase font-bold text-amber-700">Kepuasan Pembeli</span>
              <span className="text-sm font-black text-amber-900 font-display">
                {scoreStars} / {PELANGGAN_SIMULASI_DATA.length} Bintang
              </span>
            </div>
          </div>

          <button
            onClick={onKembaliKePerencana}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg cursor-pointer"
          >
            Kembali ke Perencana
          </button>
        </div>
      </div>

      {!simulationFinished ? (
        /* Active Customer Interaction Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          {/* Customer Avatar & Speech Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 sm:p-8 text-white">
            <div className="flex items-center justify-between text-xs text-emerald-300 mb-4 font-semibold">
              <span>Pelanggan {currentIdx + 1} dari {PELANGGAN_SIMULASI_DATA.length}</span>
              <span className="capitalize">Tantangan: {currentPelanggan.tipeTantangan}</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl shadow-inner shrink-0">
                {currentPelanggan.avatar}
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="text-sm font-bold text-amber-300">
                  {currentPelanggan.nama}
                </div>
                <div className="text-lg sm:text-xl font-medium text-slate-100 flex items-start gap-2">
                  <MessageSquareQuote className="w-5 h-5 text-emerald-400 shrink-0 mt-1 hidden sm:block" />
                  <p className="italic">"{currentPelanggan.dialog}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Area */}
          <div className="p-6 sm:p-8 space-y-6">
            {currentPelanggan.tipeTantangan === 'kembalian' ? (
              /* Math / Change Challenge */
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Total Belanjaan:</span>
                    <span className="font-bold text-slate-900">
                      Rp {(currentPelanggan.totalBelanja || 10000).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Uang Diterima dari Pak Joko:</span>
                    <span className="font-bold text-emerald-700">
                      Rp {(currentPelanggan.uangDibayar || 20000).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-slate-800">
                    <span>Uang Kembalian yang Harus Diberikan:</span>
                    <span className="text-amber-700">?</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Ketik Jumlah Uang Kembalian (Rp):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold text-sm">Rp</span>
                    <input
                      type="number"
                      step="500"
                      disabled={submitted}
                      value={inputKembalian}
                      onChange={(e) => setInputKembalian(e.target.value)}
                      placeholder="10000"
                      className="w-full pl-10 pr-4 py-2.5 text-base font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Dialog / Behavioral Choice */
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Pilih Kalimat Tanggapan Terbaik dari Tim Stanmu:
                </label>
                <div className="space-y-2.5">
                  {currentPelanggan.pilihan.map((opsi) => {
                    const isSelected = selectedOptId === opsi.id;
                    let style = 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50';

                    if (submitted) {
                      if (opsi.benar) {
                        style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                      } else if (isSelected && !opsi.benar) {
                        style = 'border-rose-400 bg-rose-50 text-rose-900';
                      } else {
                        style = 'border-slate-200 opacity-50';
                      }
                    } else if (isSelected) {
                      style = 'border-emerald-700 bg-emerald-50/70 shadow-xs';
                    }

                    return (
                      <button
                        key={opsi.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => handlePilihOpsi(opsi.id)}
                        className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${style}`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          isSelected ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </div>
                        <span className="flex-1 leading-relaxed">{opsi.teks}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback alert after submit */}
            {submitted && (
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm">
                  <span className="font-bold block mb-0.5">
                    {isCorrect ? 'Hebat Sekali! (+1 Bintang Kepuasan)' : 'Perlu Diperbaiki:'}
                  </span>
                  <p>
                    {currentPelanggan.tipeTantangan === 'kembalian'
                      ? isCorrect
                        ? 'Hitungan kembalianmu tepat Rp 10.000! Pelanggan sangat puas dengan kejujuran dan ketelitian kasir.'
                        : `Hitungan kurang tepat. Uang Rp 20.000 dikurangi belanja Rp 10.000 adalah Rp 10.000.`
                      : currentPelanggan.pilihan.find((p) => p.id === selectedOptId)?.umpanBalik ||
                        'Tetaplah berbicara santun dan berikan informasi yang jujur.'}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Poin Etika: Santun, Jujur, Ramah, Teliti
              </span>

              {!submitted ? (
                <button
                  onClick={handleSubmitTantangan}
                  disabled={
                    currentPelanggan.tipeTantangan === 'kembalian'
                      ? !inputKembalian.trim()
                      : !selectedOptId
                  }
                  className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Kirim Jawaban Tim
                </button>
              ) : (
                <button
                  onClick={handleLanjutPelanggan}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span>
                    {currentIdx + 1 < PELANGGAN_SIMULASI_DATA.length
                      ? 'Lanjut ke Pelanggan Berikutnya'
                      : 'Selesaikan Simulasi & Ambil Sertifikat'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Certificate & Final Reward View */
        <div className="space-y-6">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border-4 border-amber-400 shadow-xl text-center space-y-6 max-w-3xl mx-auto relative overflow-hidden">
            <div className="inline-flex p-3 bg-amber-100 rounded-2xl text-amber-700 mb-2">
              <Award className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                SERTIFIKAT PENGHARGAAN WIRAUSAHAWAN CILIK
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
                LULUS SIMULASI MARKET DAY KELAS 5
              </h3>
              <p className="text-xs text-slate-600">
                Diberikan kepada kelompok atas keberhasilan melayani konsumen dengan santun, jujur, dan berintegritas.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto space-y-2">
              <div className="text-xs text-slate-500">Nama Kelompok & Stan:</div>
              <div className="text-lg font-bold text-emerald-800">{proyek.namaKelompok}</div>
              <div className="text-sm font-semibold text-slate-800">"{proyek.namaUsaha}"</div>
              <div className="pt-2 flex items-center justify-center gap-1">
                {Array.from({ length: PELANGGAN_SIMULASI_DATA.length }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < scoreStars
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-amber-700">
                {scoreStars === PELANGGAN_SIMULASI_DATA.length
                  ? '🌟 Prestasi Sempurna! Sangat Membanggakan!'
                  : '⭐ Wirausahawan Hebat & Berbakat!'}
              </div>
            </div>

            <div className="no-print pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat Kelompok</span>
              </button>

              <button
                onClick={handleUlangiSimulasi}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ulangi Simulasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
