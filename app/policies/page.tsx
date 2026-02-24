export const metadata = {
  title: "Policies",
  description: "House rules, cancellation policy, privacy, and terms for our vacation rentals.",
};

export default function PoliciesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Policies</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">House rules</h2>
        <p className="text-muted-foreground">
          Specific house rules are listed on each property page. Generally we ask for no smoking, no parties, and respect for neighbors. Check-in and check-out times are property-specific.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Cancellation</h2>
        <p className="text-muted-foreground">
          Cancellation policies vary by property and are shown on each listing. Full refunds are typically available when you cancel at least 7–14 days before check-in.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Privacy</h2>
        <p className="text-muted-foreground">
          We use your contact information only to process bookings and communicate about your stay. We do not share your data with third parties for marketing.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-3">Terms</h2>
        <p className="text-muted-foreground">
          By booking through this site you agree to the property&apos;s house rules and cancellation policy. Exact address and access details are provided after confirmation.
        </p>
      </section>
    </div>
  );
}
