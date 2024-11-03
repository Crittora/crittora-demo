import express from "express";
import { Crittora } from "@wutif/crittora";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Add startup logging
console.log("Starting server initialization...");
dotenv.config();
console.log("Environment variables loaded");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
console.log("Express app created");

app.use(express.json());
app.use(express.static("public"));
console.log("Middleware configured");

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Authentication endpoint
app.post("/api/authenticate", async (req, res) => {
  console.log("Authentication attempt started");
  try {
    const crittora = new Crittora();
    console.log("Crittora instance created");
    const authResult = await crittora.authenticate(
      process.env.CRITTORA_USERNAME,
      process.env.CRITTORA_PASSWORD
    );
    console.log("Authentication successful");
    res.json({ token: authResult.IdToken });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: error.message });
  }
});
// Encryption endpoint
app.post("/api/encrypt", async (req, res) => {
  console.log("Encryption request received");
  try {
    const { token, data } = req.body;
    console.log("Request data validated");
    const crittora = new Crittora();
    const encryptedData = await crittora.encrypt(token, data);
    console.log("Data encrypted successfully");
    res.json({ encryptedData });
  } catch (error) {
    console.error("Encryption error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Decryption endpoint
app.post("/api/decrypt", async (req, res) => {
  console.log("Decryption request received");
  try {
    const { token, encryptedData } = req.body;
    console.log("Request data:", {
      token: token.substring(0, 20) + "...",
      encryptedData,
    });
    const crittora = new Crittora();
    const decryptedData = await crittora.decrypt(token, encryptedData);
    console.log("Decrypted result:", decryptedData);
    res.json({ decryptedData });
  } catch (error) {
    console.error("Decryption error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Enhance server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("=================================");
});
