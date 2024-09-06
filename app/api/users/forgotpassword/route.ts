import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import client from "@/db";

export async function POST(req: NextRequest) {
  try {
    const userId = await getDataFromToken(req);
    const { pass, newpass } = await req.json();
    const existingUser = await client.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) {
      return NextResponse.json({ msg: "User doesnt exists" }, { status: 400 });
    }
    const validPassword = await bcryptjs.compare(pass, existingUser.password);
    if (!validPassword) {
      return NextResponse.json({ msg: "Invalid password!" }, { status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newpass, salt);

    const updatedUser = await client.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { msg: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ msg: "internal server error" }, { status: 500 });
  }
}
