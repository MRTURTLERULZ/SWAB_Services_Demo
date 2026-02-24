import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewPropertyPage() {
  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-muted-foreground hover:underline mb-4 inline-block">← Properties</Link>
      <h1 className="text-2xl font-bold mb-6">Add property</h1>
      <p className="text-muted-foreground mb-4">Full property creation form can be added here. For now, add properties via Prisma seed or database.</p>
      <Button asChild><Link href="/admin/properties">Back to list</Link></Button>
    </div>
  );
}
