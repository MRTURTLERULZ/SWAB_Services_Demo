import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const propertyA = {
  slug: "family-retreat-methuen-game-room",
  name: "Family Retreat Methuen | 3BDR | Game Room | Boston | Salem",
  city: "Methuen",
  state: "MA",
  description: `Family-friendly entire home in Methuen with a dedicated game room. Perfect for families seeking a safe, quiet neighborhood near Boston and Salem. Full kitchen, on-site laundry, private driveway, dedicated workspace, fast WiFi, free parking, and TV. Great base for exploring Boston, Salem, and New Hampshire.`,
  highlights: [
    "Game room",
    "Family-friendly",
    "Safe, quiet neighborhood",
    "Full kitchen",
    "On-site laundry",
    "Private driveway",
    "Dedicated workspace",
    "WiFi",
    "Free parking",
    "TV",
    "Near Boston",
    "Near New Hampshire",
  ],
  amenities: [
    "Full kitchen",
    "Washer",
    "Dryer",
    "WiFi",
    "Free parking",
    "TV",
    "Dedicated workspace",
    "Private driveway",
  ],
  sleepingArrangement: [
    { room: "Bedroom 1", beds: "1 bed" },
    { room: "Bedroom 2", beds: "1 bed" },
    { room: "Bedroom 3", beds: "1 bed" },
  ],
  maxGuests: 6,
  bedrooms: 3,
  beds: 3,
  baths: 1,
  checkInTime: "4:00 PM",
  checkOutTime: "11:00 AM",
  minNights: 1,
  houseRules: "No smoking. No parties. Respect neighbors.",
  cancellationPolicy: "Full refund if cancelled at least 14 days before check-in.",
  showApproxMap: true,
  approxLat: 42.72,
  approxLng: -71.19,
  externalRating: 4.87,
  externalReviewCount: 30,
  externalSourceLabel: "Airbnb",
  featured: true,
};

const propertyB = {
  slug: "dreamy-waterfront-oasis-concord",
  name: "Dreamy Waterfront Oasis | 5★ Location, Queen Beds",
  city: "Concord",
  state: "MA",
  description: `Entire condo on Warner's Pond with lake access and garden/lake views. Fast Wi-Fi 180 Mbps and dedicated workspace—great for remote work. Self check-in smartlock. Fully equipped kitchen, driveway parking, patio. Near Minute Man National Historical Park, Old North Bridge, and Louisa May Alcott's Orchard House.`,
  highlights: [
    "Waterfront",
    "Warner's Pond",
    "Lake access",
    "Garden and lake views",
    "Fast Wi-Fi 180 Mbps",
    "Dedicated workspace",
    "Self check-in smartlock",
    "Fully equipped kitchen",
    "Driveway parking",
    "Patio",
  ],
  amenities: [
    "WiFi",
    "Kitchen",
    "Self check-in",
    "Parking",
    "Patio",
    "Lake access",
    "Dedicated workspace",
  ],
  sleepingArrangement: [
    { room: "Bedroom 1", beds: "1 queen bed" },
    { room: "Bedroom 2", beds: "1 queen bed" },
    { room: "Living room", beds: "1 sofa bed" },
  ],
  maxGuests: 5,
  bedrooms: 2,
  beds: 3,
  baths: 1,
  checkInTime: "4:00 PM",
  checkOutTime: "11:00 AM",
  minNights: 1,
  houseRules: "No smoking. No parties.",
  cancellationPolicy: "Full refund if cancelled at least 7 days before check-in.",
  showApproxMap: true,
  approxLat: 42.46,
  approxLng: -71.35,
  externalRating: 4.76,
  externalReviewCount: 181,
  externalSourceLabel: "Airbnb",
  featured: true,
};

