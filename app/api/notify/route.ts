import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Waitlist storage isn't wired up yet — log so requests are at least
  // visible in server output until a real destination (DB/Mailchimp) exists.
  console.log(`[notify] investor access request: ${email}`);

  return NextResponse.json({ ok: true });
}
