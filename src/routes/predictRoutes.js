const { predictHandler } = require('../handlers/predictHandler');

module.exports = [
    {
        method: 'POST',
        path: '/predict',
        handler: predictHandler,
        options: {
            payload: {
                maxBytes: 1000000, // 1MB
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
            },
        },
    },
];