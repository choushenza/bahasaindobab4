import { useState, useEffect } from 'react';
import { BANK_SOAL_DENOTASI_KONOTASI } from '../../data/curriculumData';
import { MaknaType, SoalDenotasiKonotasi } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Heart,
  Flame,
  Award,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';

export default function DenotasiKonotasiGame() {
  const [soalList, setSoalList] = useState<SoalDenotasiKonotasi[]>(() =>
    [...BANK_SOAL_DENOTASI_KONOTASI].sort(() => Math.random() - 0.5).slice(0, 30)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nyawa, setNyawa] = useState(3);
  const [skor, setSkor] = useState(0);
  const [streak, setStreak] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<MaknaType | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [riwayatSalah, setRiwayatSalah] = useState<SoalDenotasiKonotasi[]>([]);

  const currentSoal = soalList[currentIndex];

  const handlePilih = (pilihan: MaknaType) => {
    if (showExplanation || gameOver) return;

    setJawabanUser(pilihan);
    setShowExplanation(true);

    const isBenar = pilihan === currentSoal.tipe;

    if (isBenar) {
      sound.playCorrect();
      const bonusStreak = streak >= 3 ? 20 : streak >= 1 ? 10 : 0;
      setSkor((prev) => prev + 100 + bonusStreak);
      setStreak((prev) => prev + 1);

      if ((currentIndex + 1) % 5 === 0) {
        try {
          confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    } else {
      sound.playWrong();
      setStreak(0);
      setNyawa((prev) => {
        const nextNyawa = prev - 1;
        if (nextNyawa <= 0) {
          setGameOver(true);
        }
        return nextNyawa;
      });
      setRiwayatSalah((prev) => [...prev, currentSoal]);
    }
  };

  const handleLanjutSoal = () => {
    sound.playClick();
    if (currentIndex + 1 < soalList.length && nyawa > 0) {
      setCurrentIndex((prev) => prev + 1);
      setJawabanUser(null);
      setShowExplanation(false);
    } else {
      setGameOver(true);
      sound.playFanfare();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setSoalList([...BANK_SOAL_DENOTASI_KONOTASI].sort(() => Math.random() - 0.5).slice(0, 30));
    setCurrentIndex(0);
    setNyawa(3);
    setSkor(0);
    setStreak(0);
    setJawabanUser(null);
    setShowExplanation(false);
    setGameOver(false);
    setRiwayatSalah([]);
  };

  // Keyboard shortcut listener (Left Arrow = Denotasi, Right Arrow = Konotasi, Space/Enter = Lanjut)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (!showExplanation) {
        if (e.key === 'ArrowLeft') {
          handlePilih('denotasi');
        } else if (e.key === 'ArrowRight') {
          handlePilih('konotasi');
        }
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLanjutSoal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExplanation, gameOver, currentIndex, nyawa, currentSoal]);

  // Highlight kata kunci in the sentence
  const renderHighlightedSentence = (kalimat: string, kataKunci: string) => {
    const regex = new RegExp(`(${kataKunci})`, 'gi');
    const parts = kalimat.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === kataKunci.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-200 text-slate-900 font-bold px-1.5 py-0.5 rounded-md underline decoration-amber-500 decoration-2"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Dashboard Top Header: Lives, Score, Streak */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <span>Bab IV: Ragam Makna Kata</span>
            <span aria-hidden="true">·</span>
            <span>Soal {currentIndex + 1} dari {soalList.length}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 mt-0.5">
            Permainan Pemilah Denotasi vs. Konotasi
          </h2>
        </div>

        {/* HUD: Hearts & Score */}
        <div className="flex items-center gap-4">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  i < nyawa
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Streak */}
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200 text-amber-800 text-xs font-bold animate-bounce">
              <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>{streak}x Kombo!</span>
            </div>
          )}

          {/* Score */}
          <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-right">
            <span className="block text-[10px] font-bold uppercase text-emerald-700">Skor</span>
            <span className="text-base sm:text-lg font-black font-display text-emerald-900 tabular-nums">
              {skor}
            </span>
          </div>
        </div>
      </div>

      {!gameOver && currentSoal ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
          {/* Instruksi Singkat */}
          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              Perhatikan Kata yang Disorot Kuning
            </span>
            <p className="text-xs text-slate-500">
              Apakah kata tersebut bermakna sebenarnya (denotasi) atau kiasan (konotasi)?
            </p>
          </div>

          {/* Kalimat Soal Display */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <div className="text-lg sm:text-2xl font-medium text-slate-800 leading-relaxed max-w-2xl mx-auto">
              "{renderHighlightedSentence(currentSoal.kalimat, currentSoal.kataKunci)}"
            </div>
          </div>

          {/* Dual Action Sorting Buttons */}
          {!showExplanation ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Denotasi Button */}
              <button
                type="button"
                onClick={() => handlePilih('denotasi')}
                className="group p-6 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 text-left transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🍏</span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                    Tombol [←] Kiri
                  </span>
                </div>
                <div className="text-lg font-display font-bold text-emerald-900 group-hover:text-emerald-950">
                  Makna Denotasi
                </div>
                <div className="text-xs font-semibold text-emerald-700 mt-1">
                  (Makna Sebenarnya / Lugas / Harfiah)
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Arti kata apa adanya sesuai kamus tanpa kiasan atau perumpamaan rasa.
                </p>
              </button>

              {/* Konotasi Button */}
              <button
                type="button"
                onClick={() => handlePilih('konotasi')}
                className="group p-6 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-purple-50/40 hover:bg-purple-50 text-left transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">🌺</span>
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-0.5 rounded-md">
                    Tombol [→] Kanan
                  </span>
                </div>
                <div className="text-lg font-display font-bold text-purple-900 group-hover:text-purple-950">
                  Makna Konotasi
                </div>
                <div className="text-xs font-semibold text-purple-700 mt-1">
                  (Makna Kiasan / Nilai Rasa Tambahan)
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Bukan arti fisik sungguhan, melainkan perumpamaan atau ungkapan khas.
                </p>
              </button>
            </div>
          ) : (
            /* Penjelasan Edukatif Langsung */
            <div className="space-y-6">
              <div
                className={`p-6 rounded-2xl border ${
                  jawabanUser === currentSoal.tipe
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  {jawabanUser === currentSoal.tipe ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                      <span className="text-base font-bold">
                        Tepat Sekali! Jawabanmu Benar (+100 Poin)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-rose-600" />
                      <span className="text-base font-bold">
                        Kurang Tepat! Jawaban Seharusnya: Makna {currentSoal.tipe.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>

                {/* Penjelasan Detail */}
                <div className="space-y-2 mt-3 pt-3 border-t border-current/15 text-xs sm:text-sm leading-relaxed">
                  <p>
                    <span className="font-bold">Penjelasan: </span>
                    {currentSoal.penjelasan}
                  </p>
                  {currentSoal.tipe === 'konotasi' && currentSoal.maknaKiasan && (
                    <p className="text-emerald-950 bg-white/70 p-2.5 rounded-lg border border-current/20">
                      💡 <span className="font-bold">Arti Kiasan: </span>
                      {currentSoal.maknaKiasan}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleLanjutSoal}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  <span>
                    {currentIndex + 1 < soalList.length
                      ? 'Lanjut ke Soal Berikutnya (Enter)'
                      : 'Lihat Hasil Akhir Evaluasi'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Game Over / Summary Score Screen */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex p-4 bg-emerald-100 rounded-3xl text-emerald-800">
            <Award className="w-16 h-16" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hasil Permainan Pemilah Makna Kata
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
              {skor >= 1500
                ? '🌟 Juara Ahli Ragam Makna Kata!'
                : skor >= 800
                ? '👏 Hebat! Pemahamanmu Sangat Baik!'
                : '💪 Semangat! Terus Latihan Ya!'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Kamu telah menyelesaikan latihan memilah makna denotasi dan konotasi Bahasa Indonesia Kelas 5 Bab IV.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto text-left">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Total Skor</span>
              <span className="text-2xl font-black font-display text-emerald-800 tabular-nums">
                {skor}
              </span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Soal Dijawab</span>
              <span className="text-2xl font-black font-display text-slate-800 tabular-nums">
                {currentIndex + 1}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">Sisa Nyawa</span>
              <span className="text-2xl font-black font-display text-rose-600 tabular-nums">
                {nyawa} / 3
              </span>
            </div>
          </div>

          {/* Daftar Review Salah Jika Ada */}
          {riwayatSalah.length > 0 && (
            <div className="text-left max-w-xl mx-auto pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Pelajari Kembali Soal yang Terlewat ({riwayatSalah.length}):</span>
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {riwayatSalah.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <p className="font-semibold text-slate-800">"{s.kalimat}"</p>
                    <p className="text-slate-600 mt-1">
                      Kata <span className="font-bold underline">{s.kataKunci}</span> bermakna{' '}
                      <span className="font-bold text-emerald-800">{s.tipe.toUpperCase()}</span>:{' '}
                      {s.penjelasan}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Mainkan Lagi dari Awal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
