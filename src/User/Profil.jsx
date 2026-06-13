import { useState } from 'react';

export default function Profil({ userData, userName, userPhone, totalSaldo, onBack, onLogout }) {
  const [userMetadata] = useState({
    tipeAkun: 'Premium Member 🛡️',
  });

  const namaTampil = userData?.username || userName || 'Nasabah';
  const nomorHpTampil = userData?.nomorHp || userPhone || '+62...';
  const saldoTampil = userData?.saldo !== undefined ? userData.saldo : (totalSaldo || 0);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(angka || 0);
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.contentWrapper}>
        {/* HEADER SEDERHANA */}
        <header style={styles.header}>
          <button onClick={onBack} style={styles.btnBack}>
            Kembali
          </button>
        </header>

        {/* KARTU PROFIL */}
        <div style={styles.profileContentCard}>
          <div style={styles.avatarNameSection}>
            <div style={styles.avatarCircleFrame}>
              {namaTampil.charAt(0)}
            </div>
            <div style={styles.nameBadgeGroup}>
              <h2 style={styles.nameTitle}>{namaTampil}</h2>
              <span style={styles.badgePremium}>{userMetadata.tipeAkun}</span>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* GRID DETAIL INFORMASI */}
          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Nomor Handphone</span>
              <span style={styles.infoValue}>{nomorHpTampil}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Total Saldo Utama</span>
              <span style={{...styles.infoValue, color: '#16a34a'}}>{formatRupiah(saldoTampil)}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Status Keamanan Akun</span>
              <span style={{...styles.infoValue, color: '#2563eb'}}>Terverifikasi PIN (6 Digit)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    backgroundColor: '#f8fafc', 
    minHeight: '100vh', 
    width: '100vw', 
    display: 'flex', 
    justifyContent: 'center', 
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif" 
  },
  contentWrapper: { 
    width: '100%', 
    maxWidth: '900px', 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  header: { marginBottom: '10px' },
  btnBack: { 
    backgroundColor: '#1a56db', 
    color: '#ffffff', 
    border: 'none', 
    padding: '10px 24px', 
    borderRadius: '12px', 
    fontSize: '14px', 
    fontWeight: '700', 
    cursor: 'pointer' 
  },
  profileContentCard: { 
    width: '100%', 
    background: '#ffffff', 
    border: '1px solid #e2e8f0', 
    borderRadius: '24px', 
    padding: '40px', 
    boxSizing: 'border-box', 
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
  },
  avatarNameSection: { display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '25px' },
  avatarCircleFrame: { 
    width: '70px', 
    height: '70px', 
    backgroundColor: '#eff6ff', 
    borderRadius: '50%', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontSize: '28px', 
    fontWeight: '800', 
    color: '#1a56db', 
    border: '2px solid #bfdbfe' 
  },
  nameBadgeGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  nameTitle: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
  badgePremium: { 
    alignSelf: 'flex-start', 
    background: '#eff6ff', 
    color: '#1a56db', 
    fontSize: '11px', 
    fontWeight: '700', 
    padding: '4px 12px', 
    borderRadius: '20px', 
    border: '1px solid #bfdbfe' 
  },
  divider: { border: '0', height: '1px', background: '#e2e8f0', margin: '25px 0' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  infoRow: { 
    display: 'flex', 
    padding: '18px 20px', 
    background: '#f8fafc', 
    borderRadius: '16px', 
    border: '1px solid #e2e8f0', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  infoLabel: { color: '#64748b', fontSize: '14px', fontWeight: '600' },
  infoValue: { color: '#0f172a', fontSize: '14px', fontWeight: '700' }
};