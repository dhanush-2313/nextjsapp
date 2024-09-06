import { NextRequest, NextResponse } from "next/server";
import client from "@/db";
import { sendEmail } from "@/helpers/mailer";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest, res: NextResponse) {
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
      message: "user verified",
      success: true,
    });

    response.cookies.set("token", jwtToken, { httpOnly: true });
    await sendEmail({ email, emailType: "RESET", userId: user.id });

    return response;
  } catch (error) {
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}
