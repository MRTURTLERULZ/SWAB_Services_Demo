"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/blocks", label: "Availability" },
  { href: "/admin/calendars", label: "External calendars" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/audit", label: "Audit log" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-2 rounded-md text-sm ${pathname === href ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          {label}
        </Link>
      ))}
      <Link href="/" className="px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted mt-4">
        Back to site
      </Link>
    </nav>
  );
}
