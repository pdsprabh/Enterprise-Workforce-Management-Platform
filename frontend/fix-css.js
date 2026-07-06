const fs = require('fs');

const css = `
/* New Kinetic Enterprise Components */

.header-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.kinetic-input, .kinetic-search {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.2s ease;
}

.kinetic-input:focus, .kinetic-search:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-high { background: rgba(239, 68, 68, 0.15); color: #EF4444; }
.badge-medium { background: rgba(245, 158, 11, 0.15); color: #F59E0B; }
.badge-low { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.badge-info { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }

.kinetic-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.kinetic-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  font-size: 14px;
}

.kinetic-table td {
  padding: 16px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.task-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 4px solid #3B82F6;
}

.task-item.priority-high { border-left-color: #EF4444; }
.task-item.priority-medium { border-left-color: #F59E0B; }

.pipeline-multi {
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  gap: 2px;
  margin-top: 16px;
  background: rgba(255, 255, 255, 0.1);
}
.pipeline-stage { height: 100%; }
.pipeline-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.glow-green { box-shadow: 0 0 20px rgba(16, 185, 129, 0.1) inset; }
.glow-blue { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1) inset; }
.glow-purple { box-shadow: 0 0 20px rgba(139, 92, 246, 0.1) inset; }

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(4, 19, 41, 0.8);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 12px;
  width: 400px;
  backdrop-filter: blur(10px);
}

.alert-feed {
  display: flex; flex-direction: column; gap: 12px; margin-top: 16px;
}
.alert-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.05);
}
.alert-item.critical { border-left: 3px solid #EF4444; }
.alert-item.warning { border-left: 3px solid #F59E0B; }
.alert-item p { margin: 0; font-size: 14px; }
.alert-item span { font-size: 12px; color: rgba(255, 255, 255, 0.5); }
`;

fs.appendFileSync('src/pages/dashboards/DashboardTheme.css', css);
console.log('Appended clean CSS');
