import * as path from 'path';
import * as admin from 'firebase-admin';
import dotenv from "dotenv";

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

try {
  if (serviceAccountJson) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
  } else if (serviceAccountPath) {
    const absolutePath = path.isAbsolute(serviceAccountPath) 
      ? serviceAccountPath 
      : path.join(process.cwd(), serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(absolutePath),
    });
  } else {
    console.warn("Firebase credentials not found in env (neither JSON nor PATH). Backend auth verification will fail.");
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

export default admin;
