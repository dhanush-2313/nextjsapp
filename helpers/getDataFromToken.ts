import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function getDataFromToken(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(decodedToken);

    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
