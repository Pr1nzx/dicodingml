const { savePrediction } = require('../services/firestoreService');
const { processImageAndPredict } = require('../services/modelService');
const { v4: uuidv4 } = require('uuid');

const predictHandler = async (request, h) => {
    try {
        const { file } = request.payload.image;

        const imageBuffer = await new Promise((resolve, reject) => {
            const chunks = [];
            file.on('data', chunk => chunks.push(chunk));
            file.on('end', () => resolve(Buffer.concat(chunks)));
            file.on('error', reject);
        });

        const { result, suggestion } = await processImageAndPredict(imageBuffer);

        const id = uuidv4();
        const createdAt = new Date().toISOString();
        await savePrediction({ id, result, suggestion, createdAt });

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: { id, result, suggestion, createdAt },
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
    }
};

module.exports = { predictHandler };