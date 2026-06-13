import React, { useState, useEffect } from 'react';
import { IoPaperPlaneOutline, IoChevronBack, IoWalletOutline, IoBusinessOutline, IoLockClosedOutline } from 'react-icons/io5';

const TRANSLATIONS = {
  id: {
    title: 'Lengkapi Detail Transfer',
    subtitle: 'Harap isi informasi rekening dan domisili fisik penerima luar negeri dengan benar.',
    sec1Title: 'Informasi Rekening Tujuan',
    lblCountry: 'Negara Bank Tujuan',
    lblCustomerType: 'Tipe Nasabah',
    phCustomerType: 'Pilih Tipe Nasabah',
    optIndividual: 'Perorangan (Individual)',
    optCorporate: 'Perusahaan (Corporate)',
    lblFullName: 'Nama Lengkap Penerima',
    phFullName: 'Sesuai nama pada buku rekening',
    lblAccType: 'Jenis Rekening',
    phAccType: 'Pilih Jenis Rekening',
    lblAccNo: 'Nomor Rekening / IBAN',
    phAccNo: 'Masukkan nomor akun atau kode IBAN',
    lblEmail: 'Email Penerima (Opsional)',
    phEmail: 'nama@email.com (Untuk notifikasi resi)',
    sec2Title: 'Hubungan & Domisili Alamat',
    lblRelation: 'Hubungan Bisnis / Sosial',
    phRelation: 'Misal: Keluarga, Mitra Bisnis, Biaya Kuliah',
    lblRecipientCountry: 'Negara Penerima',
    lblAddress: 'Nama Jalan / No. Rumah',
    phAddress: 'Contoh: 123 Baker Street',
    lblCity: 'Kota',
    phCity: 'Nama Kota',
    lblPostalCode: 'Kode Pos',
    phPostalCode: 'Kode Pos',
    summaryTitle: 'Ringkasan Transfer',
    nominal: 'Nominal Transfer',
    adminFee: 'Biaya Administrasi',
    method: 'Metode Pengiriman',
    total: 'Total Potong Saldo',
    btnPay: 'Bayar Sekarang',
    btnBack: 'KEMBALI',
    securityTitle: 'Enkripsi Bank Level 256-bit',
    securityDesc: 'Dana Anda dilindungi dengan standar kepatuhan regulasi internasional.'
  },
  en: {
    title: 'Complete Transfer Details',
    subtitle: 'Please fill in the recipient\'s account and physical address information correctly.',
    sec1Title: 'Recipient Account Information',
    lblCountry: 'Destination Bank Country',
    lblCustomerType: 'Customer Type',
    phCustomerType: 'Select Customer Type',
    optIndividual: 'Individual',
    optCorporate: 'Corporate',
    lblFullName: 'Recipient Full Name',
    phFullName: 'As shown in the bank account book',
    lblAccType: 'Account Type',
    phAccType: 'Select Account Type',
    lblAccNo: 'Account Number / IBAN',
    phAccNo: 'Enter account number or IBAN code',
    lblEmail: 'Recipient Email (Optional)',
    phEmail: 'name@email.com (For receipt notifications)',
    sec2Title: 'Relationship & Physical Address',
    lblRelation: 'Business / Social Relationship',
    phRelation: 'e.g., Family, Business Partner, Tuition Fee',
    lblRecipientCountry: 'Recipient Country',
    lblAddress: 'Street Name / House No.',
    phAddress: 'e.g., 123 Baker Street',
    lblCity: 'City',
    phCity: 'City Name',
    lblPostalCode: 'Postal Code',
    phPostalCode: 'Postal Code',
    summaryTitle: 'Transfer Summary',
    nominal: 'Transfer Amount',
    adminFee: 'Administration Fee',
    method: 'Delivery Method',
    total: 'Total Deducted Balance',
    btnPay: 'Pay Now',
    btnBack: 'BACK',
    securityTitle: '256-bit Bank-Level Encryption',
    securityDesc: 'Your funds are secured with international regulatory compliance standards.'
  }
};

const COUNTRY_MAP = {
  IDR: { code: 'id', country: 'Indonesia' },
  USD: { code: 'us', country: 'United States' },
  MYR: { code: 'my', country: 'Malaysia' },
  SGD: { code: 'sg', country: 'Singapore' }
};

