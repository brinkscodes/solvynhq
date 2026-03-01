import { NextResponse } from "next/server";

const PASSWORD = process.env.SOLVYNHQ_PASSWORD || "Mineral";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === PASSWORD) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("solvynhq_auth", "1", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
