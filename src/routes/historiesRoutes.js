const { getHistoriesHandler } = require('../handlers/historiesHandler');

module.exports = [
    {
        method: 'GET',
        path: '/predict/histories',
        handler: getHistoriesHandler,
    },
];