const tf = require('@tensorflow/tfjs-node');
async function loadModel() {
    return tf.loadGraphModel('https://storage.googleapis.com/bucket-capstone-project/model.json');// isi sesuai bucket model jika tidak menggunakan env
}
module.exports = loadModel;