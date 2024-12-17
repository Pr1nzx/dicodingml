const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');
let model;

(async () => {
    const modelUrl = 'https://storage.googleapis.com/submissionmlgc-ervandaulia/submissions-model/model.json';
    model = await tf.loadLayersModel(modelUrl);
})();

const processImageAndPredict = async (imageBuffer) => {
    const tensor = tf.node
        .decodeImage(imageBuffer)
        .resizeBilinear([224, 224])
        .expandDims(0)
        .toFloat()
        .div(tf.scalar(255));

    const predictions = model.predict(tensor).arraySync()[0];

    const result = predictions[0] > 0.5 ? 'Cancer' : 'Non-cancer';
    const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.';

    return { result, suggestion };
};

module.exports = { processImageAndPredict };