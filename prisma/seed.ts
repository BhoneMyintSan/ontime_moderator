// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.createMany({
    data: [
      {
        full_name: "Alice Brown",
        email: "alice@example.com",
        phone: "+6612345678",
        status: "Active",
        warnings: 0,
      },
      {
        full_name: "John Doe",
        email: "john@example.com",
        phone: "+6687654321",
        status: "Suspended",
        warnings: 2,
      },
      {
        full_name: "Emily White",
        email: "emily@example.com",
        phone: "+6698765432",
        status: "Away",
        warnings: 1,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Dummy users created.");

  const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
  const john = await prisma.user.findUnique({ where: { email: 'john@example.com' } });

  if (alice && john) {
    await prisma.report.createMany({
      data: [
        {
          service_id: "SVD-201",
          reason: "Misconduct",
          note: "This provider is providing a service that is different from the description.",
          status: "Resolved",
          reported_by_id: alice.id,
          against_id: john.id,
        },
        {
          service_id: "SVD-202",
          reason: "Spam",
          note: "The user is sending unsolicited messages.",
          status: "Unresolved",
          reported_by_id: john.id,
          against_id: alice.id,
        },
      ],
      skipDuplicates: true,
    });
    console.log("✅ Dummy reports created.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
