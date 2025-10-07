// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;
const options = {}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient>

if (!uri) {
  console.warn('Missing environment variable: "MONGODB_URI". App will run in offline mode.');
  // In offline mode, we'll create a promise that rejects immediately.
  // This prevents long timeouts and allows the connection check to fail gracefully.
  clientPromise = Promise.reject(new Error('Missing environment variable: "MONGODB_URI"'));
} else {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
