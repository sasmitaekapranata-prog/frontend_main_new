import { Coins, ArrowUpRight, ArrowDownLeft, RefreshCcw, Edit2, History } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import API from '../api/axiosConfig';

export default function CurrencyExchange() {
  const [currencyList, setCurrencyList] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [buyRate, setBuyRate] = useState("");
  const [sellRate, setSellRate] = useState("");
  
  // State menampung log riwayat aktivitas
  const [exchangeHistory, setExchangeHistory] = useState([
    {
      waktu: new Date(Date.now() - 3600000).toLocaleString('id-ID'),
      valas: 'USD',
      beliLama: '15.400',
      beliBaru: '15.550',
      jualLama: '15.600',
      jualBaru: '15.700',
      status: 'Berhasil'
    }
  ]);

  // Ambil data dari API saat pertama kali halaman dimuat
  useEffect(() => {
    API.get('/admin/kurs')
      .then((res) => {
        const dataValas = res.data.data || res.data || [];
        if (Array.isArray(dataValas) && dataValas.length > 0) {
          setCurrencyList(dataValas);
          // Set isi form kanan otomatis dengan data baris pertama
          pemicuSetForm(dataValas[0]);
        } else {
          jalankanDataDummy();
        }
      })
      .catch((err) => {
        console.error("Gagal memuat API, menggunakan data lokal:", err);
        jalankanDataDummy();
      });
  }, []);

  // Fungsi pengisi data dummy jika API backend Anda belum aktif / kosong
  const jalankanDataDummy = () => {
    const dummyData = [
      { kode_valas: 'USD', nama_valas: 'US Dollar', kurs_beli: 15550, kurs_jual: 15700, nilai_ke_idr: 150 },
      { kode_valas: 'SGD', nama_valas: 'Singapore Dollar', kurs_beli: 11300, kurs_jual: 11500, nilai_ke_idr: 200 },
      { kode_valas: 'MYR', nama_valas: 'Malaysian Ringgit', kurs_beli: 3450, kurs_jual: 3600, nilai_ke_idr: 150 },
    ];
    setCurrencyList(dummyData);
    pemicuSetForm(dummyData[0]);
  };

  // 1. FUNGSI TOMBOL EDIT: Memasukkan data tabel ke dalam form kanan
  const pemicuSetForm = (item) => {
    setSelectedCurrency(item.kode_valas);
    setBuyRate(item.kurs_beli);
    setSellRate(item.kurs_jual);
  };

  // 2. FUNGSI TOMBOL PERBARUI KURS SEKARANG
  const handleUpdateKurs = async () => {
    if (!selectedCurrency || !buyRate || !sellRate) {
      alert("Harap pilih mata uang dan isi tarif harga terlebih dahulu!");
      return;
    }

    // Cari data lama di tabel untuk dicatat perbandingannya ke tabel riwayat
    const dataLama = currencyList.find(c => c.kode_valas === selectedCurrency) || { kurs_beli: 0, kurs_jual: 0 };

    try {
      // Kirim data pembaruan ke server backend
      await API.put(`/admin/kurs/${selectedCurrency}`, {
        kurs_beli: Number(buyRate),
        kurs_jual: Number(sellRate),
      });
      alert(`Kurs ${selectedCurrency} berhasil diperbarui di server!`);
    } catch (error) {
      console.warn("Koneksi API gagal/offline. Perubahan dijalankan di sisi browser (Simulasi Frontend).");
    }

    // A. Update data baris tabel kiri secara realtime di layar
    const listTerbaru = currencyList.map((item) => {
      if (item.kode_valas === selectedCurrency) {
        return {
          ...item,
          kurs_beli: Number(buyRate),
          kurs_jual: Number(sellRate),
          nilai_ke_idr: Math.abs(Number(sellRate) - Number(buyRate)) // kalkulasi margin spread baru
        };
      }
      return item;
    });
    setCurrencyList(listTerbaru);

    // B. Tambahkan baris pencatatan baru ke dalam Tabel Riwayat di bagian bawah
    const logBaru = {
      waktu: new Date().toLocaleString('id-ID'),
      valas: selectedCurrency,
      beliLama: Number(dataLama.kurs_beli).toLocaleString('id-ID'),
      beliBaru: Number(buyRate).toLocaleString('id-ID'),
      jualLama: Number(dataLama.kurs_jual).toLocaleString('id-ID'),
      jualBaru: Number(sellRate).toLocaleString('id-ID'),
      status: 'Berhasil'
    };
    setExchangeHistory([logBaru, ...exchangeHistory]);
  };

  // Handle perubahan dropdown select agar input box ikut sinkron berganti harga
  const handleDropdownChange = (e) => {
    const kode = e.target.value;
    setSelectedCurrency(kode);
    const targetMataUang = currencyList.find(c => c.kode_valas === kode);
    if (targetMataUang) {
      setBuyRate(targetMataUang.kurs_beli);
      setSellRate(targetMataUang.kurs_jual);
    }
  };

  // 🛡️ CSS MASTER LAYOUT (Tetap rapi & anti-bentrok)
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      boxSizing: 'border-box',
      textAlign: 'left'
    },
    topHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    title: {
      fontSize: '22px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0,
      letterSpacing: '-0.025em'
    },
    subtitle: {
      fontSize: '13px',
      color: '#94a3b8',
      margin: '4px 0 0 0',
      fontWeight: '500'
    },
    syncButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      border: '1px solid #bfdbfe',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    mainGrid: {
      display: 'flex',
      gap: '24px',
      width: '100%',
      alignItems: 'flex-start',
      boxSizing: 'border-box'
    },
    leftTableCard: {
      flex: '0 0 65%',
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      boxSizing: 'border-box',
      width: '65%'
    },
    rightFormCard: {
      flex: '0 0 35%',
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      boxSizing: 'border-box',
      width: '35%'
    },
    bottomHistoryCard: {
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      boxSizing: 'border-box'
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    },
    th: {
      padding: '12px 16px',
      color: '#94a3b8',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #e2e8f0'
    },
    td: {
      padding: '16px',
      fontSize: '14px',
      borderBottom: '1px solid #f1f5f9'
    },
    codeBadge: {
      padding: '4px 8px',
      backgroundColor: '#f1f5f9',
      color: '#334155',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      fontSize: '12px',
      borderRadius: '6px'
    },
    editButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '12px',
      color: '#2563eb',
      fontWeight: '600',
      backgroundColor: '#eff6ff',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px'
    },
    label: {
      fontSize: '11px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      color: '#64748b',
      letterSpacing: '0.5px'
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      fontSize: '13px',
      color: '#334155',
      backgroundColor: '#ffffff',
      outline: 'none',
      cursor: 'pointer'
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      fontSize: '13px',
      color: '#1e293b',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    },
    submitButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.1)',
      marginTop: '8px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Atas: Header Informasi */}
      <div style={styles.topHeader}>
        <div>
          <h1 style={styles.title}>Currency Exchange</h1>
          <p style={styles.subtitle}>Atur nilai tukar mata uang, margin keuntungan spread, dan operasional valas harian</p>
        </div>
        <button style={styles.syncButton} type="button" className="sync-btn">
          <RefreshCcw className="h-4 w-4" /> Sinkronisasi Kurs BI
        </button>
      </div>

      {/* Tengah: Layout Split 2 Kolom */}
      <div style={styles.mainGrid} className="exchange-grid">
        
        {/* KOLOM KIRI: Tabel Tarif Penukaran */}
        <div style={styles.leftTableCard} className="grid-left">
          <h2 style={styles.cardTitle}>Pengaturan Rate Multi-Valas</h2>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Valas</th>
                  <th style={styles.th}>Kurs Beli</th>
                  <th style={styles.th}>Kurs Jual</th>
                  <th style={styles.th}>Spread Margin</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currencyList.map((c, i) => (
                  <tr key={i} className="exchange-row">
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.codeBadge}>{c.kode_valas}</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{c.nama_valas}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, fontWeight: 'bold', color: '#16a34a' }}>
                      Rp {Number(c.kurs_beli).toLocaleString('id-ID')}
                    </td>
                    <td style={{ ...styles.td, fontWeight: 'bold', color: '#dc2626' }}>
                      Rp {Number(c.kurs_jual).toLocaleString('id-ID')}
                    </td>
                    <td style={{ ...styles.td, color: '#475569', fontSize: '13px' }}>
                      Rp {Number(c.nilai_ke_idr).toLocaleString('id-ID')}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      {/* KLIK EDIT DI SINI AKAN MEMICU DATA MASUK FORM */}
                      <button style={styles.editButton} className="edit-btn" onClick={() => pemicuSetForm(c)}>
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* KOLOM KANAN: Panel Penyesuaian Form */}
        <div style={styles.rightFormCard} className="grid-right">
          <h2 style={{ ...styles.cardTitle, marginBottom: 0 }}>Penyesuaian Tarif Instan</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Pilih Mata Uang</label>
            <select style={styles.select} value={selectedCurrency} onChange={handleDropdownChange}>
              {currencyList.map((c, idx) => (
                <option key={idx} value={c.kode_valas}>{c.kode_valas} - {c.nama_valas}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Harga Beli (IDR)</label>
              <input type="number" value={buyRate} onChange={(e) => setBuyRate(e.target.value)} style={styles.input}/>
            </div>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Harga Jual (IDR)</label>
              <input type="number" value={sellRate} onChange={(e) => setSellRate(e.target.value)} style={styles.input}/>
            </div>
          </div>

          {/* KLIK PERBARUI AKAN MENGIRIM DATA KE SERVER & MENCATAT RIWAYAT */}
          <button style={styles.submitButton} type="button" className="submit-btn" onClick={handleUpdateKurs}>
            Perbarui Kurs Sekarang
          </button>
        </div>
      </div>

      {/* Bawah: Riwayat Pencatatan Log */}
      <div style={styles.bottomHistoryCard}>
        <h2 style={styles.cardTitle}>
          <History className="h-4 w-4 text-[#64748b]" /> Riwayat Pembaruan & Aktivitas Kurs
        </h2>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Waktu Operasional</th>
                <th style={styles.th}>Mata Uang</th>
                <th style={styles.th}>Kurs Beli (Lama → Baru)</th>
                <th style={styles.th}>Kurs Jual (Lama → Baru)</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {exchangeHistory.map((h, index) => (
                <tr key={index} style={{ backgroundColor: index === 0 ? '#f8fafc' : 'transparent' }}>
                  <td style={{ ...styles.td, color: '#64748b', fontSize: '13px' }}>{h.waktu}</td>
                  <td style={styles.td}><span style={styles.codeBadge}>{h.valas}</span></td>
                  <td style={styles.td}>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '6px' }}>Rp {h.beliLama}</span>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>→ Rp {h.beliBaru}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginRight: '6px' }}>Rp {h.jualLama}</span>
                    <span style={{ color: '#dc2626', fontWeight: 'bold' }}>→ Rp {h.jualBaru}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <span style={{ padding: '4px 8px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .exchange-row:hover { background-color: #f8fafc !important; }
        .sync-btn:hover { background-color: #dbeafe !important; }
        .edit-btn:hover { background-color: #cbd5e1 !important; color: #1d4ed8 !important; }
        .submit-btn:hover { background-color: #1d4ed8 !important; }
        @media (max-width: 1024px) {
          .exchange-grid { flex-direction: column !important; }
          .grid-left, .grid-right { width: 100% !important; flex: 1 1 100% !important; }
        }
      `}</style>
    </div>
  );
}