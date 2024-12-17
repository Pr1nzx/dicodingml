const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const predictionsCollection = firestore.collection('predictions');

const savePrediction = async ({ id, result, suggestion, createdAt }) => {
    await predictionsCollection.doc(id).set({ id, result, suggestion, createdAt });
};

const getAllPredictions = async () => {
    const snapshot = await predictionsCollection.get();
    return snapshot.docs.map(doc => ({
        id: doc.id,
        history: doc.data(),
    }));
};

module.exports = { savePrediction, getAllPredictions };