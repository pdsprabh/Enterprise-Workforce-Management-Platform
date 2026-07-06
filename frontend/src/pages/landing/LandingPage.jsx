import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9ff', color: '#0b1c30', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>WorkforceOS</div>
        <nav>
          <Link to="/login" style={{ textDecoration: 'none', color: '#0b1c30', fontWeight: '600', marginRight: '24px' }}>Login</Link>
          <Link to="/register" style={{ textDecoration: 'none', padding: '10px 24px', backgroundColor: '#10B981', color: '#ffffff', borderRadius: '8px', fontWeight: '600' }}>Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '56px', fontWeight: '700', marginBottom: '24px', color: '#0f172a', maxWidth: '800px', lineHeight: '1.2' }}>
          Optimize Your Enterprise Workforce with Intelligence
        </h1>
        <p style={{ fontSize: '20px', color: '#45464d', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6' }}>
          Streamline operations, scale your teams, and manage everything from smart scheduling to global payroll integration in one unified platform.
        </p>
        <Link to="/login" style={{ padding: '16px 32px', backgroundColor: '#10B981', color: '#ffffff', borderRadius: '8px', fontSize: '18px', fontWeight: '600', textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
          Book a Demo
        </Link>
      </main>
      
      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #E2E8F0', color: '#64748b' }}>
        &copy; {new Date().getFullYear()} WorkforceOS. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