const propertyC = {
  slug: "dreamy-waterfront-king-beds-concord",
  name: "Dreamy Waterfront Condo | 5★ Location, King Beds",
  city: "Concord",
  state: "MA",
  description: `Waterfront entire condo with garden and lake views. Self check-in smartlock. 65" Smart TV, fully equipped kitchen, patio, dining seating for 5. Perfect for families or small groups visiting Concord and Warner's Pond.`,
  highlights: [
    "Waterfront",
    "Garden and lake view",
    "Self check-in smartlock",
    "65\" Smart TV",
    "Fully equipped kitchen",
    "Patio",
    "Dining for 5",
  ],
  amenities: [
    "WiFi",
    "Kitchen",
    "Self check-in",
    "Parking",
    "Patio",
    "Smart TV",
  ],
  sleepingArrangement: [
    { room: "Bedroom 1", beds: "1 queen bed" },
    { room: "Bedroom 2", beds: "1 king bed" },
    { room: "Living room", beds: "Couch" },
  ],
  maxGuests: 5,
  bedrooms: 2,
  beds: 2,
  baths: 1,
  checkInTime: "4:00 PM",
  checkOutTime: "11:00 AM",
  minNights: 1,
  houseRules: "No smoking. No parties.",
  cancellationPolicy: "Full refund if cancelled at least 7 days before check-in.",
  showApproxMap: true,
  approxLat: 42.46,
  approxLng: -71.35,
  externalRating: 4.75,
  externalReviewCount: 79,
  externalSourceLabel: "Airbnb",
  featured: true,
};

const placeholderImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

async function main() {
  const a = await prisma.property.upsert({
    where: { slug: propertyA.slug },
    create: { ...propertyA },
    update: propertyA,
  });
  await prisma.propertyImage.deleteMany({ where: { propertyId: a.id } });
  await prisma.propertyImage.createMany({
    data: [
      { propertyId: a.id, url: placeholderImage, alt: "Family Retreat Methuen exterior", sortOrder: 0 },
      { propertyId: a.id, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", alt: "Game room", sortOrder: 1 },
      { propertyId: a.id, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", alt: "Living area", sortOrder: 2 },
    ],
  });
  await prisma.ratePlan.upsert({
    where: { propertyId: a.id },
    create: { propertyId: a.id, baseNightly: 185, weekendNightly: 210, cleaningFee: 125, taxRate: 0.0625, currency: "USD" },
    update: { baseNightly: 185, weekendNightly: 210, cleaningFee: 125, taxRate: 0.0625 },
  });

  const b = await prisma.property.upsert({
    where: { slug: propertyB.slug },
    create: { ...propertyB },
    update: propertyB,
  });
  await prisma.propertyImage.deleteMany({ where: { propertyId: b.id } });
  await prisma.propertyImage.createMany({
    data: [
      { propertyId: b.id, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80", alt: "Waterfront condo", sortOrder: 0 },
      { propertyId: b.id, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", alt: "Lake view", sortOrder: 1 },
      { propertyId: b.id, url: placeholderImage, alt: "Living space", sortOrder: 2 },
    ],
  });
  await prisma.ratePlan.upsert({
    where: { propertyId: b.id },
    create: { propertyId: b.id, baseNightly: 220, weekendNightly: 250, cleaningFee: 150, taxRate: 0.0625, currency: "USD" },
    update: { baseNightly: 220, weekendNightly: 250, cleaningFee: 150, taxRate: 0.0625 },
  });

  const c = await prisma.property.upsert({
    where: { slug: propertyC.slug },
    create: { ...propertyC },
    update: propertyC,
  });
  await prisma.propertyImage.deleteMany({ where: { propertyId: c.id } });
  await prisma.propertyImage.createMany({
    data: [
      { propertyId: c.id, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80", alt: "Waterfront condo", sortOrder: 0 },
      { propertyId: c.id, url: placeholderImage, alt: "King bed bedroom", sortOrder: 1 },
      { propertyId: c.id, url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80", alt: "Kitchen", sortOrder: 2 },
    ],
  });
  await prisma.ratePlan.upsert({
    where: { propertyId: c.id },
    create: { propertyId: c.id, baseNightly: 235, weekendNightly: 265, cleaningFee: 150, taxRate: 0.0625, currency: "USD" },
    update: { baseNightly: 235, weekendNightly: 265, cleaningFee: 150, taxRate: 0.0625 },
  });

  console.log("Seeded 3 properties with images and rate plans.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