export default function ProsesInternasional({ initialData, onBack, onNavigate, onLogout, onPaymentSuccess, currentLocale = 'id', Icons = {} }) {
  const targetCurrency = initialData?.mataUang?.toUpperCase() || 'USD';
  const countryDetail = COUNTRY_MAP[targetCurrency] || { code: 'us', country: 'United States' };
  const t = TRANSLATIONS[currentLocale] || TRANSLATIONS.id;

  const [formData, setFormData] = useState({
    tipeNasabah: '',
    namaPenerima: '',
    jenisRekening: '',
    rekeningTujuan: initialData?.rekeningTujuan || '',
    emailPenerima: '',
    hubungan: '',
    negara: countryDetail.country,
    detailAlamat: '',
    kota: '',
    kodePos: ''
  });

  useEffect(() => {
    setFormData(prev => ({ 
      ...prev, 
      negara: countryDetail.country, 
      rekeningTujuan: initialData?.rekeningTujuan || prev.rekeningTujuan 
    }));
  }, [targetCurrency, initialData?.rekeningTujuan, countryDetail.country]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.namaPenerima.trim() !== '' && formData.rekeningTujuan.trim() !== '';

  const handleSubmitPayment = () => {
    try {
      console.log("--- PROSES SUBMIT INTERNASIONAL ---");
      console.log("Form Data saat ini:", formData);
      console.log("Initial Data dari halaman sebelumnya:", initialData);

      if (typeof onPaymentSuccess === 'function') {
        onPaymentSuccess({ 
          ...initialData, 
          ...formData,
          rekeningTujuan: formData.rekeningTujuan, 
          namaPenerima: formData.namaPenerima,     
          tanggalTransaksi: new Date().toISOString() 
        });
      } else {
        console.error("Gagal mengirim data: Props 'onPaymentSuccess' tidak dikirim atau bukan sebuah fungsi dari App.jsx!");
        alert("Terjadi kesalahan sistem: Fungsi pembayaran tidak merespon.");
      }
    } catch (error) {
      console.error("Crash terdeteksi di handleSubmitPayment:", error);
      alert("Terjadi kesalahan pada komponen induk saat menerima data form: " + error.message);
    }
  };

  const nominalTransfer = initialData?.nominalValas || 0;
  const biayaAdmin = initialData?.totalBiayaAdmin || 25000;
  const totalBayar = initialData?.totalBayarIdr || 0;
  const mataUangAsal = initialData?.mataUangAsal || 'IDR';
  const numberLocale = currentLocale === 'id' ? 'id-ID' : 'en-US';

  return (
    <div style={styles.container}>
      {/* HEADER UTAMA */}
      <header style={styles.header}>
        <div style={styles.logoContainer} onClick={onBack}>
          <span style={styles.logoTextBlue}>TrustPay</span>
          <span style={styles.logoTextLightBlue}>.id</span>
          {Icons.Shield}
        </div>

        <nav style={styles.navMenu}>
          <div style={styles.navItemContainerActive}>
            <span onClick={onBack} style={styles.navItemActive}>Home</span>
          </div>
          <div style={styles.navItemContainer}>
            <span onClick={() => alert('Belum ada notifikasi baru.')} style={styles.navItem}>Notifikasi</span>
          </div>
          <div style={styles.navItemContainer}>
            <span onClick={onLogout} style={styles.navItemLogout}>Logout</span>
          </div>
        </nav>
      </header>

      <div style={styles.dashboardWrapper}>
        {/* Tombol Kembali Mini */}
        <div style={{ marginTop: '20px', marginBottom: '10px' }}>
          <button type="button" onClick={onBack} style={styles.btnBack}>
            <IoChevronBack style={{ marginRight: '4px' }} /> {t.btnBack}
          </button>
        </div>

        {/* Judul Halaman */}
        <div style={styles.titleWrapper}>
          <h2 style={styles.pageTitle}>{t.title}</h2>
          <p style={styles.pageSubtitle}>{t.subtitle}</p>
        </div>

        {/* Layout Utama Grid */}
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            {/* Seksi 1: Informasi Rekening */}
            <div style={styles.cardSection}>
              <div style={styles.sectionTitle}>
                <IoWalletOutline style={styles.sectionIcon} /> {t.sec1Title}
              </div>
              
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>{t.lblCustomerType}</label>
                  <select value={formData.tipeNasabah} onChange={(e) => handleChange('tipeNasabah', e.target.value)} style={styles.inputField}>
                    <option value="">{t.phCustomerType}</option>
                    <option value="Perorangan">{t.optIndividual}</option>
                    <option value="Perusahaan">{t.optCorporate}</option>
                  </select>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>{t.lblFullName}</label>
                  <input type="text" placeholder={t.phFullName} value={formData.namaPenerima} onChange={(e) => handleChange('namaPenerima', e.target.value)} style={styles.inputField} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel}>{t.lblAccNo}</label>
                <input type="text" placeholder={t.phAccNo} value={formData.rekeningTujuan} onChange={(e) => handleChange('rekeningTujuan', e.target.value)} style={styles.inputField} />
              </div>
              
              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel}>{t.lblEmail}</label>
                <input type="email" placeholder={t.phEmail} value={formData.emailPenerima} onChange={(e) => handleChange('emailPenerima', e.target.value)} style={styles.inputField} />
              </div>
            </div>

            {/* Seksi 2: Alamat Domisili */}
            <div style={{...styles.cardSection, marginTop: '20px'}}>
              <div style={styles.sectionTitle}>
                <IoBusinessOutline style={styles.sectionIcon} /> {t.sec2Title}
              </div>
              
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>{t.lblRelation}</label>
                  <input type="text" placeholder={t.phRelation} value={formData.hubungan} onChange={(e) => handleChange('hubungan', e.target.value)} style={styles.inputField} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>{t.lblRecipientCountry}</label>
                  <input type="text" value={formData.negara} disabled style={{...styles.inputField, background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed'}} />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.fieldLabel}>{t.lblAddress}</label>
                <input type="text" placeholder={t.phAddress} value={formData.detailAlamat} onChange={(e) => handleChange('detailAlamat', e.target.value)} style={styles.inputField} />
              </div>

              <div style={styles.formGrid3}>
                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>{t.lblCity}</label>
                  <input type="text" placeholder={t.phCity} value={formData.kota} onChange={(e) => handleChange('kota', e.target.value)} style={styles.inputField} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.fieldLabel}>{t.lblPostalCode}</label>
                  <input type="text" placeholder={t.phPostalCode} value={formData.kodePos} onChange={(e) => handleChange('kodePos', e.target.value)} style={styles.inputField} />
                </div>
              </div>
            </div>
          </div>

          {/* Kanan / Sidebar Summary */}
          <div style={styles.rightColumn}>
            <div style={styles.sidebarStickyBox}>
              <h3 style={styles.sidebarTitle}>{t.summaryTitle}</h3>
              
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t.nominal}</span>
                <span style={styles.summaryValue}>{nominalTransfer.toLocaleString(numberLocale)} {targetCurrency}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>{t.adminFee}</span>
                <span style={styles.summaryValue}>{biayaAdmin.toLocaleString(numberLocale)} IDR</span>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>{t.total}</span>
                <span style={styles.totalValue}>{totalBayar.toLocaleString(numberLocale)} {mataUangAsal}</span>
              </div>

              <button type="button" onClick={handleSubmitPayment} disabled={!isFormValid} style={isFormValid ? styles.btnSubmitActive : styles.btnSubmitDisabled}>
                <IoPaperPlaneOutline style={{ marginRight: '8px' }} /> {t.btnPay}
              </button>
            </div>

            {/* Proteksi Enkripsi */}
            <div style={styles.securityBox}>
              <IoLockClosedOutline style={styles.securityIcon} />
              <div>
                <h4 style={styles.securityTitle}>{t.securityTitle}</h4>
                <p style={styles.securityDesc}>{t.securityDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', 'Poppins', sans-serif" },
  dashboardWrapper: { maxWidth: '1140px', margin: '0 auto', padding: '0 24px 60px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', position: 'sticky', top: 0, zIndex: 100 },
  logoContainer: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  logoTextBlue: { color: '#1e40af', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' },
  logoTextLightBlue: { color: '#3b82f6', fontSize: '22px', fontWeight: '800' },
  navMenu: { display: 'flex', gap: '20px', alignItems: 'center' },
  navItemContainerActive: { padding: '6px 12px', background: '#eff6ff', borderRadius: '8px' },
  navItemContainer: { padding: '6px 12px' },
  navItemActive: { color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
  navItem: { color: '#64748b', fontWeight: '500', cursor: 'pointer', fontSize: '14px' },
  navItemLogout: { color: '#dc2626', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  btnBack: { display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: '600', fontSize: '13px', padding: '0' },
  titleWrapper: { margin: '16px 0 24px 0' },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' },
  pageSubtitle: { fontSize: '14px', color: '#64748b', margin: '0' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '28px', alignItems: 'start' },
  leftColumn: { display: 'flex', flexDirection: 'column' },
  rightColumn: { display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '90px' },
  cardSection: { background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.03)' },
  sectionTitle: { display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  sectionIcon: { marginRight: '8px', fontSize: '18px', color: '#2563eb' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  formGrid3: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' },
  fieldLabel: { fontSize: '12px', fontWeight: '600', color: '#475569' },
  inputField: { width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: '#334155', outline: 'none', boxSizing: 'border-box' },
  sidebarStickyBox: { background: '#ffffff', padding: '26px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.04)' },
  sidebarTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' },
  summaryItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  summaryLabel: { color: '#64748b' },
  summaryValue: { color: '#1e293b', fontWeight: '600' },
  divider: { height: '1px', background: '#e2e8f0', margin: '16px 0' },
  totalRow: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '24px' },
  totalLabel: { fontSize: '13px', color: '#475569', fontWeight: '500' },
  totalValue: { color: '#2563eb', fontWeight: '800', fontSize: '24px', letterSpacing: '-0.5px' },
  btnSubmitActive: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px', cursor: 'pointer', fontWeight: '600', fontSize: '15px' },
  btnSubmitDisabled: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: '12px', padding: '14px', cursor: 'not-allowed', fontWeight: '600', fontSize: '15px' },
  securityBox: { display: 'flex', gap: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px' },
  securityIcon: { fontSize: '24px', color: '#16a34a', flexShrink: 0 },
  securityTitle: { fontSize: '13px', fontWeight: '700', color: '#14532d', margin: '0 0 2px 0' },
  securityDesc: { fontSize: '12px', color: '#166534', margin: 0, lineHeight: '1.4' }
};