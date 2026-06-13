import React, { useState } from "react";
import { IoSearchOutline, IoChevronDownOutline } from "react-icons/io5";

export default function Internasional({ onBack, onNavigate, onLogout, onSwitchToNasional, onNext }) {
  // Daftar mata uang yang diperbarui dengan komponen bendera lingkaran (CSS)
  const [currencies] = useState([
    { id: 'usd', name: 'USD (US Dollar)', flag: '🇺🇸', rate: 16000 },
    { id: 'sgd', name: 'SGD (Singapore Dollar)', flag: '🇸🇬', rate: 11800 },
    { id: 'idr', name: 'IDR (Indonesian Rupiah)', flag: '🇮🇩', rate: 1 },
    { id: 'myr', name: 'MYR (Malaysian Ringgit)', flag: '🇲🇾', rate: 3400 }
  ]);

  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleSelectCurrency = (currency) => {
    setSelectedCurrency(currency);
    setIsOpenDropdown(false);
  };

  const handleNextStep = () => {
    if (onNext && selectedCurrency) {
      onNext(selectedCurrency);
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      
      {/* 1. HEADER / NAVBAR UTAMA (Sesuai Gambar Referensi) */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "30px 10%", // Menjaga margin kanan-kiri pas sejajar dengan konten box
        backgroundColor: "#ffffff"
      }}>
        {/* Sisi Kiri: Logo TrustPay.id */}
        <div 
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
        >
          <span style={{ fontWeight: "800", fontSize: "32px", color: "#2563eb", letterSpacing: "-0.5px" }}>
            TrustPay.id
          </span>
          {/* Ikon Perisai/Shield Biru */}
          <svg width="28" height="32" viewBox="0 0 24 24" fill="#689bf6" style={{ opacity: 0.9 }}>
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        </div>

        {/* Sisi Kanan: Menu Navigasi */}
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          {/* Menu Home Aktif dengan border bawah biru sesuai screenshot */}
          <div style={{ position: "relative", paddingBottom: "4px" }}>
            <span 
              onClick={onBack} 
              style={{ fontWeight: "700", cursor: "pointer", color: "#2563eb", fontSize: "16px" }}
            >
              Home
            </span>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", backgroundColor: "#2563eb", borderRadius: "2px" }} />
          </div>

          <span 
            onClick={() => onNavigate('notifikasi')} 
            style={{ fontWeight: "700", cursor: "pointer", color: "#1e293b", fontSize: "16px" }}
          >
            Notifikasi
          </span>
          
          <span 
            onClick={onLogout} 
            style={{ fontWeight: "700", cursor: "pointer", color: "#ef4444", fontSize: "16px" }}
          >
            Logout
          </span>
        </div>
      </div>

      {/* 2. AREA KONTEN TENGAH */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingBottom: '60px'
      }}>
        
        {/* KARTU UTAMA (FORM BOX) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '40px 50px',
          width: '100%',
          maxWidth: '650px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          
          {/* TAB BUTTONS (SEND & INTERNASIONAL) */}
          <div style={{ display: 'flex', gap: '15px', width: '100%', marginBottom: '40px' }}>
            <button 
              onClick={onSwitchToNasional}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 24px',
                border: '1px solid #2563eb',
                borderRadius: '20px',
                background: 'transparent',
                color: '#2563eb',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ➔ SEND
            </button>
            <button 
              style={{
                padding: '8px 24px',
                border: '1px solid #cbd5e1',
                borderRadius: '20px',
                background: '#e0e7ff',
                color: '#000000',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Internasional
            </button>
          </div>

          {/* JUDUL */}
          <h2 style={{ 
            margin: '0 0 25px 0', 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#000000',
            textAlign: 'center'
          }}>
            Pilih Mata Uang
          </h2>

          {/* CUSTOM DROPDOWN / SEARCH BAR */}
          <div style={{ position: 'relative', width: '100%', marginBottom: '80px' }}>
            <div 
              onClick={() => setIsOpenDropdown(!isOpenDropdown)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                border: '1px solid #cbd5e1',
                borderRadius: '30px',
                cursor: 'pointer',
                backgroundColor: '#e6eaf3'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4a5568' }}>
                <IoSearchOutline size={20} />
                {selectedCurrency ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Wadah Ikon Bendera Lingkaran */}
                    <div style={{
                      width: '24px', height: '24px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f1f5f9', 
                      fontSize: '18px', overflow: 'hidden'
                    }}>
                      {selectedCurrency.flag}
                    </div>
                    <span style={{ fontWeight: '500', color: '#1a202c' }}>{selectedCurrency.name}</span>
                  </div>
                ) : (
                  <span style={{ fontWeight: '500', color: '#718096' }}>Cari Mata Uang</span>
                )}
              </div>
              <IoChevronDownOutline size={18} color="#4a5568" />
            </div>

            {/* HALAMAN MENU DROPDOWN LIST */}
            {isOpenDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                marginTop: '8px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                zIndex: 10,
                maxHeight: '240px',
                overflowY: 'auto'
              }}>
                {currencies.map((curr) => (
                  <div 
                    key={curr.id}
                    onClick={() => handleSelectCurrency(curr)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 20px',
                      cursor: 'pointer',
                      backgroundColor: selectedCurrency?.id === curr.id ? '#e0e7ff' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCurrency?.id === curr.id ? '#e0e7ff' : 'transparent'}
                  >
                    {/* Bundaran untuk Efek Bendera Lingkaran */}
                    <div style={{
                      width: '24px', height: '24px', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', borderRadius: '50%', backgroundColor: '#f1f5f9', 
                      fontSize: '18px', overflow: 'hidden'
                    }}>
                      {curr.flag}
                    </div>
                    <span style={{ fontWeight: '500', color: '#1a202c' }}>{curr.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TOMBOL LANJUT */}
          <button 
            onClick={handleNextStep}
            disabled={!selectedCurrency}
            style={{
              padding: '10px 50px',
              background: '#e0e7ff',
              color: '#000000',
              border: '1px solid #cbd5e1',
              borderRadius: '20px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: selectedCurrency ? 'pointer' : 'not-allowed',
              opacity: selectedCurrency ? 1 : 0.6,
              transition: 'all 0.2s'
            }}
          >
            Lanjut
          </button>

        </div>
      </div>
    </div>
  );
}