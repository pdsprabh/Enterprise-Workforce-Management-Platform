const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const http = require('http');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const assetRoutes = require('./routes/assetRoutes');
const helpdeskRoutes = require('./routes/helpdeskRoutes');
const documentRoutes = require('./routes/documentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const aiRoutes = require('./routes/aiRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const { initSocket } = require('./socket/socketManager');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const organizationRoutes = require('./routes/organizationRoutes');
const systemRoutes = require('./routes/systemRoutes');

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/helpdesk', helpdeskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/announcements', announcementRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    const server = http.createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;