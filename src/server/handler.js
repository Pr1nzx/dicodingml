const predictClassification = require('../service/inferenceService');
const storeData = require('../service/storeData');
const { Firestore } = require('@google-cloud/firestore');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        const { result, suggestion } = await predictClassification(model, image._data);
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = { id, result, suggestion, createdAt };
        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        }).code(201);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi',
        }).code(400);
    }
}

async function getPredictionHistoriesHandler(request, h) {
    const db = new Firestore();
    const predictCollection = db.collection('predictions');
    const snapshot = await predictCollection.get();

    const data = snapshot.docs.map(doc => ({
        id: doc.id,
        history: doc.data(),
    }));

    return h.response({
        status: 'success',
        data,
    }).code(200);
}

module.exports = { postPredictHandler, getPredictionHistoriesHandler };