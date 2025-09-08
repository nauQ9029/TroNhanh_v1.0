const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("tro_nhanh");
    const accommodations = db.collection("accommodations");
    const users = db.collection("users");

    const owner = await users.findOne({ role: "owner" });
    if (!owner) {
      console.error("❌ No user found with role 'owner'");
      return;
    }

    const ownerId = owner._id;
    let updated = 0;

    const cursor = accommodations.find();
    while (await cursor.hasNext()) {
      const acc = await cursor.next();

      const updateFields = {};
      if (!acc.ownerId) {
        updateFields.ownerId = ownerId;
      }

      const location = acc.location || {};
      if (
        typeof location.latitude === "number" &&
        typeof location.longitude === "number"
      ) {
        if (!Array.isArray(acc.mapPosition) || acc.mapPosition.length !== 2) {
          updateFields.mapPosition = [location.longitude, location.latitude];
        }
      }

      if (Object.keys(updateFields).length > 0) {
        await accommodations.updateOne(
          { _id: acc._id },
          { $set: updateFields }
        );
        updated++;
      }
    }

    console.log(
      `✅ ${updated} accommodation(s) updated with ownerId and mapPosition.`
    );
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();
