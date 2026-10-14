import { ProyekWirausaha } from '../../types';
import { Printer, Store, ArrowLeft } from 'lucide-react';
import { sound } from '../../utils/audio';

interface PrintableLKPDProps {
  proyek: ProyekWirausaha;
  totalModal: number;
  modalPerPorsi: number;
  totalPotensiLaba: number;
  onKembali: () => void;
  onBukaSimulasi: () => void;
}

export default function PrintableLKPD({
  proyek,
  totalModal,
  modalPerPorsi,
  totalPotensiLaba,
  onKembali,
  onBukaSimulasi,
}: PrintableLKPDProps) {
  const handlePrint = () => {
    sound.playClick();
    const lkpdElem = document.getElementById('printable-lkpd-sheet');
    if (!lkpdElem) {
      window.print();
      return;
    }

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>LKPD Kelompok - ${proyek.namaKelompok || 'Wirausaha Cilik'}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: A4 portrait; margin: 10mm; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #ffffff; padding: 20px; margin: 0; }
              .print-bar { margin-bottom: 20px; display: flex; gap: 10px; }
              .print-btn { background: #0f172a; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; border: none; cursor: pointer; }
              @media print { .print-bar { display: none !important; } }
            </style>
          </head>
          <body>
            <div class="print-bar">
              <button class="print-btn" onclick="window.print()">🖨️ Cetak ke Kertas / Simpan PDF</button>
            </div>
            <div style="max-width: 850px; margin: 0 auto;">
              ${lkpdElem.outerHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() { window.print(); }, 500);
              };
            </script>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden when printing) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => {
            sound.playClick();
            onKembali();
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali Edit Perencanaan</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onBukaSimulasi}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>Mulai Simulasi Stan</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen LKPD (A4)</span>
          </button>
        </div>
      </div>

      {/* The Printable Worksheet Sheet */}
      <div id="printable-lkpd-sheet" className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-300 shadow-lg text-slate-900 space-y-6 max-w-4xl mx-auto">
        {/* Header Lembar Kerja */}
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-600">
            KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-tight">
            LEMBAR KERJA PESERTA DIDIK (LKPD) KELOMPOK
          </h2>
          <div className="text-sm font-semibold text-emerald-800">
            Mata Pelajaran: Bahasa Indonesia Kelas 5 | Bab IV: Belajar Berwirausaha
          </div>
        </div>

        {/* Identitas Kelompok */}
        <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-500 block">Nama Kelompok:</span>
            <span className="font-bold text-sm text-slate-800">{proyek.namaKelompok || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Kelas / Sekolah:</span>
            <span className="font-bold text-sm text-slate-800">{proyek.kelas || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Nama Usaha / Stan:</span>
            <span className="font-bold text-sm text-slate-800">{proyek.namaUsaha || '-'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Kategori Produk:</span>
            <span className="font-bold text-sm text-slate-800">{proyek.kategori || '-'}</span>
          </div>
        </div>

        {/* Bagian A: Konsep & Alasan */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1 text-slate-900">
            A. Deskripsi Produk & Alasan Pemilihan Ide Usaha
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-800">Deskripsi: </span>
            {proyek.deskripsiProduk || 'Belum diisi'}
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-800">Alasan & Manfaat: </span>
            {proyek.alasanMemilih || 'Belum diisi'}
          </p>
        </div>

        {/* Bagian B: Pembagian Peran Kelompok */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1 text-slate-900">
            B. Pembagian Peran & Tanggung Jawab Anggota (Gotong Royong)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {proyek.anggota.map((ang) => (
              <div key={ang.peran} className="p-2.5 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{ang.icon} {ang.peranLabel}</span>
                  <span className="text-emerald-800">{ang.namaSiswa || '(Belum Ditulis)'}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{ang.tugas}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian C: Rencana Anggaran & Keuangan */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1 text-slate-900">
            C. Rencana Anggaran Biaya Bahan & Target Keuntungan
          </h3>

          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">No.</th>
                <th className="p-2 border-r border-slate-300">Bahan / Perlengkapan</th>
                <th className="p-2 border-r border-slate-300 text-center">Jumlah</th>
                <th className="p-2 border-r border-slate-300 text-right">Harga Satuan</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {proyek.bahanAnggaran.map((b, idx) => (
                <tr key={b.id}>
                  <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-300 font-medium">{b.nama}</td>
                  <td className="p-2 border-r border-slate-300 text-center">{b.jumlah} {b.satuan}</td>
                  <td className="p-2 border-r border-slate-300 text-right">Rp {b.hargaSatuan.toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right font-semibold">Rp {(b.jumlah * b.hargaSatuan).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold bg-slate-50 border-t border-slate-300">
              <tr>
                <td colSpan={4} className="p-2 text-right border-r border-slate-300">
                  Total Modal Produksi:
                </td>
                <td className="p-2 text-right text-emerald-800">
                  Rp {totalModal.toLocaleString('id-ID')}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="grid grid-cols-3 gap-3 text-xs pt-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-slate-500 block">Modal per Unit/Porsi:</span>
              <span className="font-bold text-slate-800">Rp {modalPerPorsi.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-slate-500 block">Harga Jual Disepakati:</span>
              <span className="font-bold text-emerald-800">Rp {proyek.targetHargaJual.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <span className="text-slate-500 block">Estimasi Keuntungan:</span>
              <span className="font-bold text-amber-800">Rp {totalPotensiLaba.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Bagian D: Slogan & Teks Iklan Persuasif */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-slate-300 pb-1 text-slate-900">
            D. Slogan & Bahasa Iklan Persuasif
          </h3>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <p><span className="font-bold">Slogan Iklan:</span> "{proyek.poster.slogan}"</p>
            <p><span className="font-bold">Teks Ajakan:</span> {proyek.poster.pesanPersuasif}</p>
            <p><span className="font-bold">Promo Spesial:</span> {proyek.poster.promoDiskon || '-'}</p>
          </div>
        </div>

        {/* Kolom Tanda Tangan */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-300 text-xs text-center">
          <div>
            <p className="text-slate-600 mb-12">Ketua Kelompok,</p>
            <p className="font-bold underline text-slate-900">
              {proyek.anggota.find((a) => a.peran === 'ketua')?.namaSiswa || '( ...................................... )'}
            </p>
          </div>
          <div>
            <p className="text-slate-600 mb-12">Guru Mata Pelajaran,</p>
            <p className="font-bold underline text-slate-900">( ...................................... )</p>
            <p className="text-[10px] text-slate-400">NIP. .....................................</p>
          </div>
        </div>
      </div>
    </div>
  );
}
