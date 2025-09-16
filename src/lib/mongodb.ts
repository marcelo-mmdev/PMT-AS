/* eslint-disable prefer-const */
import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("⚠️ Defina a variável MONGODB_URI em .env.local")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose || { conn: null, promise: null }

export default async function dbConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  return cached.conn
}
