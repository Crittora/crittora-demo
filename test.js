import dotenv from "dotenv";
import { Crittora } from "@wutif/crittora";

dotenv.config();

// Add debug logging
console.log("Environment variables loaded:");
console.log("API_KEY:", process.env.API_KEY ? "Present" : "Missing");
console.log("ACCESS_KEY:", process.env.ACCESS_KEY ? "Present" : "Missing");
console.log("SECRET_KEY:", process.env.SECRET_KEY ? "Present" : "Missing");

async function testCrittora() {
  try {
    // Initialize Crittora
    const crittora = new Crittora();

    // Authenticate
    console.log("Authenticating...");
    const authResult = await crittora.authenticate(
      process.env.CRITTORA_USERNAME,
      process.env.CRITTORA_PASSWORD
    );
    console.log("Authentication successful!");
    console.log("ID Token:", authResult.IdToken.substring(0, 20) + "...");

    // Test encryption
    console.log("\nTesting encryption...");
    const testData = "Hello, Crittora!";
    const encryptedData = await crittora.encrypt(authResult.IdToken, testData);
    console.log("Encrypted data:", encryptedData);

    // Test decryption
    console.log("\nTesting decryption...");
    const decryptResult = await crittora.decrypt(
      authResult.IdToken, // Add idToken as first parameter
      encryptedData
    );
    console.log("Decrypted data:", decryptResult);

    // Test sign-encrypt
    console.log("\nTesting sign-encrypt...");
    const signEncryptData = "Hello, Crittora with signature!";
    const signEncryptedData = await crittora.signEncrypt(
      authResult.IdToken,
      signEncryptData
    );
    console.log("Sign-encrypted data:", signEncryptedData);

    // Test decrypt-verify
    console.log("\nTesting decrypt-verify...");
    const decryptVerifyResult = await crittora.decryptVerify(
      authResult.IdToken,
      signEncryptedData
    );
    console.log("Decrypt-verify result:", decryptVerifyResult);
    console.log("Decrypted data:", decryptVerifyResult.decrypted_data);
    console.log(
      "Signature verification:",
      decryptVerifyResult.signature_verified ? "Success" : "Failed"
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

testCrittora();
