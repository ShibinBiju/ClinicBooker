import { db } from "./app";
import { doctors } from "@shared/schema";

const seedDoctors = [
  {
    name: "Dr. Sarah Chen",
    specialty: "Cardiologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [1, 2, 3, 4, 5],
  },
  {
    name: "Dr. Michael Ross",
    specialty: "Dermatologist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [1, 3, 5],
  },
  {
    name: "Dr. Emily Watson",
    specialty: "Pediatrician",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [2, 4, 6],
  },
  {
    name: "Dr. James Carter",
    specialty: "General Practitioner",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    availableDays: [1, 2, 3, 4, 5],
  },
];

async function seed() {
  console.log("Seeding database...");
  
  // Check if doctors already exist
  const existingDoctors = await db.select().from(doctors);
  
  if (existingDoctors.length > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  // Insert doctors
  await db.insert(doctors).values(seedDoctors);
  
  console.log("✓ Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
