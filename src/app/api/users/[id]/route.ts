import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/types/user";
//import User from "@/models/User";

// PUT /api/users/:id → editar
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { name, email, password, role } = await req.json();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { name, email, role };
  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(params.id, updateData, { new: true });
  return NextResponse.json(user);
}

// DELETE /api/users/:id → excluir
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
