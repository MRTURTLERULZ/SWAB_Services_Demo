import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-2">Direct Book</h3>
            <p className="text-sm text-muted-foreground">
              Vacation rentals in Boston area, Concord, and Methuen. Book directly and save.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Explore</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/properties" className="hover:text-foreground">Properties</Link></li>
              <li><Link href="/methuen-vacation-rental" className="hover:text-foreground">Methuen</Link></li>
              <li><Link href="/concord-vacation-rental" className="hover:text-foreground">Concord</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Legal</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link href="/policies" className="hover:text-foreground">Policies</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Direct Book. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
