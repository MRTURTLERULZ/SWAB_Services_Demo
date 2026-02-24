export const metadata = {
  title: "About Us",
  description: "Learn about our direct-booking vacation rentals in the Boston area, Concord, and Methuen.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About us</h1>
      <p className="text-muted-foreground leading-relaxed">
        We offer vacation rentals in Methuen, Concord, and the greater Boston area. By booking directly with us, you avoid extra fees and get the best rates. Our properties include a family-friendly home with a game room in Methuen and waterfront condos on Warner&apos;s Pond in Concord.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Contact us for any questions or to book your stay.
      </p>
    </div>
  );
}
