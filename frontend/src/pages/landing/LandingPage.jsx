import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <Activity className="landing-logo-icon" size={28} />
          WorkforceOS
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="btn-secondary">
            Get Started <ArrowRight size={18} />
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="hero-title">
            Optimize Your Enterprise <br />
            <span className="hero-title-highlight">With Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Streamline operations, scale your teams, and manage everything from smart scheduling to global payroll integration in one unified platform.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">
              Access Workspace
            </Link>
            <Link to="/register" className="btn-secondary">
              Book a Demo
            </Link>
          </div>
        </motion.div>

        {/* Floating UI Elements (Interactive Mockups) */}
        <div className="hero-visuals">
          <motion.div 
            className="floating-card card-metrics"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <span className="mock-metric-title">System Uptime</span>
            <span className="mock-metric-value">99.99%</span>
            <span className="mock-subtext">All systems operational</span>
          </motion.div>

          <motion.div 
            className="floating-card card-alert"
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          >
            <div className="mock-alert-header">
              <span className="mock-badge critical">Critical</span>
              <ShieldAlert size={16} color="#EF4444" />
            </div>
            <span className="mock-text">Firewall rule updated</span>
            <span className="mock-subtext">Just now &middot; IP: 10.0.0.1</span>
          </motion.div>

          <motion.div 
            className="floating-card card-task"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
          >
            <div className="mock-alert-header">
              <span className="mock-badge info">Assigned</span>
              <CheckCircle2 size={16} color="#3B82F6" />
            </div>
            <span className="mock-text">Asset LAPTOP-004 deployed</span>
            <span className="mock-subtext">To: Aarav Sharma</span>
          </motion.div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="landing-footer">
        &copy; {new Date().getFullYear()} WorkforceOS - Kinetic Enterprise. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
