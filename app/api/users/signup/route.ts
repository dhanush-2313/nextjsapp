import client from "@/db";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return NextResponse.json({ msg: "User already exists" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await client.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json(
      { msg: "User created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}
