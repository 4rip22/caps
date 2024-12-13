const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, inputNumber) {
  try {
    // Validasi input harus berupa angka
    if (typeof inputNumber !== "number") {
      throw new InputError("Input harus berupa angka.");
    }

    // Konversi angka ke tensor
    const tensor = tf.tensor1d([inputNumber]);

    // Prediksi model
    const prediction = model.predict(tensor);
    const score = await prediction.data();

    // Tentukan confidence score (misalnya jika hanya ada 1 output nilai langsung digunakan)
    const confidenceScore = score[0] * 100; // Asumsikan model memberikan probabilitas

    // Tentukan kategori berdasarkan nilai
    let label;
    if (confidenceScore <= 33) {
      label = "Low";
    } else if (confidenceScore <= 66) {
      label = "Medium";
    } else {
      label = "High";
    }

    // Saran berdasarkan label
    const suggestion =
      label === "Low"
        ? "Kualitas rendah, perlu ditingkatkan."
        : label === "Medium"
        ? "Kualitas sedang, dapat ditingkatkan."
        : "Kualitas tinggi, pertahankan!";

    return { label, confidenceScore, suggestion };
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
  }
}

module.exports = predictClassification;
