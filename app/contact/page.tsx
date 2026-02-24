import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact",
  description: "Get in touch about our vacation rentals in Boston area, Concord, and Methuen.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="text-3xl font-bold mb-2">Contact us</h1>
      <p className="text-muted-foreground mb-8">
        Have a question or want to inquire about a property? Send us a message.
      </p>
      <ContactForm />
    </div>
  );
}
