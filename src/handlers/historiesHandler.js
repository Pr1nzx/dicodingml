const { getAllPredictions } = require('../services/firestoreService');

const getHistoriesHandler = async (request, h) => {
    try {
        const data = await getAllPredictions();
        return h.response({
            status: 'success',
            data,
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            status: 'fail',
            message: 'Gagal mengambil riwayat prediksi',
        }).code(500);
    }
};

module.exports = { getHistoriesHandler };