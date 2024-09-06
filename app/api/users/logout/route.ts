import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { msg: "Logout successful" },
      { status: 200 }
    );
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error: any) {
    return NextResponse.json({ msg: "some error" }, { status: 500 });
  }
}
