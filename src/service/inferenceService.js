const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

const MODEL_CONFIG = {
    IMAGE_SIZE: [224, 224],
    CONFIDENCE_THRESHOLD: 99,
    CLASSES: {
        CANCER: 'Cancer',
        NON_CANCER: 'Non-cancer'
    },
    SUGGESTIONS: {
        CANCER: 'Segera periksa ke dokter!',
        NON_CANCER: 'Penyakit kanker tidak terdeteksi.'
    }
};

/**
 * 
 * @param {Buffer} image 
 * @returns {tf.Tensor} 
 */
function preprocessImage(image) {
    return tf.node
        .decodeImage(image)
        .resizeNearestNeighbor(MODEL_CONFIG.IMAGE_SIZE)
        .expandDims()
        .toFloat();
}

/**
 * 
 * @param {string} result 
 * @returns {string} 
 */
function getSuggestion(result) {
    return result === MODEL_CONFIG.CLASSES.CANCER 
        ? MODEL_CONFIG.SUGGESTIONS.CANCER 
        : MODEL_CONFIG.SUGGESTIONS.NON_CANCER;
}

/**
 * 
 * @param {tf.GraphModel} model 
 * @param {Buffer} image
 * @returns {Promise<Object>} 
 * @throws {InputError} 
 */
async function predictClassification(model, image) {
    try {
       
        const tensor = preprocessImage(image);

       
        const prediction = model.predict(tensor);
        const scores = await prediction.data();

       
        const confidenceScore = Math.max(...scores) * 100;
        const result = confidenceScore > MODEL_CONFIG.CONFIDENCE_THRESHOLD 
            ? MODEL_CONFIG.CLASSES.CANCER 
            : MODEL_CONFIG.CLASSES.NON_CANCER;

        
        const suggestion = getSuggestion(result);

        // Cleanup
        tensor.dispose();
        prediction.dispose();

        return { 
            result, 
            suggestion, 
            confidenceScore: parseFloat(confidenceScore.toFixed(2)),
            metadata: {
                processedAt: new Date().toISOString(),
                modelConfig: {
                    imageSize: MODEL_CONFIG.IMAGE_SIZE,
                    threshold: MODEL_CONFIG.CONFIDENCE_THRESHOLD
                }
            }
        };
    } catch (error) {
        throw new InputError(`Kesalahan saat melakukan prediksi: ${error.message}`);
    }
}

module.exports = predictClassification;