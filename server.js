// server.js
const app = require('./app'); // Import the app
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.info(`Application running at http://localhost:${port}`);
});

// Optional: handle graceful shutdown
const shutdown = () => {
    server.close(() => {
        console.info('Server closed');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
