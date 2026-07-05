import { Outlet } from 'react-router-dom';
import Topbar from '../components/Topbar';
import SideRays from '../components/ui/SideRays';
import StaggeredMenu from '../components/ui/StaggeredMenu';
import { NAV_SECTIONS } from '../utils/constants';
import './DashboardLayout.css';

// Flatten all nav sections into StaggeredMenu items
const MENU_ITEMS = NAV_SECTIONS.flatMap(section =>
  section.items.map(item => ({
    label: item.label,
    ariaLabel: `Go to ${item.label}`,
    link: item.path,
  }))
);

const SOCIAL_ITEMS = [
  { label: 'GitHub',   link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' },
];

export default function DashboardLayout() {
  return (
    <div className="dashboard-layout">

      {/* ── SideRays WebGL background (z-index: 0) ── */}
      <div className="dashboard-layout__rays" aria-hidden="true">
        <SideRays
          speed={1.8}
          rayColor1="#6366f1"
          rayColor2="#818cf8"
          intensity={2.2}
          spread={2.2}
          origin="top-right"
          tilt={-5}
          saturation={1.6}
          blend={0.65}
          falloff={1.8}
          opacity={0.7}
        />
      </div>

      {/* ── StaggeredMenu — left side, replaces old Sidebar ── */}
      <div className="dashboard-staggered-menu">
        <StaggeredMenu
          position="left"
          items={MENU_ITEMS}
          socialItems={SOCIAL_ITEMS}
          displaySocials={true}
          displayItemNumbering={true}
          colors={['#1e2030', '#6366f1']}
          accentColor="#818cf8"
          menuButtonColor="#c7d1db"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          closeOnClickAway={true}
          logoText="Workforce.io"
          isFixed={false}
        />
      </div>

      {/* ── Main area ── */}
      <div className="dashboard-layout__main">
        <Topbar />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
