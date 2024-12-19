const predictClassification = require('../service/inferenceService');
const storeData = require('../service/storeData');
const { Firestore } = require('@google-cloud/firestore');
const crypto = require('crypto');


const COLLECTION_NAME = 'predictions';
const ERROR_MESSAGES = {
  PREDICTION_FAILED: 'Terjadi kesalahan dalam melakukan prediksi',
  FETCH_FAILED: 'Gagal mengambil riwayat prediksi',
};


async function postPredictHandler(request, h) {
    try {
        const { image } = request.payload;
        const { model } = request.server.app;

    
        if (!image?._data) {
            return h.response({
                status: 'fail',
                message: 'Data gambar tidak valid',
            }).code(400);
        }

     
        const { result, suggestion } = await predictClassification(model, image._data);
        
   
        const predictionData = {
            id: crypto.randomUUID(),
            result,
            suggestion,
            createdAt: new Date().toISOString(),
            metadata: {
                processedAt: new Date().toISOString(),
                imageSize: image._data.length
            }
        };

      
        await storeData(predictionData.id, predictionData);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: predictionData,
        }).code(201);

    } catch (error) {
        console.error('Prediction error:', error);
        return h.response({
            status: 'fail',
            message: ERROR_MESSAGES.PREDICTION_FAILED,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }).code(400);
    }
}


async function getPredictionHistoriesHandler(request, h) {
    try {
        const db = new Firestore();
        const predictCollection = db.collection(COLLECTION_NAME);
        

        const { limit = 100, orderBy = 'createdAt', order = 'desc' } = request.query;
        
        let query = predictCollection;
        query = query.orderBy(orderBy, order);
        query = query.limit(parseInt(limit));
        
        const snapshot = await query.get();

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            history: {
                ...doc.data(),
                createdAt: doc.data().createdAt
            }
        }));

        return h.response({
            status: 'success',
            data,
            metadata: {
                count: data.length,
                retrievedAt: new Date().toISOString()
            }
        }).code(200);

    } catch (error) {
        console.error('Fetch history error:', error);
        return h.response({
            status: 'fail',
            message: ERROR_MESSAGES.FETCH_FAILED,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }).code(500);
    }
}

module.exports = { 
    postPredictHandler, 
    getPredictionHistoriesHandler 
};