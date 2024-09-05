import client from "@/db";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    console.log(email, password);
    const user = await client.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ msg: "User doesnt exists" }, { status: 400 });
    }
    console.log(user);

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ msg: "Invalid password!" }, { status: 400 });
    }
    console.log(validPassword);

    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const jwtToken = jwt.sign(tokenData, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });

    response.cookies.set("token", jwtToken, { httpOnly: true });
    return response;
  } catch (error) {
    return NextResponse.json({ msg: "Internal server error" }, { status: 500 });
  }
}
