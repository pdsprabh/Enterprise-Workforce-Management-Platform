let io = null;
const userSockets = new Map(); // employeeId -> socketId

const initSocket = (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        socket.on('register', (employeeId) => {
            userSockets.set(employeeId, socket.id);
        });

        socket.on('disconnect', () => {
            for (const [employeeId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(employeeId);
                    break;
                }
            }
        });
    });

    return io;
};

const sendNotificationToEmployee = (employeeId, notification) => {
    if (!io) return;
    const socketId = userSockets.get(employeeId.toString());
    if (socketId) {
        io.to(socketId).emit('notification', notification);
    }
};

module.exports = { initSocket, sendNotificationToEmployee };