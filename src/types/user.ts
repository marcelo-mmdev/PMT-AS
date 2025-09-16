import mongoose, { Schema, Document, models } from "mongoose"

export interface IUser extends Document {
  nome: string
  email: string
  senha: string
  tipo: "admin" | "entregador"
}

const UserSchema = new Schema<IUser>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ["admin", "entregador"], default: "entregador" },
  },
  { timestamps: true }
)

export default models.User || mongoose.model<IUser>("User", UserSchema)
