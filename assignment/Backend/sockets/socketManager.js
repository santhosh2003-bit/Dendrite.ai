module.exports = (socket) => {
    console.log('New client connected', socket.id);

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
};
