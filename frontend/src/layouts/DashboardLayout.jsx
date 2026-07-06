import { Outlet } from 'react-router-dom';
import AdvancedNavbar from '../components/AdvancedNavbar';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* ── Main Top Navbar ── */}
      <AdvancedNavbar />

      {/* ── Main Content Area ── */}
      <main className="flex-1 overflow-y-auto p-0">
        <Outlet />
      </main>
    </div>
  );
}
