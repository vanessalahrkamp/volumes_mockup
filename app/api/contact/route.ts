import { NextResponse } from "next/server";
import { Resend } from "resend";

const LABELS: Record<string, string> = {
  seller: "Seller",
  buyer: "Buyer",
  investor: "Investor",
};

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  email: "Email",
  company: "Company",
  message: "Message",
  dataTypes: "Data types",
  note: "Notes",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields, humans don't. Pretend success.
  if (typeof data.company_website === "string" && data.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const label = LABELS[String(data.formType)] ?? "Website";
  const submitterEmail = String(data.email ?? "").trim();
  const submitterName =
    String(data.name ?? "").trim() || submitterEmail || "Someone";

  if (!EMAIL_PATTERN.test(submitterEmail)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  const lines = Object.entries(data)
    .filter(
      ([key, value]) =>
        !["company_website", "formType"].includes(key) &&
        value != null &&
        String(value).trim() !== "",
    )
    .map(([key, value]) => {
      const fieldLabel = FIELD_LABELS[key] ?? key;
      const text = Array.isArray(value) ? value.join(", ") : String(value);
      return `${fieldLabel}: ${text}`;
    })
    .join("\n");

  try {
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) {
      throw new Error(
        "RESEND_API_KEY / CONTACT_TO_EMAIL environment variables are not set",
      );
    }
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Volumes Website <forms@volumes.cloud>",
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: submitterEmail,
      subject: `New ${label} inquiry — ${submitterName}`,
      text: `New ${label} inquiry from the Volumes website:\n\n${lines}`,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
