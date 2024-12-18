const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeImage(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        const classes = ['Cancer', 'Non-cancer'];
        const suggestions = ['Segera periksa ke dokter!', 'Penyakit kanker tidak terdeteksi.'];
        const prediction = model.predict(tensor);
        const scores = await prediction.data();

        const confidenceScore = Math.max(...scores) * 100;
        const result = confidenceScore > 99 ? classes[0] : classes[1];
        let suggestion;
        if (result === classes[0]) {
            suggestion = suggestions[0];
        }

        if (result === classes[1]) {
            suggestion = suggestions[1];
        }

        return { result, suggestion, confidenceScore };
    } catch (error) {
        throw new InputError(`Kesalahan saat melakukan prediksi: ${error.message}`);
    }
}

module.exports = predictClassification;