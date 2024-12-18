const { postPredictHandler, getPredictionHistoriesHandler } = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/predict',
        handler: postPredictHandler,
        options: {
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 1000000,
            },
        },
    },
    {
        method: 'GET',
        path: '/predict/histories',
        handler: getPredictionHistoriesHandler,
    },
];

module.exports = routes;