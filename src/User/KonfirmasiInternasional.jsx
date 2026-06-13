import React, { useState, useEffect } from 'react';
import { IoChevronDownOutline, IoArrowForwardOutline } from 'react-icons/io5';

const EXCHANGE_RATES = {
  IDR: 1,
  USD: 16200,   
  MYR: 3450,    
  SGD: 12000    
};

const CURRENCY_LIST = [
  { id: 'IDR', code: 'id', country: 'Indonesia', label: 'IDR - Indonesia' },
  { id: 'USD', code: 'us', country: 'United States', label: 'USD - Amerika Serikat' },
  { id: 'MYR', code: 'my', country: 'Malaysia', label: 'MYR - Malaysia' },
  { id: 'SGD', code: 'sg', country: 'Singapura', label: 'SGD - Singapura' },
];

export default function KonfirmasiInternasional({ initialData, onNavigate, onLogout, onConfirm }) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  
  const defaultTo = initialData?.mataUang?.toUpperCase() || 'USD';
  
  const [currencyFrom, setCurrencyFrom] = useState(CURRENCY_LIST[0]); 
  const [currencyTo, setCurrencyTo] = useState(
    CURRENCY_LIST.find(c => c.id === defaultTo) || CURRENCY_LIST[1]
  );

  const [rekeningTujuan, setRekeningTujuan] = useState(initialData?.rekeningTujuan || '');
  const [nominalFrom, setNominalFrom] = useState(100); 

  const [kalkulasi, setKalkulasi] = useState({
    kursTeks: '1 IDR = 1 IDR',
    hasilKonversi: 0,
    biayaTransaksi: 25000,
    totalBiaya: 0
  });

  useEffect(() => {
    if (!currencyFrom?.id || !currencyTo?.id) return;

    const fromId = currencyFrom.id.toUpperCase();
    const toId = currencyTo.id.toUpperCase();

    const rateFromInIdr = EXCHANGE_RATES[fromId] || 1;
    const rateToInIdr = EXCHANGE_RATES[toId] || 1;
    
    const finalRate = rateFromInIdr / rateToInIdr;

    const kursTeks = `1 ${fromId} = ${finalRate.toFixed(4)} ${toId}`;
    const hasilKonversi = (Number(nominalFrom) || 0) * finalRate;
    
    const biayaTransaksiIdr = 25000; 
    const biayaTransaksiValas = biayaTransaksiIdr / rateFromInIdr;
    const totalBiaya = (Number(nominalFrom) || 0) + biayaTransaksiValas;

    setKalkulasi({
      kursTeks,
      hasilKonversi,
      biayaTransaksi: biayaTransaksiValas,
      totalBiaya
    });
  }, [currencyFrom, currencyTo, nominalFrom]);

  const handleRekeningChange = (e) => {
    const val = e.target.value;
    const cleanValue = val.replace(/[^0-9]/g, '');
    setRekeningTujuan(cleanValue);
  };

  const handleNextSubmit = () => {
    if (!rekeningTujuan) {
      alert('Silakan isi Nomor Rekening Tujuan terlebih dahulu!');
      return;
    }
    if ((Number(nominalFrom) || 0) <= 0) {
      alert('Nominal transfer harus lebih besar dari 0');
      return;
    }

    const currentFromId = currencyFrom?.id?.toUpperCase() || 'IDR';
    const currentToId = currencyTo?.id?.toUpperCase() || 'USD';
    const totalBayarIdr = kalkulasi.totalBiaya * (EXCHANGE_RATES[currentFromId] || 1);

    if (onConfirm) {
      onConfirm({
        mataUang: currentToId,      
        mataUangAsal: currentFromId,  
        rekeningTujuan: rekeningTujuan,
        nominalValas: Number(nominalFrom) || 0,
        hasilKonversi: kalkulasi.hasilKonversi,
        totalBiayaAdmin: kalkulasi.biayaTransaksi * (EXCHANGE_RATES[currentFromId] || 1),
        totalBayarIdr: totalBayarIdr
      });
    }
  };

  return (
    /* BYPASS WRAPPER MUTLAK: 
      Menggunakan kombinasi CSS tingkat tinggi untuk menetralisir paksa CSS bawaan framework 
    */
    <div style={{
      display: 'grid',
      placeItems: 'start center',
      width: '100vw',
      minHeight: '100vh',
      background: '#f8fafc',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      textAlign: 'left'
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <style>{`
        /* Menghancurkan paksa margin/padding bawaan html agar layout ditarik penuh */
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          width: 100vw !important; 
          height: 100vh !important; 
          display: block !important; 
          text-align: left !important;
          background: #f8fafc !important;
        }
        .dropdown-row:hover { background-color: #f1f5f9 !important; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>

      {/* DASHBOARD KONTEN UTAMA */}
      <div style={styles.dashboardWrapper}>
        <header style={styles.header}>
          <div style={styles.brandSection}>
            <div style={styles.logoContainer}>
              <span style={styles.logoTextBlue}>TrustPay</span>
              <span style={styles.logoTextLightBlue}>.id</span>
              <span style={{ marginLeft: '6px', fontSize: '28px', display: 'inline-block', verticalAlign: 'middle' }}>🛡️</span>
            </div>
          </div>

          <nav style={styles.navMenu}>
            <span style={styles.navItemHome} onClick={() => onNavigate && onNavigate('dashboard')}>Home</span>
            <span style={styles.navItemNotif} onClick={() => onNavigate && onNavigate('notifikasi')}>Notifikasi</span>
            <span style={styles.navItemLogout} onClick={onLogout}>Logout</span>
          </nav>
        </header>

        <main style={styles.mainContent}>
          {/* LAYOUT GRID DUA KOLOM */}
          <div style={styles.splitGridCard}>
            
            {/* SISI KIRI: INPUT FORM */}
            <div style={styles.formSideColumn}>
              <h2 style={styles.columnTitle}>Informasi Pengiriman</h2>
              
              {/* DROPDOWN 1: FROM */}
              <div style={styles.inputFormGroup}>
                <label style={styles.fieldLabel}>Mata Uang Asal</label>
                <div style={styles.anchorContainer}>
                  <button type="button" onClick={() => { setFromOpen(!fromOpen); setToOpen(false); }} style={styles.dropdownSelectorTrigger}>
                    <div style={styles.flagLabelGroup}>
                      {currencyFrom?.code && (
                        <img src={`https://flagcdn.com/w40/${currencyFrom.code.toLowerCase()}.png`} alt="" style={styles.circleFlagIcon} />
                      )}
                      <span>{currencyFrom?.label || 'Pilih Mata Uang'}</span>
                    </div>
                    <IoChevronDownOutline style={{ transition: 'transform 0.2s', transform: fromOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                  
                  {fromOpen && (
                    <div style={styles.dropdownMenuOverlay}>
                      {CURRENCY_LIST.map((c) => (
                        <div key={`from-${c.id}`} onClick={() => { setCurrencyFrom(c); setFromOpen(false); }} className="dropdown-row" style={styles.dropdownItemOption}>
                          <img src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`} alt="" style={styles.circleFlagIconSmall} />
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* INPUT NOMINAL */}
              <div style={styles.inputFormGroup}>
                <label style={styles.fieldLabel}>Jumlah Dikirim</label>
                <div style={styles.suffixInputAnchor}>
                  <input
                    type="number"
                    value={nominalFrom}
                    onChange={(e) => setNominalFrom(e.target.value)}
                    style={styles.largeNumericInput}
                    placeholder="0"
                  />
                  <div style={styles.suffixCurrencyBadge}>
                    {currencyFrom?.id?.toUpperCase()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '-4px 0', color: '#1a56db' }}>
                <IoArrowForwardOutline style={{ transform: 'rotate(90deg)', fontSize: '20px' }} />
              </div>

              {/* DROPDOWN 2: TO */}
              <div style={styles.inputFormGroup}>
                <label style={styles.fieldLabel}>Mata Uang Tujuan</label>
                <div style={styles.anchorContainer}>
                  <button type="button" onClick={() => { setToOpen(!toOpen); setFromOpen(false); }} style={styles.dropdownSelectorTrigger}>
                    <div style={styles.flagLabelGroup}>
                      {currencyTo?.code && (
                        <img src={`https://flagcdn.com/w40/${currencyTo.code.toLowerCase()}.png`} alt="" style={styles.circleFlagIcon} />
                      )}
                      <span>{currencyTo?.label || 'Pilih Mata Uang'}</span>
                    </div>
                    <IoChevronDownOutline style={{ transition: 'transform 0.2s', transform: toOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                  
                  {toOpen && (
                    <div style={styles.dropdownMenuOverlay}>
                      {CURRENCY_LIST.map((c) => (
                        <div key={`to-${c.id}`} onClick={() => { setCurrencyTo(c); setToOpen(false); }} className="dropdown-row" style={styles.dropdownItemOption}>
                          <img src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`} alt="" style={styles.circleFlagIconSmall} />
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* REKENING */}
              <div style={styles.inputFormGroup}>
                <label style={styles.fieldLabel}>No. Rekening Tujuan</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={rekeningTujuan}
                  onChange={handleRekeningChange}
                  style={styles.monospacedInput}
                  placeholder="Masukkan nomor rekening penerima (angka saja)..."
                />
              </div>
            </div>

            {/* SISI KANAN: LIVE CALCULATOR */}
            <div style={styles.calculatorSideColumn}>
              <div>
                <h3 style={styles.calcSideTitle}>Ringkasan Konversi</h3>
                
                <div style={styles.calcRowsContainer}>
                  <div style={styles.summaryRow}>
                    <span>Kurs Terkini</span>
                    <span style={styles.boldTextDark}>{kalkulasi.kursTeks}</span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span>Hasil Bersih Konversi</span>
                    <span style={styles.boldTextEmerald}>
                      {(kalkulasi.hasilKonversi || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencyTo?.id?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={styles.summaryRow}>
                    <span>Biaya Administrasi</span>
                    <span style={styles.semiBoldTextDark}>
                      {(kalkulasi.biayaTransaksi || 0).toLocaleString('id-ID', { maximumFractionDigits: 2 })} {currencyFrom?.id?.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={styles.totalSummaryRow}>
                    <span>Total Biaya Potong Saldo</span>
                    <span style={styles.boldTextBlue}>
                      {(kalkulasi.totalBiaya || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currencyFrom?.id?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <button type="button" onClick={handleNextSubmit} style={styles.btnSubmitConfirmation}>
                  Konfirmasi & Bayar
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  dashboardWrapper: { width: '100%', maxWidth: '1050px', padding: '40px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left' },
  brandSection: { display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' },
  logoContainer: { display: 'flex', alignItems: 'center', textAlign: 'left' },
  logoTextBlue: { fontWeight: '800', fontSize: '32px', color: '#1a56db' },
  logoTextLightBlue: { fontWeight: '800', fontSize: '32px', color: '#60a5fa' },
  
  navMenu: { display: 'flex', gap: '16px', alignItems: 'center' },
  navItemHome: { cursor: 'pointer', color: '#1a56db', fontWeight: '700', fontSize: '15px', background: '#eff6ff', padding: '8px 16px', borderRadius: '10px' },
  navItemNotif: { cursor: 'pointer', color: '#1a56db', fontWeight: '700', fontSize: '15px', background: '#eff6ff', padding: '8px 16px', borderRadius: '10px' },
  navItemLogout: { cursor: 'pointer', color: '#ef4444', fontWeight: '700', fontSize: '15px', background: '#fef2f2', padding: '8px 16px', borderRadius: '10px' },
  
  mainContent: { width: '100%', margin: 0, padding: 0, textAlign: 'left' },
  
  splitGridCard: { background: '#ffffff', borderRadius: '24px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', minHeight: '450px', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', border: '1px solid #e2e8f0', textAlign: 'left' },
  formSideColumn: { display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left', alignItems: 'stretch' },
  columnTitle: { fontSize: '18px', fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', textAlign: 'left' },
  
  inputFormGroup: { display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', alignItems: 'flex-start' },
  fieldLabel: { fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', textAlign: 'left', display: 'block', width: '100%' },
  anchorContainer: { position: 'relative', width: '100%', textAlign: 'left' },
  dropdownSelectorTrigger: { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: '600', color: '#1e293b', cursor: 'pointer' },
  
  flagLabelGroup: { display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left' },
  circleFlagIcon: { width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #e2e8f0' },
  circleFlagIconSmall: { width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' },
  
  dropdownMenuOverlay: { position: 'absolute', width: '100%', marginTop: '4px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', zIndex: 99, maxHeight: '180px', overflowY: 'auto', padding: '4px', textAlign: 'left' },
  dropdownItemOption: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: '500', color: '#334155', textAlign: 'left' },
  
  suffixInputAnchor: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
  largeNumericInput: { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 60px 10px 16px', fontSize: '18px', fontWeight: '700', color: '#1a56db', outline: 'none', textAlign: 'left' },
  suffixCurrencyBadge: { position: 'absolute', right: '16px', fontWeight: '700', color: '#64748b', fontSize: '14px', pointerEvents: 'none' },
  
  monospacedInput: { width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', fontWeight: '500', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.05em', textAlign: 'left' },
  
  calculatorSideColumn: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'left' },
  calcSideTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', textAlign: 'left' },
  calcRowsContainer: { display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', fontWeight: '500', color: '#64748b', textAlign: 'left' },
  
  summaryRow: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' },
  totalSummaryRow: { display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '14px', fontWeight: '700', color: '#1e293b' },
  
  boldTextDark: { fontWeight: '700', color: '#0f172a' },
  semiBoldTextDark: { fontWeight: '600', color: '#1e293b' },
  boldTextEmerald: { fontWeight: '700', color: '#10b981', fontSize: '15px' },
  boldTextBlue: { fontWeight: '700', color: '#1a56db' },
  
  btnSubmitConfirmation: { width: '100%', background: '#1a56db', color: '#ffffff', padding: '12px 0', borderRadius: '12px', fontWeight: '700', fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(26, 86, 219, 0.2)' }
};