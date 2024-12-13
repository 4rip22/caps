const { Firestore } = require("@google-cloud/firestore");
const path = require("path");

// Path to the service account key file
const pathKey = path.resolve("./project-capstone-443911-99ade98d8add.json");

async function storeData(id, data) {
  try {
    // Initialize Firestore client
    const db = new Firestore({
      projectId: "project-capstone-443911",
      keyFilename: pathKey,
    });

    // Reference to the 'predictions' collection
    const predictCollection = db.collection("predictions");

    // Store data
    await predictCollection.doc(id).set(data);
    console.log(`Data successfully stored with ID: ${id}`);
    return { success: true, id };
  } catch (error) {
    console.error("Error storing data:", error);
    throw new Error("Failed to store data in Firestore.");
  }
}

module.exports = storeData;
