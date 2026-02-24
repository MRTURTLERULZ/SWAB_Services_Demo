import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/admin-nav";
import { isDemoMode } from "@/lib/demo-data";

export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  if (isDemoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-lg border p-8 max-w-md text-center">
          <h1 className="text-xl font-semibold mb-2">Demo mode</h1>
          <p className="text-muted-foreground mb-4">
            The app is running without a database. Add <code className="text-sm bg-muted px-1">DATABASE_URL</code> and Supabase keys to .env to use the admin dashboard.
          </p>
          <Link href="/" className="text-primary hover:underline">Back to site</Link>
        </div>
      </div>
    );
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login?next=" + encodeURIComponent("/admin"));
  }
  const dbUser = await prisma.user.findUnique({
    where: { supabaseAuthId: user.id },
  });
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/admin/login?error=unauthorized");
  }
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-muted/30 p-4 flex flex-col">
        <Link href="/admin" className="font-semibold mb-4">Admin</Link>
        <AdminNav />
      </aside>
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
