"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncButton({ calendarId }: { calendarId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/calendars/${calendarId}/sync`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        router.refresh();
      } else {
        alert(data.error || "Sync failed");
      }
    } catch {
      alert("Sync failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={loading}
      className="text-primary hover:underline disabled:opacity-50"
    >
      {loading ? "Syncing…" : "Sync now"}
    </button>
  );
}
