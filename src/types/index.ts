export type ActiveTab = 'perencana' | 'pemilah-game' | 'tebak-makna' | 'pasangan-kata' | 'simulasi-stan';

export interface AnggotaKelompok {
  peran: string;
  peranLabel: string;
  tugas: string;
  icon: string;
  namaSiswa: string;
}

export interface AnggaranItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
}

export interface PosterConfig {
  judul: string;
  slogan: string;
  temaWarna: 'emerald' | 'amber' | 'blue' | 'rose' | 'purple' | 'sunset' | 'warm' | 'mint';
  gayaBingkai?: 'modern' | 'karnaval' | 'vintage' | 'minimalis' | 'ceria';
  ikonHero?: string;
  polaLatar?: 'polos' | 'bintik' | 'garis' | 'gelombang';
  tipeFont?: 'ceria' | 'tegas' | 'anggun';
  kategori: string;
  hargaJual: number;
  promoDiskon: string;
  lokasiStand: string;
  pesanPersuasif: string;
  stiker: string[];
}

export interface ProyekWirausaha {
  namaKelompok: string;
  kelas: string;
  namaUsaha: string;
  kategori: string;
  deskripsiProduk: string;
  alasanMemilih: string;
  anggota: AnggotaKelompok[];
  bahanAnggaran: AnggaranItem[];
  estimasiPorsi: number;
  targetHargaJual: number;
  poster: PosterConfig;
}

export type MaknaType = 'denotasi' | 'konotasi';

export interface SoalDenotasiKonotasi {
  id: string;
  kalimat: string;
  kataKunci: string;
  tipe: MaknaType;
  maknaSebenarnya: string;
  maknaKiasan?: string;
  penjelasan: string;
  konteksWirausaha?: boolean;
}

export interface UngkapanKiasan {
  ungkapan: string;
  arti: string;
  contohKalimat: string;
  kategori: 'wirausaha' | 'sekolah' | 'karakter' | 'kehidupan';
}

export interface PasanganKata {
  id: string;
  kataDasar: string;
  denotasi: {
    kalimat: string;
    makna: string;
  };
  konotasi: {
    kalimat: string;
    makna: string;
  };
}

export interface PelangganSimulasi {
  id: string;
  nama: string;
  avatar: string;
  dialog: string;
  tipeTantangan: 'sapaan' | 'persuasi' | 'kembalian' | 'kejujuran';
  pilihan: {
    id: string;
    teks: string;
    benar: boolean;
    umpanBalik: string;
  }[];
  totalBelanja?: number;
  uangDibayar?: number;
  jawabanKembalianBenar?: number;
}
