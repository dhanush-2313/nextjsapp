import client from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();
    const { token } = body;
    console.log(token);
    const user = await client.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }
    console.log(user);

    await client.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: undefined,
        verifyTokenExpiry: undefined,
      },
    });
    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}
