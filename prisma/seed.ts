import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create an agency
  const agency = await prisma.agency.create({
    data: {
      name: "Jakarta Public Works Department",
      description: "Responsible for public infrastructure and services in Jakarta",
      email: "contact@jakarta-pwd.go.id",
      phone: "+62211234567",
    },
  });

  console.log(`Created agency: ${agency.name}`);

  // Create a super admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@civicpulse.id",
      passwordHash: "$2b$10$O0a1.V60Lz5x33iTQ8C8Le592hZ6fK6qJ3pY8b1e4r5e6w7q8e9r0t1y2u3i4o5p6", // "password123"
      fullName: "System Administrator",
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Created admin: ${admin.email}`);

  // Create an officer
  const officer = await prisma.user.create({
    data: {
      email: "officer@civicpulse.id",
      passwordHash: "$2b$10$O0a1.V60Lz5x33iTQ8C8Le592hZ6fK6qJ3pY8b1e4r5e6w7q8e9r0t1y2u3i4o5p6", // "password123"
      fullName: "John Officer",
      role: "OFFICER",
      agencyId: agency.id,
    },
  });

  console.log(`Created officer: ${officer.email}`);

  // Create a citizen
  const citizen = await prisma.user.create({
    data: {
      email: "citizen@civicpulse.id",
      passwordHash: "$2b$10$O0a1.V60Lz5x33iTQ8C8Le592hZ6fK6qJ3pY8b1e4r5e6w7q8e9r0t1y2u3i4o5p6", // "password123"
      fullName: "Jane Citizen",
      role: "CITIZEN",
    },
  });

  console.log(`Created citizen: ${citizen.email}`);

  // Create a location
  const location = await prisma.location.create({
    data: {
      latitude: -6.2088,
      longitude: 106.8456,
      address: "Jalan Thamrin No. 1",
      district: "Menteng",
      city: "Jakarta Pusat",
      province: "DKI Jakarta",
      postalCode: "10350",
    },
  });

  console.log(`Created location: ${location.address}`);

  // Create a sample report
  const reportNumber = `CP-${new Date().getFullYear()}${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}-0001`;

  const report = await prisma.report.create({
    data: {
      reportNumber,
      title: "Damaged Road Near Thamrin",
      description:
        "There is a large pothole on Jalan Thamrin that is causing traffic congestion and accidents. Please repair as soon as possible.",
      category: "INFRASTRUCTURE",
      priority: "HIGH",
      status: "SUBMITTED",
      citizenId: citizen.id,
      agencyId: agency.id,
      locationId: location.id,
    },
  });

  console.log(`Created report: ${report.reportNumber}`);

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
