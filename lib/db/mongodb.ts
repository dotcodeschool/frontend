import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Try both MONGODB_URI and DATABASE_URL to ensure compatibility
const uri = process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!uri) {
  throw new Error(
    'Invalid/Missing environment variables: Both "MONGODB_URI" and "DATABASE_URL" are missing',
  );
}

const options = {};

let client = new MongoClient(uri, options);
let clientPromise: Promise<MongoClient>;

// Log database connection details (without exposing credentials)
try {
  console.log("[MongoDB] Connecting to database:", {
    dbName: process.env.DB_NAME,
    uriExists: !!process.env.MONGODB_URI,
    databaseUrlExists: !!process.env.DATABASE_URL,
    // Only log the domain part of the connection string for security
    uriDomain: uri ? new URL(uri).hostname : "not-set",
  });
} catch (error) {
  console.error("[MongoDB] Error parsing connection URI:", error);
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { clientPromise };
