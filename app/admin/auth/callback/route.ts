import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get("next") || "/admin";
  const code = searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/admin/login?error=no_code", request.url));
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !user) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  }
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "").split(",").map((e) => e.trim()).filter(Boolean);
  const isAdminEmail = adminEmails.includes(user.email || "");
  const existing = await prisma.user.findUnique({ where: { supabaseAuthId: user.id } });
  if (existing) {
    if (existing.role !== "ADMIN" && isAdminEmail) {
      await prisma.user.update({ where: { id: existing.id }, data: { role: "ADMIN" } });
    }
  } else {
    const role = isAdminEmail ? "ADMIN" : "STAFF";
    await prisma.user.create({
      data: {
        supabaseAuthId: user.id,
        email: user.email || "",
        role,
      },
    });
  }
  const redirect = new URL(next, request.url);
  return NextResponse.redirect(redirect);
}
