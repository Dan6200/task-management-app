//cspell:ignore nextjs
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const userId = auth().userId;
    if (userId) {
      return NextResponse.json({ userId });
    } else {
      return NextResponse.json({ error: "Not logged in" });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" + err });
  }
};
