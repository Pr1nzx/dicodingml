const Hapi = require('@hapi/hapi');
const predictRoutes = require('./routes/predictRoutes');
const historiesRoutes = require('./routes/historiesRoutes');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 8080,
        host: '0.0.0.0',
    });

    server.route([...predictRoutes, ...historiesRoutes]);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();