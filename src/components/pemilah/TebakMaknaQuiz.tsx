import { useState } from 'react';
import { KAMUS_UNGKAPAN } from '../../data/curriculumData';
import { UngkapanKiasan } from '../../types';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';

interface SoalKuisUngkapan {
  ungkapanData: UngkapanKiasan;
  opsiJawaban: { teks: string; benar: boolean }[];
}

export default function TebakMaknaQuiz() {
  const [modeJumlah, setModeJumlah] = useState<number>(30);
  const [soalList, setSoalList] = useState<SoalKuisUngkapan[]>(() => generateSoalKuis(30));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [skor, setSkor] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  function generateSoalKuis(targetCount: number = 30): SoalKuisUngkapan[] {
    const shuffled = [...KAMUS_UNGKAPAN].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(targetCount, shuffled.length)).map((item) => {
      // Pick 3 distractors from other idioms
      const distractors = KAMUS_UNGKAPAN.filter((u) => u.ungkapan !== item.ungkapan)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((d) => ({ teks: d.arti, benar: false }));

      const correct = { teks: item.arti, benar: true };
      const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

      return {
        ungkapanData: item,
        opsiJawaban: options,
      };
    });
  }

  const currentSoal = soalList[currentIdx];

  const handleSelectOpsi = (idx: number) => {
    if (answered) return;
    setSelectedOptIdx(idx);
    setAnswered(true);

    const isCorrect = currentSoal.opsiJawaban[idx].benar;
    if (isCorrect) {
      sound.playCorrect();
      setSkor((prev) => prev + 10);
    } else {
      sound.playWrong();
    }
  };

  const handleLanjut = () => {
    sound.playClick();
    if (currentIdx + 1 < soalList.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptIdx(null);
      setAnswered(false);
    } else {
      setIsFinished(true);
      sound.playFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRestart = (customCount: number = modeJumlah) => {
    sound.playClick();
    setModeJumlah(customCount);
    setSoalList(generateSoalKuis(customCount));
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setAnswered(false);
    setSkor(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-0.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kuis Bahasa Indonesia Kelas 5 (30 Soal Ungkapan)</span>
          </div>
          <h2 className="text-xl font-display font-bold text-slate-900">
            Tebak Arti Ungkapan Makna Kiasan
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleRestart(30)}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                modeJumlah === 30
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Maraton 30 Soal
            </button>
            <button
              onClick={() => handleRestart(10)}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                modeJumlah === 10
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sesi Kilat 10 Soal
            </button>
          </div>
        </div>

        <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 text-right shrink-0">
          <span className="block text-[10px] uppercase font-bold text-emerald-700">Skor Kuis</span>
          <span className="text-xl font-black font-display text-emerald-900 tabular-nums">
            {skor} / {soalList.length * 10}
          </span>
        </div>
      </div>

      {!isFinished && currentSoal ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold border-b border-slate-100 pb-3">
            <span>Soal {currentIdx + 1} dari {soalList.length}</span>
            <span className="text-emerald-700 capitalize">Tema: {currentSoal.ungkapanData.kategori}</span>
          </div>

          {/* Target Ungkapan Highlight */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Apa arti dari ungkapan kiasan:
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-emerald-900">
              "{currentSoal.ungkapanData.ungkapan}"
            </h3>
            <p className="text-xs text-slate-500 mt-2 italic max-w-md mx-auto">
              Contoh dalam kalimat: "{currentSoal.ungkapanData.contohKalimat}"
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Pilihan Jawaban Arti yang Tepat:
            </label>
            <div className="space-y-2.5">
              {currentSoal.opsiJawaban.map((opsi, idx) => {
                const isSelected = selectedOptIdx === idx;
                let btnStyle = 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 text-slate-800';

                if (answered) {
                  if (opsi.benar) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isSelected && !opsi.benar) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                  } else {
                    btnStyle = 'border-slate-200 opacity-40 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={answered}
                    onClick={() => handleSelectOpsi(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 leading-relaxed">{opsi.teks}</span>
                    {answered && opsi.benar && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {answered && isSelected && !opsi.benar && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Next Button */}
          {answered && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {currentSoal.opsiJawaban[selectedOptIdx!].benar
                  ? 'Jawaban kamu tepat!'
                  : `Jawaban yang benar: ${currentSoal.ungkapanData.arti}`}
              </span>
              <button
                onClick={handleLanjut}
                className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>{currentIdx + 1 < soalList.length ? 'Soal Selanjutnya' : 'Selesai Kuis'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Card */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-12 text-center space-y-6">
          <div className="inline-flex p-4 bg-emerald-100 rounded-2xl text-emerald-800">
            <Sparkles className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hasil Kuis Makna Kiasan
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
              Skor Akhir: {skor} / {soalList.length * 10}
            </h3>
            <p className="text-sm text-slate-600">
              {skor >= 80
                ? 'Luar biasa! Penguasaan ragam makna kata konotasimu sangat mengagumkan!'
                : 'Bagus sekali! Teruslah rajin membaca buku untuk memperkaya kosakatamu.'}
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => handleRestart()}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Kuis Lagi</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
