import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import client from "@/db";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const userId = await getDataFromToken(req);
    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    return NextResponse.json(
      { msg: " user found", data: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
