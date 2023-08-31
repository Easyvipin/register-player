const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(bodyParser.json());

const mongoURL = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

app.use(cors());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "Missing user data" });
  }

  const user = {
    firstName,
    lastName,
    email,
  };

  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);

    const collection = db.collection("players");
    await collection.insertOne(user);

    client.close();

    res.json({ message: "User registed !", user });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "An error occurred while saving user data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
