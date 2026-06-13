import { useState, useEffect } from 'react';

// ========================================================
// FUNGSI API (TETAP)
// ========================================================
const API = {
  defaults: { baseURL: 'TrustPay Server' },
  get: async (url) => ({ data: [] })
};

const Icons = {
  Shield: (
    <svg width="26" height="30" viewBox="0 0 24 24" fill="#60a5fa" style={{ marginLeft: '12px', display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  ),
  ListPlus: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  ListSend: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  ListExchange: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7H4m16 0l-4-4m4 4l-4 4M4 17h16M4 17l4 4m-4-4l4-4" />
    </svg>
  )
};

// PERBAIKAN: Menerima props 'notificationData' dari App.js
export default function Notifikasi({ notificationData = [], onNavigate, onLogout, onOpenReceipt }) {
  const [dbNotifications, setDbNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fungsi pencadangan jika suatu saat terhubung ke database asli backend
  const getBackendNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/notifikasi'); 
      if (Array.isArray(response?.data)) {
        setDbNotifications(response.data);
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        setDbNotifications(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal terhubung ke database server TrustPay.');
    } finally {
      setLoading(false);
    }
  };

  // Panggil API backend hanya untuk mencadangkan data jika diperlukan
  useEffect(() => { 
    getBackendNotifications(); 
  }, []);

  // PERBAIKAN: Menggabungkan data dari localStorage (App.js) dengan data Database (jika ada)
  const displayNotifications = notificationData.length > 0 ? notificationData : dbNotifications;

  const formatRupiah = (value, type) => {
    if (value === undefined || value === null || value === '') return 'Rp0';
    const stringValue = String(value).replace(/[^0-9]/g, '');
    const numericValue = stringValue ? Number(stringValue) : 0;
    const formatted = numericValue.toLocaleString('id-ID');
    return (type === 'plus' ? '+ Rp' : '- Rp') + formatted;
  };

  const styles = {
    container: { backgroundColor: '#f8fafc', minHeight: '100vh', width: '100vw', padding: '40px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Poppins', sans-serif" },
    dashboardWrapper: { width: '100%', maxWidth: '1050px', display: 'flex', flexDirection: 'column', gap: '20px' },
    header: { display: 'flex', alignItems: 'center', width: '100%', marginBottom: '20px', boxSizing: 'border-box' },
    brandSection: { display: 'flex', alignItems: 'center' },
    logoContainer: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
    logoTextBlue: { fontWeight: '800', fontSize: '32px', color: '#1a56db' },
    logoTextLightBlue: { fontWeight: '800', fontSize: '32px', color: '#60a5fa' },
    navMenu: { display: 'flex', gap: '25px', alignItems: 'center', marginLeft: 'auto' },
    navItem: { cursor: 'pointer', color: '#000000', fontWeight: '700', fontSize: '15px' },
    navItemActive: { cursor: 'pointer', color: '#1a56db', fontWeight: '700', fontSize: '15px', borderBottom: '3px solid #1a56db', paddingBottom: '2px' },
    navItemLogout: { cursor: 'pointer', color: '#000000', fontWeight: '700', fontSize: '15px' },
    subHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
    tabContainer: { display: 'flex', gap: '10px' },
    btnTabActive: { background: '#ffffff', color: '#1a56db', border: '2px solid #1a56db', padding: '6px 24px', borderRadius: '15px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
    btnTabInactive: { background: '#ffffff', color: '#94a3b8', border: '2px solid #e2e8f0', padding: '6px 24px', borderRadius: '15px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
    btnBantuan: { background: '#1a56db', color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    questionMark: { color: '#ffffff', backgroundColor: '#ef4444', width: '18px', height: '18px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '900' },
    pageTitle: { fontSize: '20px', fontWeight: '800', color: '#0f172a' },
    whiteCard: { width: '100%', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '40px', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    notificationRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderRadius: '16px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' },
    leftSection: { display: 'flex', alignItems: 'center', gap: '16px' },
    iconCircle: { border: '2px solid transparent', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' },
    textGroup: { display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' },
    itemTitle: { fontSize: '15px', fontWeight: '700', color: '#0f172a' },
    itemSubtitle: { fontSize: '12px', fontWeight: '500', color: '#64748b' },
    amountText: { fontSize: '15px', fontWeight: '700' },
    stateMessage: { textAlign: 'center', color: '#94a3b8', padding: '30px 0', fontWeight: '500', fontSize: '13px' }
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={styles.dashboardWrapper}>
        
        <header style={styles.header}>
          <div style={styles.brandSection}>
            <div onClick={() => onNavigate('dashboard')} style={styles.logoContainer}>
              <span style={styles.logoTextBlue}>TrustPay</span>
              <span style={styles.logoTextLightBlue}>.id</span>
              {Icons.Shield}
            </div>
          </div>
          <nav style={styles.navMenu}>
            <span style={styles.navItem} onClick={() => onNavigate('dashboard')}>Home</span>
            <span style={styles.navItemActive}>Notifikasi</span>
            <span style={styles.navItemLogout} onClick={onLogout}>Logout</span>
          </nav>
        </header>

        <div style={styles.subHeader}>
          <div style={styles.tabContainer}>
            <button type="button" style={styles.btnTabInactive} onClick={() => onNavigate('dashboard')}>Transaksi</button>
            <button type="button" style={styles.btnTabActive}>Insight</button>
          </div>
          <button type="button" style={styles.btnBantuan} onClick={() => onNavigate('pusatbantuan')}>
            <span style={styles.questionMark}>?</span> Pusat Bantuan
          </button>
        </div>

        <h2 style={styles.pageTitle}>Riwayat Notifikasi</h2>

        <main style={styles.whiteCard}>
          <div style={styles.listContainer}>
            {loading ? (
              <div style={styles.stateMessage}>Memuat data...</div>
            ) : error ? (
              <div style={styles.stateMessage}>{error}</div>
            ) : displayNotifications.length === 0 ? (
              <div style={styles.stateMessage}>Belum ada riwayat transaksi.</div>
            ) : (
              // PERBAIKAN: Looping menggunakan data gabungan (Data lokal didahulukan agar instan muncul)
              displayNotifications.map((item, index) => (
                <div key={item.id || index} style={styles.notificationRow} onClick={() => onOpenReceipt?.(item)}>
                  <div style={styles.leftSection}>
                    <div style={styles.iconCircle}>{Icons.ListExchange}</div>
                    <div style={styles.textGroup}>
                      <div style={styles.itemTitle}>{item.title || 'Transaksi'}</div>
                      <div style={styles.itemSubtitle}>{item.message || item.user || 'Transaksi Berhasil'}</div>
                    </div>
                  </div>
                  <span style={{
                    ...styles.amountText,
                    color: item.type === 'plus' ? '#2ecc71' : '#e74c3c'
                  }}>
                    {formatRupiah(item.amount, item.type)}
                  </span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}