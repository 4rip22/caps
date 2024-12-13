const predictClassification = require("../services/inferenceService");
const crypto = require("crypto");
const storeData = require("../services/storeData");

async function postPredictHandler(request, h) {
  try {
    const { input } = request.payload; // Mengambil angka dari payload
    const { model } = request.server.app;

    // Validasi input
    if (typeof input !== "number" || input < 1 || input > 7) {
      return h.response({
        status: "fail",
        message: "Input harus berupa angka antara 1 dan 7.",
      }).code(400);
    }

    // Perform inference (simulasikan model jika perlu)
    const { confidenceScore, label } = await predictClassification(
      model,
      input
    );

    // Konversi output model ke dalam kategori kualitas susu
    let suggestion;
    if (label === "low") {
      suggestion = "Kualitas rendah. Perlu perbaikan.";
    } else if (label === "medium") {
      suggestion = "Kualitas sedang. Sudah cukup baik.";
    } else if (label === "high") {
      suggestion = "Kualitas tinggi. Sangat baik.";
    } else {
      suggestion = "Tidak dapat menentukan kualitas.";
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Build data object
    const data = {
      id,
      input,
      result: label,
      confidenceScore,
      suggestion,
      createdAt,
    };

    // Store data in database
    await storeData(id, data);

    const message =
      confidenceScore > 99
        ? "Model berhasil memprediksi dengan sangat akurat"
        : "Model berhasil memprediksi";

    // Build response
    const response = h.response({
      status: "success",
      message,
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    return h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    }).code(400);
  }
}

async function predictHistories(request, h) {
  try {
    const { Firestore } = require("@google-cloud/firestore");
    const db = new Firestore({ projectId: "project-capstone-443911" });

    // Fetch prediction histories from Firestore
    const predictCollection = db.collection("predictions");
    const snapshot = await predictCollection.get();

    const result = [];
    snapshot.forEach((doc) => {
      result.push({
        id: doc.id,
        history: {
          id: doc.data().id,
          input: doc.data().input,
          result: doc.data().result,
          suggestion: doc.data().suggestion,
          createdAt: doc.data().createdAt,
        },
      });
    });

    // Build response
    return h.response({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return h.response({
      status: "error",
      message: "Gagal mengambil riwayat prediksi.",
    }).code(500);
  }
}

module.exports = { postPredictHandler, predictHistories };
